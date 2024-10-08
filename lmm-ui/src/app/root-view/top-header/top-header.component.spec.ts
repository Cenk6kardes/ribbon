import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';
import { IStatusIndicators, Status } from 'rbn-common-lib';

import { LineMaintenanceManagerService } from 'src/app/services/api/line-maintenance-manager.service';
import { CommonService } from 'src/app/services/common.service';
import { HomeService } from 'src/app/modules/home/services/home.service';
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
        TOP_HEADER_TITLE: 'Line Maintenance Manager',
        TMA15: 'TMA15'
      },
      PROFILE: {
        PROJECT_NAME: 'Line Maintenance Manager',
        PREFERENCES: 'Preferences',
        RECONNECT: 'Reconnect',
        LOGOUT: 'Log Out',
        SYSTEM_INFORMATION: 'System Information',
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

  const lmmService = jasmine.createSpyObj('lmmService', ['getCBMgIP', 'getCLLI']);

  const homeService = jasmine.createSpyObj('homeService', ['getProperties']);

  const networkService = jasmine.createSpyObj('networkService', ['getCMCLLI']);

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
        { provide: LineMaintenanceManagerService, useValue: lmmService },
        { provide: Router, useValue: router },
        { provide: CommonService, useValue: commonService },
        { provide: HomeService, useValue: homeService },
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
    spyOn(storageService, 'cBMgIP').and.returnValues('192.168.0.1');
    const profiles: MenuItem[] = component.generateProfiles();

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
    expect(profiles[1].label).toBe('System Information');
    expect(profiles[1].icon).toBe('fa fa-exclamation-circle');
    expect(profiles[1].expanded).toBe(true);

    const systemInfoItems = profiles[1].items;
    expect(systemInfoItems).toBeDefined();

    if (systemInfoItems) {
      expect(systemInfoItems.length).toBe(1);
      expect(systemInfoItems[0].label).toEqual(jasmine.any(String));
    }

    expect(profiles[2].label).toBe('Help Center');
    expect(profiles[2].icon).toBe('fa fa-question-circle');
    expect(profiles[2].expanded).toBe(true);

    const helpCenterItems = profiles[2].items;
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
    spyOn(component, 'updateTopbarData');
    expect(component.pageTop.logo.productName).toBe(translate.translateResults.PROFILE.PROJECT_NAME);
    expect(component.pageTop.logo.noneUppercase).toBe(true);
    expect(component.pageTop.productInfo?.productTitle).toBe('| CLLI123');
    expect(component.pageTop.profiles.length).toBe(3);
  });

  it('should call changeTitle with CLLI name', () => {
    const clliName = 'CLLI Name';
    component.changeTitle(clliName);
    expect(titleService.setTitle).toHaveBeenCalledWith('LMM | ' + clliName);
  });

  it('should call changeTitle', () => {
    component.changeTitle();
    expect(titleService.setTitle).toHaveBeenCalledWith('Line Maintenance Manager');
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

  it('should call updateTopbarData', () => {
    component.updateTopbarData();
    expect(storageService.cBMgIP).toBe('192.168.0.1');
    expect(lmmService.getCBMgIP).toHaveBeenCalled();
    expect(storageService.clli).toBe('CLLI123');
    expect(lmmService.getCLLI).toHaveBeenCalledWith('192.168.0.1');
    expect(component.statusIndicators[0].status).toBe(Status.SUCCESS);
    expect(component.pageTop.profiles).toBeDefined();
  });

  it('should call updateTopbarData error while getCBMgIP', () => {
    lmmService.getCBMgIP.and.returnValue(throwError('error'));
    component.updateTopbarData();
    expect(storageService.cBMgIP).toBe('');
    expect(lmmService.getCBMgIP).toHaveBeenCalled();
    expect(component.statusIndicators[0].status).toBe(Status.FAULT);
    expect(component.pageTop.profiles).toBeDefined();
  });

  it('should call updateTopbarData error while getCLLI', () => {
    lmmService.getCLLI.and.returnValue(throwError('error'));
    component.updateTopbarData();
    expect(storageService.cBMgIP).toBe('192.168.0.1');
    expect(lmmService.getCBMgIP).toHaveBeenCalled();
    expect(lmmService.getCLLI).toHaveBeenCalledWith('192.168.0.1');
    expect(storageService.clli).toBe('');
    expect(component.pageTop.profiles).toBeDefined();
  });

  it('should hide confirm logout when the user clicks on the No button', () => {
    component.confirmLogout(false);
    expect(component.showLogout).toEqual(false);
  });
});
