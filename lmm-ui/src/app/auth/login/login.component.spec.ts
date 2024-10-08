import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthModule } from '../auth.module';
import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { CommonService } from 'src/app/services/common.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const commonService = jasmine.createSpyObj('messService', ['showAPIError']);

  const authService = jasmine.createSpyObj('authService', ['getCLLI']);

  const preferencesService = jasmine.createSpyObj('preferencesService', ['handlePreferencesStorage']);

  const router = jasmine.createSpyObj('router', ['navigateByUrl']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        AuthModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: authService },
        { provide: PreferencesService, useValue: preferencesService },
        { provide: Router, useValue: router },
        { provide: CommonService, useValue: commonService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService.getCLLI.and.returnValue(of('CO24'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCLLI failed', () => {
    authService.getCLLI.and.returnValue(throwError('error'));
    component.ngOnInit();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call onSuccessfulLogin', () => {
    const res: any = { };
    component.onSuccessfulLogin(res);
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
