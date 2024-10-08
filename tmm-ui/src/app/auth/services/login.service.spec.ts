import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoginService } from './login.service';
import { StorageService } from 'src/app/services/storage.service';
import { AuthenticationService } from './authentication.service';

describe('LoginService', () => {
  let service: LoginService;
  const authService = jasmine.createSpyObj('authService', ['login']);
  const storageService = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: authService },
        { provide: StorageService, useValue: storageService }
      ]
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login', () => {
    const username = 'cmtg';
    const password = 'cmtg';
    service.login(username, password);
    expect(authService.login).toHaveBeenCalled();
  });

  it('should call isLoginSuccess', () => {
    const res = service.isLoginSuccess(true);
    expect(res).toBeTrue();
  });

  it('should call isLoginSuccess', () => {
    const res = service.isLoginSuccess(new HttpResponse());
    expect(res).toBeTrue();
  });

  it('should call getErrorMessage', () => {
    const res = { error: { message: 'Login Fail' }};
    const result = service.getErrorMessage(res);
    result.subscribe(rs => {
      expect(rs).toEqual('Login Fail');
    });
  });

  it('should call parseError', () => {
    const error = 'Login Fail';
    const res = service.parseError(error);
    expect(res).toEqual(error);
  });

  it('should call parsePasswordChange', () => {
    const res = service.parsePasswordChange(new HttpResponse());
    expect(res).toEqual(false);
  });
});
