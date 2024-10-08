import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';
import { StorageService } from 'src/app/services/storage.service';
import { LmmRestService } from 'src/app/services/api/lmm-rest.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  const messageContent = 'Success message';
  const lmmRestService = {
    post: (url: string, body: any) => of(true),
    delete: (url: string) => of(messageContent),
    getDataBody: (url: string) => of(true),
    put: (url: string, body: any) => of(messageContent),
    getStringDataBody: (url: string) => of(true)
  };
  const storageService = jasmine.createSpyObj('StorageService', ['sessionId']);
  const apiPath = environment.host + '/auth-service/v1.0/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: LmmRestService, useValue: lmmRestService },
        { provide: StorageService, useValue: storageService }
      ]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login', () => {
    const username = 'testUser';
    const password = 'testPassword';
    const url = apiPath + 'session';
    const expectedBody = {
      name: username,
      password: password
    };
    service.login(username, password);
    lmmRestService.post(url, expectedBody).subscribe(res => {
      expect(res).toBe(true);
    });
  });

  it('should call logOut', () => {
    const url = apiPath + `session/${sessionStorage.getItem('sessionId')}`;
    service.logOut();
    lmmRestService.delete(url).subscribe(res => {
      expect(res).toEqual(messageContent);
    });
  });

  it('should call getTimeoutValue', () => {
    const url = apiPath + 'session/time-out';
    service.getTimeoutValue();
    lmmRestService.getDataBody(url).subscribe(res => {
      expect(res).toBe(true);
    });
  });

  it('should call refreshUserSession', () => {
    const url = apiPath + 'session';
    service.refreshUserSession();
    lmmRestService.put(url, {}).subscribe(res => {
      expect(res).toEqual(messageContent);
    });
  });

  it('should call validateSession', () => {
    const url = apiPath + `session/validation/${sessionStorage.getItem('sessionId')}`;
    service.validateSession();
    lmmRestService.getDataBody(url).subscribe(res => {
      expect(res).toBe(true);
    });
  });

  it('should call getCLLI function', () => {
    const url = apiPath + 'getCLLI';
    service.getCLLI();
    lmmRestService.getStringDataBody(url).subscribe(res => {
      expect(res).toBe(true);
    });
  });
});
