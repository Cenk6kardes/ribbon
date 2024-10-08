import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';
import { IStatusIndicators, Status } from 'rbn-common-lib';

import { CommonService } from 'src/app/services/common.service';

import { TopHeaderComponent } from './top-header.component';
import { AppModule } from 'src/app/app.module';
import { Title } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TopHeaderComponent', () => {
  let component: TopHeaderComponent;
  let fixture: ComponentFixture<TopHeaderComponent>;
  const translate = {
    translateResults: {
      TOP_HEADER: {
        TOP_HEADER_TITLE: 'Trunk Maintenance Manager',
        TMA15: 'TMA15'
      },
      PROFILE: {
        PROJECT_NAME: 'Trunk Maintenance Manager',
        PREFERENCES: 'Preferences',
        RECONNECT: 'Reconnect',
        LOGOUT: 'Log Out',
        HELP_CENTER: 'Help Center',
        HELP: 'Help'
      }
    }
  };

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError', 'getCurrentTime', 'showSuccessMessage']);

  const AuthService = jasmine.createSpyObj('AuthenticationService', ['AuthService', 'logOut']);

  const storageService = jasmine.createSpyObj('StorageService', ['removeStorageData', 'cBMgIP', 'clli']);

  const titleService = jasmine.createSpyObj('Title', ['setTitle']);

  const router = jasmine.createSpyObj('Router', ['navigate']);

  const lmmService = jasmine.createSpyObj('lmmService', ['getCBMgIP', 'getCLLI']);

  const homeService = jasmine.createSpyObj('homeService', ['getProperties']);

  const networkService = jasmine.createSpyObj('networkService', ['getCMCLLI']);

  const expectedStatusIndicators: IStatusIndicators[] = [
    { title: 'LMM Server', status: Status.UNKNOWN },
    { title: 'BMU', status: Status.UNKNOWN },
    { title: 'OSS Comms', status: Status.UNKNOWN },
    { title: 'DMA', status: Status.UNKNOWN }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopHeaderComponent],
      imports: [AppModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: AuthenticationService, useValue: AuthService },
        { provide: StorageService, useValue: storageService },
        { provide: Title, useValue: titleService },
        { provide: Router, useValue: router },
        { provide: CommonService, useValue: commonService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TopHeaderComponent);
    component = fixture.componentInstance;
    const responseOfGetProperties = [
      {
        'key': 'ptm.smallline.endpointname.flexenabled',
        'value': 'TRUE'
      }];
    lmmService.getCBMgIP.and.returnValue(of('192.168.0.1'));
    lmmService.getCLLI.and.returnValue(of('CLLI123'));
    homeService.getProperties.and.returnValue(of(responseOfGetProperties));
    networkService.getCMCLLI.and.returnValue(of('CO39'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call generateProfiles', () => {
    const baseURL = window.location.origin;
    storageService.cBMgIP.and.returnValues('192.168.0.1');
    const profiles: MenuItem[] = component.generateProfiles();
    console.log(profiles);
    expect(profiles[0].label).toBe('Admin');
    expect(profiles[0].icon).toBe('fa fa-user-circle');
    expect(profiles[0].expanded).toBeTrue();

    const adminItems = profiles[0].items;
    expect(adminItems).toBeDefined();

    if (adminItems) {
      expect(adminItems.length).toBe(2);
      expect(adminItems[0].label).toBe('Preferences');
      expect(adminItems[0].icon).toBe('pi pi-cog');

      expect(adminItems[1].label).toBe('Log Out');
      expect(adminItems[1].icon).toBe('pi pi-sign-out');
      expect(typeof adminItems[1].command).toBe('function');
    }

    expect(profiles[1].label).toBe('Help Center');
    expect(profiles[1].icon).toBe('fa fa-question-circle');
    expect(profiles[1].expanded).toBe(true);

    const helpCenterItems = profiles[1].items;
    expect(helpCenterItems).toBeDefined();

    if (helpCenterItems) {
      expect(helpCenterItems.length).toBe(1);
      expect(helpCenterItems[0].label).toBe('Help');
      expect(helpCenterItems[0].icon).toBe('pi pi-file');
      expect(helpCenterItems[0].url).toBe('#/help');
    }
  });

  it('should call initTopbar', () => {
    component.initTopbar();
    expect(component.pageTop.logo.productName).toBe(translate.translateResults.PROFILE.PROJECT_NAME);
    expect(component.pageTop.logo.noneUppercase).toBe(true);
    expect(component.pageTop.productInfo?.productTitle).toBe('');
    expect(component.pageTop.profiles.length).toBe(2);
  });

  it('should call onHidePreferences', () => {
    component.isShowPreferences = true;
    component.onHidePreferences();
    expect(component.isShowPreferences).toBeFalsy();
  });

  it('should call confirmLogout success', () => {
    spyOn(component.confirmAgreeLogout, 'emit');
    component.confirmLogout(true);
    expect(component.confirmAgreeLogout.emit).toHaveBeenCalled();
  });

  it('should call confirmLogout failed', () => {
    component.confirmLogout(false);
    expect(component.showLogout).toEqual(false);
  });
});
