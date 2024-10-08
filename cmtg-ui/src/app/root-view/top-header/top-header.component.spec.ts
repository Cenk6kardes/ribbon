import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';

import { CommonService } from 'src/app/services/common.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';

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
        TOP_HEADER_TITLE: 'CMTG',
        TMA15: 'TMA15'
      },
      PROFILE: {
        PROJECT_NAME: 'C20 Management Tools',
        PREFERENCES: 'Preferences',
        RECONNECT: 'Reconnect',
        LOGOUT: 'Log Out',
        SOFTWARE_INFORMATION: 'Software Information',
        REFRESH_GWC_STATUS: 'Refresh GWC Status',
        HELP_CENTER: 'Help Center',
        HELP: 'Help',
        RECONNECT_MESSAGE: {
          SUCCESS: 'SUCCESS'
        }
      }
    }
  };

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError', 'getCurrentTime', 'showSuccessMessage']);

  const AuthService = jasmine.createSpyObj('AuthenticationService', ['AuthService', 'logOut']);

  const storageService = jasmine.createSpyObj('StorageService', ['removeStorageData', 'cBMgIP', 'clli']);

  const titleService = jasmine.createSpyObj('Title', ['setTitle']);

  const router = jasmine.createSpyObj('Router', ['navigate']);

  const homeService = jasmine.createSpyObj('homeService', ['getProperties']);

  const networkService = jasmine.createSpyObj('networkService', ['getCMCLLI']);

  const topHeaderService = jasmine.createSpyObj('topHeaderService', ['getSoftwareInfo']);

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
        { provide: CommonService, useValue: commonService },
        { provide: NetworkViewService, useValue: networkService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TopHeaderComponent);
    component = fixture.componentInstance;
    const responseOfGetProperties = [
      {
        'key': 'ptm.smallline.endpointname.flexenabled',
        'value': 'TRUE'
      }];
    homeService.getProperties.and.returnValue(of(responseOfGetProperties));
    networkService.getCMCLLI.and.returnValue(of('CO39'));
    topHeaderService.getSoftwareInfo.and.returnValue(of('Version: CMTg-7.0.0.240612\nCMTg07 Build: Feb 11, 2023 7:59:07 PM'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call generateProfiles', () => {
    storageService.cBMgIP.and.returnValues('192.168.0.1');

    const profiles: MenuItem[] = component.generateProfiles();

    expect(profiles[0].label).toBe('Admin');
    expect(profiles[0].icon).toBe('fa fa-user-circle');
    expect(profiles[0].expanded).toBeTrue();
    const adminItems = profiles[0].items as MenuItem[];
    expect(adminItems).toBeDefined();
    expect(adminItems.length).toBe(3);
    expect(adminItems[0].label).toBe(translate.translateResults.PROFILE.SOFTWARE_INFORMATION);
    expect(adminItems[0].icon).toBe('pi pi-info-circle');
    expect(typeof adminItems[0].command).toBe('function');
    expect(adminItems[1].label).toBe(translate.translateResults.PROFILE.REFRESH_GWC_STATUS);
    expect(adminItems[1].icon).toBe('fa fa-refresh');
    expect(typeof adminItems[1].command).toBe('function');
    expect(adminItems[2].label).toBe(translate.translateResults.PROFILE.LOGOUT);
    expect(adminItems[2].icon).toBe('pi pi-sign-out');
    expect(typeof adminItems[2].command).toBe('function');

    expect(profiles[1].label).toBe(translate.translateResults.PROFILE.HELP_CENTER);
    expect(profiles[1].icon).toBe('fa fa-question-circle');
    expect(profiles[1].expanded).toBe(true);
    const helpCenterItems = profiles[1].items as MenuItem[];
    expect(helpCenterItems).toBeDefined();
    expect(helpCenterItems.length).toBe(1);
    expect(helpCenterItems[0].label).toBe(translate.translateResults.PROFILE.HELP);
    expect(helpCenterItems[0].icon).toBe('pi pi-file');
  });

  it('should call initTopbar', () => {
    component.initTopbar();
    expect(component.pageTop.logo.productName).toBe(translate.translateResults.PROFILE.PROJECT_NAME);
    expect(component.pageTop.logo.noneUppercase).toBe(true);
    expect(component.pageTop.productInfo?.productTitle).toBe('');
    expect(component.pageTop.profiles.length).toBe(2);
  });

  it('should call changeTitle with CLLI name', () => {
    const clliName = 'CLLI Name';
    component.changeTitle(clliName);
    expect(titleService.setTitle).toHaveBeenCalledWith('C20 Management Tools | ' + clliName);
  });

  it('should call changeTitle', () => {
    component.changeTitle();
    expect(titleService.setTitle).toHaveBeenCalledWith(translate.translateResults.PROFILE.PROJECT_NAME);
  });

  it('should call onHidePreferences', () => {
    component.isShowPreferences = true;
    component.onHidePreferences();
    expect(component.isShowPreferences).toBeFalsy();
  });

  it('should call updateProductTitle with clliName', () => {
    const clliName = 'CLLI123';
    component.updateProductTitle(clliName);
    expect(component.pageTop.productInfo?.productTitle).toBe('| CLLI123');
  });

  it('should call updateProductTitle clliName is not empty', () => {
    component.updateProductTitle();
    expect(component.pageTop.productInfo?.productTitle).toBe('');
  });

  it('should hide confirm logout when the user clicks on the No button', () => {
    component.confirmLogout(false);
    expect(component.showLogout).toEqual(false);
  });

});
