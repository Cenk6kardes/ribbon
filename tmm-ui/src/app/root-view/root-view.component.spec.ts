import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateInternalService } from '../services/translate-internal.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { HttpLoaderFactory } from '../shared/http-loader-factory';
import { RootViewComponent } from './root-view.component';
import { CommonService } from '../services/common.service';
import { StorageService } from '../services/storage.service';
import { AuthenticationService } from '../auth/services/authentication.service';
import { NgIdleModule, Idle } from '@ng-idle/core';

describe('RootViewComponent', () => {
  let component: RootViewComponent;
  let fixture: ComponentFixture<RootViewComponent>;
  const translate = {
    translateResults: {
      SIDEBAR: {
        HOME_LABEL: 'Home',
        REPORT_LABEL: 'Report'
      },
      TOP_HEADER: {
        TOP_HEADER_TITLE: ''
      },
      PROFILE: {
        PREFERENCES: 'Preferences',
        RECONNECT: 'Reconnect',
        LOGOUT: 'Log Out',
        HELP_CENTER: 'Help Center',
        HELP: 'Help'
      }
    }
  };

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError']);

  const stoService = jasmine.createSpyObj('stoService', ['removeStorageData']);


  const router = jasmine.createSpyObj('router', ['navigateByUrl', 'navigate']);

  const idle = {
    setIdle: () => console.log('setIdle'),
    getIdle: () => console.log('setIdle'),
    setInterrupts: () => console.log('setInterrupts'),
    watch: () => console.log('watch'),
    stop: () => console.log('stop'),
    onIdleStart: of(true)
  };

  const authService = jasmine.createSpyObj('authService', {
    validateSession: of(true),
    logOut: of(true),
    getTimeoutValue: of('8400;600;60'),
    refreshUserSession: of(true)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RootViewComponent
      ],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule.withRoutes([]),
        NgIdleModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: CommonService, useValue: commonService },
        { provide: StorageService, useValue: stoService },
        { provide: Idle, useValue: idle },
        { provide: Router, useValue: router },
        { provide: AuthenticationService, useValue: authService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RootViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call menuItemClicked', () => {
    const data = { path: '/home' };
    component.menuItemClicked(data);
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should return a invalid session', () => {
    spyOn(component, 'navigateToLoginPage');
    authService.validateSession.and.returnValue(throwError('Error'));
    component.checkValidSession();
    expect(component.navigateToLoginPage).toHaveBeenCalled();
  });

  it('should set idleTime to sessionStorage', () => {
    spyOn(component, 'refreshSessionBeforeExpiredTime');
    spyOn(component, 'setIdleParameters');
    authService.getTimeoutValue.and.returnValue(of('8400;600;60'));
    component.setIdleTime();
    expect(component.refreshSessionBeforeExpiredTime).toHaveBeenCalled();
  });

  it('should return a valid session', () => {
    spyOn(component, 'setIdleTime');
    authService.validateSession.and.returnValue(of(true));
    component.checkValidSession();
    expect(component.setIdleTime).toHaveBeenCalled();
  });

  it('should show the error message when can not get the session timeout', () => {
    authService.getTimeoutValue.and.returnValue(throwError('Error'));
    component.setIdleTime();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call logout function when the user clicks on the yes button on the  Logout popup', () => {
    spyOn(component, 'logout');
    component.confirmLogout();
    expect(component.logout).toHaveBeenCalled();
  });

  it('should show the error message when logout fails', () => {
    spyOn(component, 'navigateToLoginPage');
    authService.logOut.and.returnValue(throwError('Error'));
    component.logout();
    expect(commonService.showAPIError).toHaveBeenCalled();
    expect(component.navigateToLoginPage).toHaveBeenCalled();
    expect(component.isLoading).toEqual(false);
  });

  it('should call refresh session function', () => {
    spyOn(component, 'setIdleTime');
    authService.refreshUserSession.and.returnValue(of(true));
    component.refreshSession();
    expect(component.setIdleTime).toBeTruthy();
  });

  it('should return the error message when refresh user\'s session fails', () => {
    authService.refreshUserSession.and.returnValue(throwError('Error'));
    component.refreshSession();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });
});
