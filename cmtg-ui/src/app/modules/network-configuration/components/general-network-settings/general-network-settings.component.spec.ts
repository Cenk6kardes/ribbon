import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralNetworkSettingsComponent } from './general-network-settings.component';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { of, throwError } from 'rxjs';

describe('GeneralNetworkSettingsComponent', () => {
  let component: GeneralNetworkSettingsComponent;
  let fixture: ComponentFixture<GeneralNetworkSettingsComponent>;

  const translate = {
    translateResults: {
      COMMON: {
        DELETE: 'Delete',
        OK: 'OK',
        CLOSE: 'Close',
        BULK_ACTIONS: 'Bulk Action',
        ACTION: 'Action',
        RUN: 'Run',
        POST_COMMAND_LABEL: 'Post',
        CANCEL: 'Cancel',
        SAVE: 'Save',
        ERROR: 'Error',
        ADD: 'Add',
        YES: 'Yes',
        NO: 'No',
        FORM_NOT_VALID: 'Form not valid',
        SELECT:'Select',
        RESET: 'Reset',
        NOT_CONFIGURED: 'Not Configured',
        ACTION_FAILED: 'Action Failed!',
        SHOW_DETAILS: 'Show Details',
        HIDE_DETAILS: 'Hide Details',
        ENABLED: 'Enabled',
        DISABLED: 'Disabled'
      },
      NETWORK: {
        HEADER: {
          TITLE: 'Network Devices',
          GENERAL_NETWORK_SETTING: 'General Network Setting'
        },
        GENERAL_NETWORK_SETTINGS: {
          TITLE: 'General Network Settings',
          CALL_AGENT_IP_ADDRESS_ZERO: 'Call Agent IP Address 0:',
          CALL_AGENT_IP_ADDRESS_ONE: 'Call Agent IP Address 1:',
          GWC_DOMAIN_NAME: 'GWC Domain Name:',
          INPUT_NAME: 'Input Name:',
          NAME: 'name',
          ACTION_FAILED: 'Action Failed!',
          SHOW_DETAILS: 'Show Details',
          HIDE_DETAILS: 'Hide Details',
          CONFIRM: 'Confirm Domain Name Change',
          CONFIRM_MESSAGE_DETAIL: 'Warning! <br><br>Before changing the GWC domain name, you must be sure that the <br>' +
            'domain names for ALL GWCs are correctly provisioned in the DNS <br>Server, matching the domain name you just entered.'+
            ' If any of the <br>GWC domain names are incorrectly provisioned or missing from the <br>DNS Server,'+
            ' this will cause a call-processing outage.<br><br>Changing the domain name will affect all GWCs. Continue?<br>'
        }
      }
    }
  };

  const errorForUpdateGWC = {
    errorCode: '500',
    message: 'message = Problem occured in updating GWC domain name  details = Failures encountered:\nFailed to update GWC-6-UNIT-0\n' +
      'Failed to update GWC-6-UNIT-1'
  };

  const networkConfigurationService = jasmine.createSpyObj('networkConfigurationService',
    ['getGWCDomainName', 'getCallAgentIP', 'updateGWCDomainName']);

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralNetworkSettingsComponent, SafePipe],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: NetworkConfigurationService, useValue: networkConfigurationService },
        { provide: CommonService, useValue: commonService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GeneralNetworkSettingsComponent);
    component = fixture.componentInstance;
    networkConfigurationService.getGWCDomainName.and.returnValue(of('test'));
    networkConfigurationService.getCallAgentIP.and.returnValue(of([ '10.254.166.44', '10.254.166.45' ]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    spyOn(component, 'initForm');

    component.ngOnInit();

    expect(component.initForm).toHaveBeenCalled();
  });

  it('should detect changes in gwcDomainNameToggleBtn', () => {
    spyOn( component, 'checkAndSetStatus');
    const gwcDomainNameToggleBtn = component.generalNetworkSettingsFormGroup.get('gwcDomainNameToggleBtn');

    // Set initial value to false
    gwcDomainNameToggleBtn?.setValue(false);
    // Change value
    gwcDomainNameToggleBtn?.setValue(true);

    // Check if previousValue updated and method checkAndSetStatus is called
    expect(component.previousValue).toBe(true);
    expect(component.checkAndSetStatus).toHaveBeenCalled();
  });

  it('should detect changes in inputName', () => {
    const inputName = component.generalNetworkSettingsFormGroup.get('inputName');

    // Set initial value
    inputName?.setValue('InitialValue');
    // Change value
    inputName?.setValue('NewValue');

    // Check if hasInputValueChanged is updated to true
    expect(component.hasInputValueChanged).toBe(true);
  });

  it('should set hasInputValueChanged to false if inputName value does not change', () => {
    const inputName = component.generalNetworkSettingsFormGroup.get('inputName');

    // Check if hasInputValueChanged to be false
    expect(component.hasInputValueChanged).toBe(false);
  });

  // checkAndSetStatus()
  it('should set toggle status enabled if data comes in checkAndSetStatus function', () => {
    component.previousInputNameValue = 'previousNameValue';
    const inputNameControl = component.generalNetworkSettingsFormGroup.get('inputName');

    component.checkAndSetStatus(true);

    expect(component.toggleStatus).toBe(translate.translateResults.COMMON.ENABLED);
    expect(component.isSaveBtnEnable).toBeTrue();
    expect(component.generalNetworkSettingsFormGroup.controls['inputName'].value).toEqual('previousNameValue');
    expect(inputNameControl?.enabled).toBeTrue();
  });

  it('should set toggle status disabled if data comes false or null in checkAndSetStatus function', () => {
    const inputNameControl = component.generalNetworkSettingsFormGroup.get('inputName');

    component.checkAndSetStatus(false);

    expect(component.toggleStatus).toBe(translate.translateResults.COMMON.DISABLED);
    expect(component.isSaveBtnEnable).toBeFalse();
    expect(component.generalNetworkSettingsFormGroup.controls['inputName'].value).toEqual('');
    expect(inputNameControl?.disabled).toBeTrue();
  });

  it('should call closeGeneralNetworkSettings()', () => {
    component.closeGeneralNetworkSettings();

    expect(component.showGeneralNetworkSettings).toBeFalse();
  });

  it('should call generalNetworkSettingsFormFooterHandler() with event=true', () => {
    component.generalNetworkSettingsFormFooterHandler(true);

    expect(component.showConfirmPopup).toBe(true);
  });

  it('should call generalNetworkSettingsFormFooterHandler() with event=false', () => {
    component.generalNetworkSettingsFormFooterHandler(false);

    expect(component.showGeneralNetworkSettings).toBe(false);
  });

  it('should call showConfirmPopupFooterHandler() with event=true', () => {
    spyOn(component, 'updateGWCDomainName');

    component.showConfirmPopupFooterHandler(true);

    expect(component.updateGWCDomainName).toHaveBeenCalled();
  });

  it('should call showConfirmPopupFooterHandler() with event=false', () => {
    component.showConfirmPopupFooterHandler(false);

    expect(component.showConfirmPopup).toBe(false);
  });

  it('should call closeConfirmPopup()', () => {
    component.closeConfirmPopup();

    expect(component.showConfirmPopup).toBe(false);
  });

  // getGWCDomainName()
  it('should call getGWCDomainName() with available response', () => {
    spyOn(component, 'checkAndSetStatus');
    networkConfigurationService.getGWCDomainName.and.returnValue(of('test'));
    component.getGWCDomainName();

    expect(networkConfigurationService.getGWCDomainName).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.generalNetworkSettingsFormGroup.controls['gwcDomainNameToggleBtn'].value).toBeTrue();
    expect(component.generalNetworkSettingsFormGroup.controls['inputName'].value).toEqual('test');
    expect(component.previousInputNameValue).toEqual('test');
    expect(component.checkAndSetStatus).toHaveBeenCalledWith('test');
  });

  it('should call getGWCDomainName() with empty string response', () => {
    spyOn(component, 'checkAndSetStatus');
    networkConfigurationService.getGWCDomainName.and.returnValue(of(''));
    component.getGWCDomainName();

    expect(networkConfigurationService.getGWCDomainName).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.generalNetworkSettingsFormGroup.controls['gwcDomainNameToggleBtn'].value).toBeFalse();
    expect(component.generalNetworkSettingsFormGroup.controls['inputName'].value).toEqual('');
    expect(component.previousInputNameValue).toEqual('');
    expect(component.checkAndSetStatus).toHaveBeenCalledWith('');
  });

  it('should call getGWCDomainName() with error', () => {
    networkConfigurationService.getGWCDomainName.and.returnValue(throwError('error'));
    component.getGWCDomainName();

    expect(networkConfigurationService.getGWCDomainName).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  // upDateGWCDomainName()
  it('should call updateGWCDomainName() isSaveBtnEnable = true', () => {
    spyOn( component, 'getGWCDomainName');
    networkConfigurationService.updateGWCDomainName.and.returnValue(of(throwError(errorForUpdateGWC)));
    component.isSaveBtnEnable = true;
    component.generalNetworkSettingsFormGroup.controls['inputName'].setValue('newInputNameValue');
    const domainName = component.generalNetworkSettingsFormGroup.controls['inputName'].value;
    component.isLoading = true;

    component.updateGWCDomainName();

    expect(networkConfigurationService.updateGWCDomainName).toHaveBeenCalledWith(domainName);
    expect(component.isLoading).toBe(false);
    expect(component.showConfirmPopup).toBeFalse();
    expect(component.getGWCDomainName).toHaveBeenCalled();
  });

  it('should call updateGWCDomainName() isSaveBtnEnable = false', () => {
    spyOn( component, 'getGWCDomainName');
    networkConfigurationService.updateGWCDomainName.and.returnValue(of(throwError(errorForUpdateGWC)));
    component.isSaveBtnEnable = false;
    const domainName = '';
    component.isLoading = true;

    component.updateGWCDomainName();

    expect(networkConfigurationService.updateGWCDomainName).toHaveBeenCalledWith(domainName);
    expect(component.isLoading).toBe(false);
    expect(component.showConfirmPopup).toBeFalse();
    expect(component.getGWCDomainName).toHaveBeenCalled();
  });

  it('should call showOrHideButtonClick()', () => {
    component.showOrHideButtonClick();

    expect(component.showDetailsBtn).toBe(false);
  });

  it('should call closeErrorDialog()', () => {
    component.closeErrorDialog();

    expect(component.showErrorDialog).toBe(false);
    expect(component.showDetailsBtn).toBe(true);
  });

  // getCallAgentIPs
  it('should call getCallAgentIPs(), two items come from response', () => {
    networkConfigurationService.getCallAgentIP.and.returnValue(of([ '10.254.166.44', '10.254.166.45' ]));
    component.getCallAgentIPs();

    expect(networkConfigurationService.getCallAgentIP).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.ipAddressZero).toEqual('10.254.166.44');
    expect(component.ipAddressOne).toEqual('10.254.166.45');
  });

  it('should call getCallAgentIPs() one item comes from response', () => {
    networkConfigurationService.getCallAgentIP.and.returnValue(of([ '10.254.166.44' ]));
    component.getCallAgentIPs();

    expect(networkConfigurationService.getCallAgentIP).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.ipAddressZero).toEqual('10.254.166.44');
    expect(component.ipAddressOne).toEqual('not configured');
  });

  it('should call getCallAgentIPs(), none item comes from response', () => {
    networkConfigurationService.getCallAgentIP.and.returnValue(of([]));
    component.getCallAgentIPs();

    expect(networkConfigurationService.getCallAgentIP).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.ipAddressZero).toEqual('not configured');
    expect(component.ipAddressOne).toEqual('not configured');
  });

  it('should call getCallAgentIPs() with error', () => {
    networkConfigurationService.getCallAgentIP.and.returnValue(throwError('error'));
    component.getCallAgentIPs();

    expect(networkConfigurationService.getCallAgentIP).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });
});
