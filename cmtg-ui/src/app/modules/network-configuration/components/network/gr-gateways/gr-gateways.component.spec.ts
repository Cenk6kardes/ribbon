import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrGatewaysComponent } from './gr-gateways.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppModule } from 'src/app/app.module';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { of, throwError } from 'rxjs';

describe('GrGatewaysComponent', () => {
  let component: GrGatewaysComponent;
  let fixture: ComponentFixture<GrGatewaysComponent>;

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
            FAILED_MESSAGE: 'Addition of {{g6Name}} failed.'
          },
          DELETE_GRGW: {
            TITLE: 'Confirm GR-834 Gateway Delete',
            DELETE_DIALOG_MESSAGE: 'Do you want to delete the GR-834 Gateway ',
            ON_PORT: ' on port ',
            DELETE_ERROR_SUMMARY: 'Delete GR-834 Gateway Failed',
            ERROR_MESSAGE: 'Deletion of {{g6Name}} failed: This GR-834 Gateway has been associated to VMG(s),' +
              ' please disassociate the GR-834 Gateway from related VMG(s) before deleting it!'
          },
          EDIT_GR: {
            TITLE: 'Edit GR-834 GWs',
            GR_EDITED_SUCCESSFULLY: 'GR-834 edited successfully',
            FAILED_MESSAGE: 'Addition of {{g6Name}} failed.'
          }
        }
      }
    }
  };

  const getGRGWsDataResponse = {
    'count': 1,
    'list': [
      {
        'g6Name': 'testGW',
        'type': 'G6',
        'ipAddress': '65.85.47.5',
        'port': 65529,
        'userName': 'testuser',
        'passWd': 'testing'
      }
    ]
  };

  const gwTypesResponse = [ 'G6', 'G2' ];

  const messageContent = '200 OK';

  const data = {
    'g6Name': 'testGW',
    'type': 'G6',
    'ipAddress': '65.85.47.5',
    'port': 65529,
    'userName': 'testuser',
    'passWd': 'testing'
  };

  const errorGRGW = {
    error: {
      'errorCode': '500',
      'message': 'message = GWCNetwork::add(G6Mlt) had sql exception java.sql.SQLWxception: Unable to execute SQL statement\n' +
      ' details = com.nortel.ptm.gwcem.exceptions.GWCexeption:\n\t at com.nortel.ptm...'
    }
  };

  const deleteErrorGRGW = {
    error: {
      'errorCode': '500',
      'message': 'message = Delete error example\ncom.nortel.ptm.gwcem.exceptions.GWCexeption:\n\t at com.nortel.ptm... details = '
    }
  };

  const networkConfigurationService = jasmine.createSpyObj('networkConfigurationService',
    ['getGRGWs', 'getGWType', 'addGRGW', 'isGRGWUsed', 'deleteGRGW', 'editGRGW']);

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError', 'showErrorMessage', 'showSuccessMessage']);

  const mockEventEmitter = new EventEmitter<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrGatewaysComponent, SafePipe ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: NetworkConfigurationService, useValue: networkConfigurationService },
        { provide: CommonService, useValue: commonService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GrGatewaysComponent);
    component = fixture.componentInstance;
    networkConfigurationService.getGRGWs.and.returnValue(of(getGRGWsDataResponse));
    networkConfigurationService.getGWType.and.returnValue(of(gwTypesResponse));
    networkConfigurationService.addGRGW.and.returnValue(of(messageContent));
    networkConfigurationService.isGRGWUsed.and.returnValue(of(false));
    networkConfigurationService.deleteGRGW.and.returnValue(of(messageContent));
    networkConfigurationService.editGRGW.and.returnValue(of(messageContent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and properties', () => {
    component.ngOnInit();

    expect(component.grGWFormGroup).toBeDefined();
    expect(component.isDataChanged).toBeFalsy(); // must be false as a default
  });

  it('should update isDataChanged on form changes', () => {
    component.ngOnInit();

    component.grGWFormGroup.patchValue({
      ipAddress: '1.1.1.1',
      port: '1234',
      userName: 'newUserName',
      passWd: 'newPassword'
    });

    expect(component.isDataChanged).toBeTruthy();
  });

  it( 'should call getGRGWsData() and returns error', () => {
    networkConfigurationService.getGRGWs.and.returnValue(throwError('error'));

    component.getGRGWsData();

    expect(networkConfigurationService.getGRGWs).toHaveBeenCalled();
    expect(component.isLoading).toEqual(false);
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  it('should refreshTable()', () => {
    spyOn(component, 'getGRGWsData');

    component.refreshTable();

    expect(component.getGRGWsData).toHaveBeenCalled();
  });

  // add  GR-834 GW
  it('should call addGRGW()', () => {
    spyOn(component, 'closeAddDialogAndDeleteFormValue');
    spyOn(component, 'refreshTable');
    component.isLoading = true;

    component.addGRGW(data);

    expect(networkConfigurationService.addGRGW).toHaveBeenCalledWith(data);
    expect(component.isLoading).toEqual(false);
    expect(commonService.showSuccessMessage).toHaveBeenCalledWith(
      translate.translateResults.NETWORK.GR_GATEWAYS.ADD_GR.GRGW_ADDED_SUCCESSFULLY);
    expect(component.closeAddDialogAndDeleteFormValue).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
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
    expect(component.messageText).toBe('Addition of "testGW" failed.');
    expect(component.showErrorDialog).toBe(true);
  });

  it('should call addNewGRBtn()', () => {
    component.isLoading = true;
    component.addNewGRBtn();

    expect(networkConfigurationService.getGWType).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.dropDownDataItems).toEqual(
      jasmine.arrayContaining(gwTypesResponse.map((item) => ({ label: item, value: item })))
    );
    expect(component.grGWFormGroup.controls['type'].value).toBe('G6');
    expect(component.showAddDialog).toBeTrue();
  });

  it('should handle error', () => {
    networkConfigurationService.getGWType.and.returnValue(throwError('error'));

    component.addNewGRBtn();

    expect(networkConfigurationService.getGWType).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  it('should call addGRGWFormFooterHandler() with event=true', () => {
    spyOn(component, 'addGRGW');
    const event = true;
    component.grGWFormGroup.setValue(data);

    component.addGRGWFormFooterHandler(event);

    expect(component.addGRGW).toHaveBeenCalledWith(component.grGWFormGroup.value);
  });

  it('should call addGRGWFormFooterHandler() with event=false', () => {
    spyOn(component, 'closeAddDialogAndDeleteFormValue');
    const event = false;
    component.grGWFormGroup.setValue(data);

    component.addGRGWFormFooterHandler(event);

    expect(component.closeAddDialogAndDeleteFormValue).toHaveBeenCalled();
  });

  it('should call closeAddDialogAndDeleteFormValue()', () => {
    spyOn(component, 'setFormValueToDefault');

    component.closeAddDialogAndDeleteFormValue();

    expect(component.setFormValueToDefault).toHaveBeenCalled();
    expect(component.showAddDialog).toBeFalse();
  });

  it('should call closeErrorDialog()', () => {
    component.closeErrorDialog();

    expect(component.showErrorDialog).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
  });

  // Delete GRGW
  it('should delete GRGW when not used ,(isGRGWUsed response is false)', () => {
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    spyOn(component, 'refreshTable');
    const deleteSelectedData = { g6Name: '', type: '', ipAddress: '', port: null, userName: '', passWd: '' };
    component.isLoading = true;

    component.deleteGRGW();

    expect(networkConfigurationService.isGRGWUsed).toHaveBeenCalledWith(deleteSelectedData.g6Name);
    expect(component.isLoading).toEqual(false);
    expect(networkConfigurationService.deleteGRGW).toHaveBeenCalledWith(true, deleteSelectedData);
    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('should isGRGWUsed with error', () => {
    networkConfigurationService.isGRGWUsed.and.returnValue(throwError(deleteErrorGRGW));
    spyOn(component, 'showDeleteErrorPopup');
    const deleteSelectedData = { g6Name: '', type: '', ipAddress: '', port: null, userName: '', passWd: '' };
    component.isLoading = true;

    component.deleteGRGW();

    expect(networkConfigurationService.isGRGWUsed).toHaveBeenCalledWith(deleteSelectedData.g6Name);
    expect(component.showDeleteErrorPopup).toHaveBeenCalledWith(deleteErrorGRGW);
  });

  it('should showDeleteErrorPopup', () => {
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    component.isLoading = true;

    component.showDeleteErrorPopup(deleteErrorGRGW);

    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
    expect(component.isLoading).toEqual(false);
    expect(component.detailsText)
      .toEqual('Delete error example<br>com.nortel.ptm.gwcem.exceptions.GWCexeption:<br> &emsp; at com.nortel.ptm... ');
    expect(component.messageText).toEqual('Delete GR-834 Gateway Failed');
    expect(component.showDeleteErrorDialog).toEqual(true);
  });

  it('should showDeleteErrorPopup', () => {
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    component.isLoading = true;
    const deleteError = {
      error: {
        'errorCode': '500',
        'message': 'Failed to delete QoSCollector.'
      }
    };

    component.showDeleteErrorPopup(deleteError);

    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
    expect(component.isLoading).toEqual(false);
    expect(commonService.showAPIError).toHaveBeenCalledWith(deleteError);
  });

  it('should handle error when trying to deleteGRGW(), (isGRGWUsed response is false)', () => {
    networkConfigurationService.deleteGRGW.and.returnValue(throwError(deleteErrorGRGW));
    spyOn(component, 'showDeleteErrorPopup');
    const deleteSelectedData = { g6Name: '', type: '', ipAddress: '', port: null, userName: '', passWd: '' };
    component.isLoading = true;

    component.deleteGRGW();

    expect(networkConfigurationService.isGRGWUsed).toHaveBeenCalledWith(deleteSelectedData.g6Name);
    expect(networkConfigurationService.deleteGRGW).toHaveBeenCalledWith(true, deleteSelectedData);
    expect(component.showDeleteErrorPopup).toHaveBeenCalledWith(deleteErrorGRGW);
  });

  it('should delete GRGW when it is used ,(isGRGWUsed response is true)', () => {
    networkConfigurationService.isGRGWUsed.and.returnValue(of(true));
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    const deleteSelectedData = { g6Name: '', type: '', ipAddress: '', port: null, userName: '', passWd: '' };
    const errorMessage = 'Deletion of "" failed: This GR-834 Gateway has been associated to VMG(s),' +
      ' please disassociate the GR-834 Gateway from related VMG(s) before deleting it!';
    component.isLoading = true;

    component.deleteGRGW();

    expect(networkConfigurationService.isGRGWUsed).toHaveBeenCalledWith(deleteSelectedData.g6Name);
    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
    expect(commonService.showErrorMessage).toHaveBeenCalledWith(errorMessage, translate.translateResults.NETWORK.GR_GATEWAYS.DELETE_GRGW
      .DELETE_ERROR_SUMMARY);
  });

  it('should call deleteGRGW(), return error', () => {
    networkConfigurationService.isGRGWUsed.and.returnValue(throwError(errorGRGW));
    const deleteSelectedData = { g6Name: '', type: '', ipAddress: '', port: null, userName: '', passWd: '' };
    component.isLoading = true;

    component.deleteGRGW();

    expect(networkConfigurationService.isGRGWUsed).toHaveBeenCalledWith(deleteSelectedData.g6Name);
    expect(component.isLoading).toEqual(false);
    expect(component.errorData).toBe(errorGRGW.error);
    expect(component.detailsText).toBe(
      'GWCNetwork::add(G6Mlt) had sql exception java.sql.SQLWxception: Unable to execute SQL statement<br> ');
    expect(component.messageText).toBe(translate.translateResults.NETWORK.GR_GATEWAYS.DELETE_GRGW.DELETE_ERROR_SUMMARY);
    expect(component.showDeleteErrorDialog).toBe(true);
  });

  it('should call deleteDialogFooterHandler() with event=true', () => {
    spyOn(component, 'deleteGRGW');
    const event = true;

    component.deleteDialogFooterHandler(event);

    expect(component.deleteGRGW).toHaveBeenCalled();
  });

  it('should call deleteDialogFooterHandler() with event=false', () => {
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    const event = false;

    component.deleteDialogFooterHandler(event);

    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
  });

  it('should call closeDeleteDialogAndDeleteSelectedData()', () => {
    component.closeDeleteDialogAndDeleteSelectedData();

    expect(component.showDeleteDialog).toEqual(false);
    expect(component.deleteSelectedData).toEqual({
      'g6Name': '',
      'type': '',
      'ipAddress': '',
      'port': null,
      'userName': '',
      'passWd': ''
    });
  });

  it('should call showOrHideButtonClick()', () => {
    component.showOrHideButtonClick();

    expect(component.showDetailsBtn).toEqual(component.showDetailsBtn);
  });

  it('should call closeDeleteErrorDialog()', () => {
    component.closeDeleteErrorDialog();

    expect(component.showDeleteErrorDialog).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
  });

  // Edit GR-834 Gateway
  it('should call editGRGW()', () => {
    spyOn(component, 'closeEditDialogAndDeleteFormValue');
    spyOn(component, 'refreshTable');
    component.isLoading = true;

    component.editGRGW(data);

    expect(networkConfigurationService.editGRGW).toHaveBeenCalledWith(data);
    expect(component.isLoading).toEqual(false);
    expect(commonService.showSuccessMessage).toHaveBeenCalledWith(
      translate.translateResults.NETWORK.GR_GATEWAYS.EDIT_GR.GR_EDITED_SUCCESSFULLY);
    expect(component.closeEditDialogAndDeleteFormValue).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('should call editGRGW(), return error', () => {
    networkConfigurationService.editGRGW.and.returnValue(throwError(errorGRGW));
    component.isLoading = true;

    component.editGRGW(data);

    expect(networkConfigurationService.editGRGW).toHaveBeenCalledWith(data);
    expect(component.isLoading).toEqual(false);
    expect(component.errorData).toBe(errorGRGW.error);
    expect(component.detailsText).toBe(
      'GWCNetwork::add(G6Mlt) had sql exception java.sql.SQLWxception: Unable to execute SQL statement<br> ');
    expect(component.messageText).toBe('Addition of "testGW" failed.');
    expect(component.showErrorDialog).toBe(true);
  });

  it('should call isDataChangedValue()', () => {
    component.selectedData = {
      'g6Name': 'testGW',
      'type': 'G6',
      'ipAddress': '65.85.47.5',
      'port': 123,
      'userName': 'testuser',
      'passWd': 'testing'
    };
    component.grGWFormGroup.setValue({
      g6Name: 'testGW',
      type: 'G6',
      ipAddress: '65.85.47.5',
      port: 65529,
      userName: 'testuser',
      passWd: 'testing'
    });

    component.isDataChangedValue();

    expect(component.isDataChanged).toBe(true);
  });

  it('should call closeEditDialogAndDeleteFormValue()', () => {
    spyOn(component, 'setFormValueToDefault');

    component.closeEditDialogAndDeleteFormValue();

    expect(component.showEditDialog).toBeFalse();
    expect(component.setFormValueToDefault).toHaveBeenCalled();
  });

  it('should call editGRGWFormFooterHandler() with event=true', () => {
    spyOn(component, 'editGRGW');
    component.grGWFormGroup.setValue({
      g6Name: 'testGW',
      type: 'G6',
      ipAddress: '65.85.47.5',
      port: 65529,
      userName: 'testuser',
      passWd: 'testing'
    });
    const event = true;

    component.editGRGWFormFooterHandler(event);

    expect(component.editGRGW).toHaveBeenCalledWith(component.grGWFormGroup.value);
  });

  it('should call editGRGWFormFooterHandler() with event=false', () => {
    spyOn(component, 'closeEditDialogAndDeleteFormValue');
    const event = false;

    component.editGRGWFormFooterHandler(event);

    expect(component.closeEditDialogAndDeleteFormValue).toHaveBeenCalled();
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
});
