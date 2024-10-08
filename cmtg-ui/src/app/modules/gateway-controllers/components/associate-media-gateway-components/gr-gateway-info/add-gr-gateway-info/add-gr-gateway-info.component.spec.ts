import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { AddGrGatewayInfoComponent } from './add-gr-gateway-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppModule } from 'src/app/app.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { of, throwError } from 'rxjs';
import { NetworkConfigurationService } from 'src/app/modules/network-configuration/services/network-configuration.service';

describe('AddGrGatewayInfoComponent', () => {
  let component: AddGrGatewayInfoComponent;
  let fixture: ComponentFixture<AddGrGatewayInfoComponent>;

  const translate = {
    translateResults: {
      NETWORK: {
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
          HIDE_DETAILS: 'Hide Details'
        },
        GR_GATEWAYS: {
          TABLE_TITLE: {
            GR_NAME: 'GR834 Name',
            TYPE: 'Type',
            IP_ADDRESS:'IP Address',
            PORT: 'Port',
            USER: 'User'
          },
          FORM: {
            NAME: 'Name',
            TYPE: 'Type',
            PORT: 'port',
            IP_ADDRESS: 'IP Address',
            USER_NAME: 'User Name',
            PASSWORD: 'Password',
            NAME_INFO: 'Valid Values: Character string',
            IP_ADDRESS_INFO: 'Valid Values: <0-255>.<0-255>.<0-255>.<0-255>',
            PORT_INFO: 'Valid Values: 0-65535'
          },
          ADD_GR: {
            ADD_BTN_LABEL: 'New GR-834 GWs',
            TITLE: 'Add GR-834 GWs',
            GRGW_ADDED_SUCCESSFULLY: 'GR-834 added successfully',
            GRGW_ADD_FAILED: 'Addition of',
            FAILED_MESSAGE: 'failed.'
          },
          DELETE_GRGW: {
            TITLE: 'Confirm GR-834 Gateway Delete',
            DELETE_DIALOG_MESSAGE: 'Do you want to delete the GR-834 Gateway ',
            ON_PORT: ' on port ',
            DELETE_ERROR_SUMMARY: 'Delete GR-834 Gateway Failed',
            BEGINNING_OF_DELETE_ERROR_MESSAGE: 'Deletion of ',
            DELETE_ERROR_MESSAGE: 'failed: This GR-834 Gateway has been associated to VMG(s),',
            CONTINUATION_OF_DELETE_ERROR_MESSAGE: 'please disassociate the GR-834 Gateway from related VMG(s) before deleting it!'
          },
          EDIT_GR: {
            TITLE: 'Edit GR-834 GWs',
            GR_EDITED_SUCCESSFULLY: 'GR-834 edited successfully',
            GR_EDIT_FAILED: 'Addition of',
            FAILED_MESSAGE: 'failed.'
          }
        }
      }
    }
  };

  const errorGRGW = {
    error: {
      'errorCode': '500',
      'message': 'message = GWCNetwork::add(G6Mlt) had sql exception java.sql.SQLWxception: Unable to execute SQL statement\n' +
      ' details = com.nortel.ptm.gwcem.exceptions.GWCexeption:\n\t at com.nortel.ptm...'
    }
  };
  const messageContent = '200 OK';
  const gwTypesResponse = [ 'G6', 'G2' ];
  const data = {
    'g6Name': 'testGW',
    'type': 'G6',
    'ipAddress': '65.85.47.5',
    'port': 65529,
    'userName': 'testuser',
    'passWd': 'testing'
  };
  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError',
    'showSuccessMessage'
  ]);

  const networkConfigurationService = jasmine.createSpyObj('networkConfigurationService',
    ['getGWType', 'addGRGW']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddGrGatewayInfoComponent,SafePipe],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: NetworkConfigurationService, useValue: networkConfigurationService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AddGrGatewayInfoComponent);
    component = fixture.componentInstance;
    networkConfigurationService.getGWType.and.returnValue(of(gwTypesResponse));
    networkConfigurationService.addGRGW.and.returnValue(of(messageContent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize form and call addNewGRBtn on ngOnInit', () => {
    spyOn(component, 'addNewGRBtn');
    component.ngOnInit();
    expect(component.addNewGRBtn).toHaveBeenCalled();
  });


  it('should call addGRGW()', () => {
    spyOn(component, 'closeAddDialogAndDeleteFormValue');
    component.isLoading = true;

    component.addGRGW(data);

    expect(networkConfigurationService.addGRGW).toHaveBeenCalledWith(data);
    expect(component.isLoading).toEqual(false);
    expect(commonService.showSuccessMessage).toHaveBeenCalled();
    expect(component.closeAddDialogAndDeleteFormValue).toHaveBeenCalled();
  });

  it('should handle error and set messageText, detailsText, and showErrorDialog', () => {
    networkConfigurationService.addGRGW.and.returnValue(throwError(errorGRGW));

    component.addGRGW(data);

    expect(networkConfigurationService.addGRGW).toHaveBeenCalledWith(data);
    expect(component.isLoading).toEqual(false);
    expect(component.errorData).toBe(errorGRGW.error);
    expect(component.detailsText).toBe('com.nortel.ptm.gwcem.exceptions.GWCexeption:<br> &emsp; at com.nortel.ptm..."');
    expect(component.messageTextDetail).toBe(
      'GWCNetwork::add(G6Mlt) had sql exception java.sql.SQLWxception: Unable to execute SQL statement<br> ');
    expect(component.showErrorDialog).toBe(true);
  });
  it('should call closeAddDialogAndDeleteFormValue()', () => {
    spyOn(component, 'setFormValueToDefault');

    component.closeAddDialogAndDeleteFormValue();

    expect(component.setFormValueToDefault).toHaveBeenCalled();
  });
  it('should call setFormValueToDefault()', () => {
    component.setFormValueToDefault();

    expect(component.grGWFormGroup.value).toEqual({
      g6Name: '',
      type: '',
      ipAddress: '',
      port: null,
      userName: '',
      passWd: ''
    });
  });
  it('should call addGRGW when event is true', () => {
    spyOn(component, 'addGRGW');
    spyOn(component, 'closeAddDialogAndDeleteFormValue');
    component.addGRGWFormFooterHandler(true);
    expect(component.addGRGW).toHaveBeenCalledWith(component.grGWFormGroup.value);
    expect(component.closeAddDialogAndDeleteFormValue).not.toHaveBeenCalled();
  });
  it('should call closeAddDialogAndDeleteFormValue when event is false', () => {
    spyOn(component, 'addGRGW');
    spyOn(component, 'closeAddDialogAndDeleteFormValue');
    component.addGRGWFormFooterHandler(false);
    expect(component.closeAddDialogAndDeleteFormValue).toHaveBeenCalled();
    expect(component.addGRGW).not.toHaveBeenCalled();
  });
  it('should close error dialog and show details button', () => {
    component.closeErrorDialog();
    expect(component.showErrorDialog).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
  });
  it('should toggle showDetailsBtn property', () => {
    component.showOrHideButtonClick();
    expect(component.showDetailsBtn).toBeFalse();
    component.showOrHideButtonClick();
    expect(component.showDetailsBtn).toBeTrue();
  });
});
