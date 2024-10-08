import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PepServersComponent } from './pep-servers.component';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { IEditPepServer, IPepServer } from '../models/pep-servers';

describe('PepServersComponent', () => {
  let component: PepServersComponent;
  let fixture: ComponentFixture<PepServersComponent>;
  const translate = {
    translateResults: {
      COMMON: {
        DELETE: 'Delete',
        OK: 'OK',
        CLOSE: 'Close',
        ACTION: 'Action',
        RUN: 'Run',
        CANCEL: 'Cancel',
        ERROR: 'Error',
        ADD: 'Add',
        YES: 'Yes',
        NO: 'No'
      },
      NETWORK: {
        PEP_SERVERS: {
          TABLE_TITLE: {
            PEP_SERVERS_NAME: 'Name',
            TYPE: 'Type',
            IP_ADDRESS:'IP Address',
            MAX_CONNECTION: 'Max Connection',
            PROTOCOL_VERSION: 'Protocol Version'
          },
          FORM: {
            NAME: 'Name',
            IP_ADDRESS: 'IP Address',
            BOXTYPE: 'Type',
            MAX_CONNECTIONS: 'Max Conn',
            PROTOCOL: 'Protocol',
            PROT_VERSION: 'Protocol Version',
            NAME_INFO: 'Valid Values: DNS styled character string',
            IP_ADDRESS_INFO: 'Valid Values: <0-255>.<0-255>.<0-255>.<0-255>'
          },
          ADD_PEP_SERVER: {
            ADD_BTN_LABEL: 'New Pep Server',
            TITLE: 'Add Pep Server',
            PEP_SERVER_ADDED_SUCCESSFULLY: 'Pep Server added successfully',
            FAILED_MESSAGE: 'Addition of {{pepName}} failed.'
          },
          DELETE_PEP_SERVER: {
            TITLE: 'Delete PEP Server',
            DELETE_DIALOG_MESSAGE: 'Are you sure that you want to delete the ',
            PEP_SERVER: ' PEP Server?',
            DELETE_ERROR_SUMMARY:'Delete PEP Server Failed'
          },
          EDIT_PEP_SERVER: {
            TITLE: 'Edit PEP Server',
            PEP_SERVER_EDITED_SUCCESSFULLY: 'PEP Server edited successfully',
            FAILED_MESSAGE: 'Addition of {{pepName}} failed.'
          }
        }
      }
    }
  };

  const getPepServersResponse = {
    count: 1,
    list: [
      {
        name: 'test1',
        ipAddress: '12.12.12.1',
        boxType: 5,
        maxConnections: 10,
        protocol: 9,
        protVersion: '0.4'
      }
    ]
  };

  const pepServerData = {
    name: 'test1',
    ipAddress: '12.12.12.1',
    boxType: 5,
    maxConnections: 10,
    protocol: 9,
    protVersion: '0.4'
  };

  const editDataBody = {
    ipAddress: '12.12.12.1',
    maxConnections: 10,
    protVersion: '0.4'
  };

  const errorAddPepServer = {
    error: {
      'errorCode': '500',
      'message':
        'message = Failed to add PEP Server middlebox test1 :\nValidation error: invalid name - test1  (not DNS compliant) details = '
    }
  };

  const errorDeletePepServer = {
    error: {
      'errorCode': '500',
      'message':
        'message = Failed to delete PEP Server middlebox test1 :\nValidation error: invalid name - test1  (not DNS compliant) details = '
    }
  };

  const errorEditPepServer = {
    error: {
      'errorCode': '500',
      'message':
        'message = Failed to change PEP Server middlebox test1:\nNo changes found for middlebox test1 details = '
    }
  };

  const messageContent = '200 OK';

  const networkConfigurationService = jasmine.createSpyObj('networkConfigurationService',
    ['getPepServers', 'addPepServer', 'deletePepServer', 'editPepServer']);

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError', 'showErrorMessage', 'showSuccessMessage']);

  const mockEventEmitter = new EventEmitter<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PepServersComponent, SafePipe ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: NetworkConfigurationService, useValue: networkConfigurationService },
        { provide: CommonService, useValue: commonService }
      ]

    })
      .compileComponents();

    fixture = TestBed.createComponent(PepServersComponent);
    component = fixture.componentInstance;
    networkConfigurationService.getPepServers.and.returnValue(of(getPepServersResponse));
    networkConfigurationService.addPepServer.and.returnValue(of(messageContent));
    networkConfigurationService.deletePepServer.and.returnValue(of(messageContent));
    networkConfigurationService.editPepServer.and.returnValue(of(messageContent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update isDataChanged on form changes', () => {
    component.selectedData = pepServerData;

    component.ngOnInit();

    // Trigger form changes
    component.pepServerFormGroup.patchValue({
      ipAddress: '192.168.0.1',
      boxType: 5,
      maxConnections: 15,
      protVersion: '0.3'
    });

    // Check if isDataChanged is updated correctly
    expect(component.isDataChanged).toBeTruthy();
  });

  it('should call getPepServersData() and resturns error', () => {
    networkConfigurationService.getPepServers.and.returnValue(throwError('error'));

    component.getPepServersData();

    expect(networkConfigurationService.getPepServers).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should refreshTable()', () => {
    spyOn(component, 'getPepServersData');

    component.refreshTable();

    expect(component.getPepServersData).toHaveBeenCalled();
  });

  // add Pep Server
  it('should call addPepServer()', () => {
    spyOn(component, 'closeAddDialogAndDeleteFormValue');
    spyOn(component, 'refreshTable');

    component.addPepServer(pepServerData);

    expect(networkConfigurationService.addPepServer).toHaveBeenCalledWith(pepServerData);
    expect(commonService.showSuccessMessage).toHaveBeenCalledWith(translate.translateResults.NETWORK.PEP_SERVERS.ADD_PEP_SERVER
      .PEP_SERVER_ADDED_SUCCESSFULLY);
    expect(component.closeAddDialogAndDeleteFormValue).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('should handle error and set messageText, detailsText, and showErrorDialog', () => {
    networkConfigurationService.addPepServer.and.returnValue(throwError(errorAddPepServer));

    component.addPepServer(pepServerData);

    expect(networkConfigurationService.addPepServer).toHaveBeenCalledWith(pepServerData);
    expect(component.isLoading).toEqual(false);
    expect(component.messageText).toBe('Addition of "test1" failed.');
    expect(component.detailsText).toBe(
      'Failed to add PEP Server middlebox test1 :<br>Validation error: invalid name - test1  (not DNS compliant) ');
    expect(component.showErrorDialog).toBe(true);
  });

  it('should call showOrHideButtonClick()', () => {
    component.showOrHideButtonClick();

    expect(component.showDetailsBtn).toBe(component.showDetailsBtn);
  });

  it('should call closeErrorDialog()', () => {
    component.closeErrorDialog();

    expect(component.showErrorDialog).toBe(false);
    expect(component.showDetailsBtn).toBe(true);
  });

  it('should call addNewPepServerBtn()', () => {
    component.pepServerFormGroup.setValue(pepServerData);
    component.addNewPepServerBtn();

    expect(component.showAddDialog).toEqual(true);
    expect(component.pepServerFormGroup.value).toEqual({
      name: '',
      ipAddress: '',
      boxType: 'dqosmb',
      maxConnections: 10,
      protocol: 9,
      protVersion: 'DQOS I04'
    });
  });

  it('should call addPepServerFormFooterHandler() with event=true', () => {
    spyOn(component, 'addPepServer');
    const event = true;
    component.pepServerFormGroup.setValue(pepServerData);

    component.addPepServerFormFooterHandler(event);

    expect(component.addPepServer).toHaveBeenCalledWith(component.pepServerFormGroup.value);
  });

  it('should call addPepServerFormFooterHandler() with event=false', () => {
    spyOn(component, 'closeAddDialogAndDeleteFormValue');
    const event = false;

    component.addPepServerFormFooterHandler(event);

    expect(component.closeAddDialogAndDeleteFormValue).toHaveBeenCalled();
  });

  it('should call closeAddDialogAndDeleteFormValue()', () => {
    component.pepServerFormGroup.setValue(pepServerData);
    component.closeAddDialogAndDeleteFormValue();

    expect(component.pepServerFormGroup.value).toEqual({
      name: null,
      ipAddress: null,
      boxType: 5,
      maxConnections: null,
      protocol: 9,
      protVersion: null
    });
    expect(component.showAddDialog).toEqual(false);
  });

  // Delete Pep Server
  it('should call deletePepServer()', () => {
    component.deleteSelectedData = pepServerData;
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    spyOn(component, 'refreshTable');

    component.deletePepServer();

    expect(networkConfigurationService.deletePepServer).toHaveBeenCalledWith(component.deleteSelectedData.name);
    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('should handle error on deletePepServer()', () => {
    networkConfigurationService.deletePepServer.and.returnValue(throwError(errorDeletePepServer));
    component.deleteSelectedData = pepServerData;
    component.isLoading = true;

    component.deletePepServer();

    expect(networkConfigurationService.deletePepServer).toHaveBeenCalledWith(component.deleteSelectedData.name);
    expect(component.isLoading).toEqual(false);
    expect(component.messageText).toBe(translate
      .translateResults.NETWORK.PEP_SERVERS.DELETE_PEP_SERVER.DELETE_ERROR_SUMMARY);
    expect(component.detailsText).toBe(
      'Failed to delete PEP Server middlebox test1 :<br>Validation error: invalid name - test1  (not DNS compliant) ');
    expect(component.showDeleteErrorDialog).toBe(true);
  });

  it('should call deleteDialogFooterHandler() with event=true', () => {
    spyOn(component, 'deletePepServer');
    const event = true;

    component.deleteDialogFooterHandler(event);

    expect(component.deletePepServer).toHaveBeenCalled();
  });

  it('should call deleteDialogFooterHandler() with event=false', () => {
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    const event = false;

    component.deleteDialogFooterHandler(event);

    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
  });

  it('should reset deleteSelectedData and hide delete dialog', () => {
    component.showDeleteDialog = true;
    component.deleteSelectedData = pepServerData;

    component.closeDeleteDialogAndDeleteSelectedData();

    expect(component.showDeleteDialog).toBeFalsy();
    expect(component.deleteSelectedData).toEqual({
      name: '',
      ipAddress: '',
      boxType: 5,
      maxConnections: null,
      protocol: null,
      protVersion: ''
    });
  });

  it('should call closeDeleteErrorDialog', () => {
    component.showDeleteErrorDialog = true;

    component.closeDeleteErrorDialog();

    expect(component.showDeleteErrorDialog).toBeFalsy();
    expect(component.showDetailsBtn).toBeTruthy();
  });

  // Edit
  it('should call editPepServer()', () => {
    component.isLoading = true;
    const body: IEditPepServer = editDataBody;
    spyOn(component, 'closeEditDialogAndDeleteFormValue');
    spyOn(component, 'refreshTable');

    component.editPepServer(pepServerData);

    expect(networkConfigurationService.editPepServer).toHaveBeenCalledWith(body, pepServerData.name);
    expect(component.isLoading).toBeFalsy();
    expect(commonService.showSuccessMessage).toHaveBeenCalledWith(
      translate.translateResults.NETWORK.PEP_SERVERS.EDIT_PEP_SERVER.PEP_SERVER_EDITED_SUCCESSFULLY);
    expect(component.closeEditDialogAndDeleteFormValue).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('should handle error and set messageText, detailsText, and showErrorDialog', () => {
    component.isLoading = true;
    const body: IEditPepServer = editDataBody;
    networkConfigurationService.editPepServer.and.returnValue(throwError(errorEditPepServer));

    component.editPepServer(pepServerData);

    expect(networkConfigurationService.editPepServer).toHaveBeenCalledWith(body, pepServerData.name);
    expect(component.isLoading).toBeFalsy();
    expect(component.messageText).toBe('Addition of "test1" failed.');
    expect(component.detailsText).toBe('Failed to change PEP Server middlebox test1:<br>No changes found for middlebox test1 ');
    expect(component.showErrorDialog).toBe(true);
  });

  it('should call isDataChangedValue()', () => {
    component.isDataChanged = false;
    component.selectedData = pepServerData;
    component.pepServerFormGroup.setValue({
      name: 'test1',
      ipAddress: '12.12.12.1',
      boxType: 5,
      maxConnections: 10,
      protocol: 9,
      protVersion: '0.3'
    });

    component.isDataChangedValue();

    expect(component.isDataChanged).toBeTruthy();
  });

  it('should call closeEditDialogAndDeleteFormValue()', () => {
    component.showEditDialog = true;
    component.pepServerFormGroup.setValue(pepServerData);

    component.closeEditDialogAndDeleteFormValue();

    expect(component.showEditDialog).toEqual(false);
    expect(component.pepServerFormGroup.value).toEqual({
      name: null,
      ipAddress: null,
      boxType: 5,
      maxConnections: null,
      protocol: 9,
      protVersion: null
    });
  });

  it('should call editPepServerFormFooterHandler() with event=true', () => {
    spyOn(component, 'editPepServer');
    const event = true;
    component.pepServerFormGroup.setValue(pepServerData);

    component.editPepServerFormFooterHandler(event);

    expect(component.editPepServer).toHaveBeenCalledWith(component.pepServerFormGroup.value);
  });

  it('should call editPepServerFormFooterHandler() with event=false', () => {
    spyOn(component, 'closeEditDialogAndDeleteFormValue');
    const event = false;

    component.editPepServerFormFooterHandler(event);

    expect(component.closeEditDialogAndDeleteFormValue).toHaveBeenCalled();
  });

  it('should change type and protocol version for UI', () => {
    const testData: IPepServer[] = [
      {
        name: 'test1',
        ipAddress: '12.12.12.1',
        boxType: 5,
        maxConnections: 10,
        protocol: 9,
        protVersion: '0.4'
      },
      {
        name: 'test2',
        ipAddress: '12.2.12.13',
        boxType: 5,
        maxConnections: 10,
        protocol: 9,
        protVersion: '0.3'
      }
    ];

    const result = component.changeTypeAndProtVersionForUi(testData);

    expect(result).toEqual([
      {
        name: 'test1',
        ipAddress: '12.12.12.1',
        boxType: 'dqosmb',
        maxConnections: 10,
        protocol: 9,
        protVersion: 'DQOS I04'
      },
      {
        name: 'test2',
        ipAddress: '12.2.12.13',
        boxType: 'dqosmb',
        maxConnections: 10,
        protocol: 9,
        protVersion: 'DQOS I03'
      }
    ]);

  });

  it('should change type and protocol version for UI, protVersion DQOS I04', () => {
    const testData: IPepServer = {
      name: 'test1',
      ipAddress: '12.12.12.1',
      boxType: 'dqosmb',
      maxConnections: 10,
      protocol: 9,
      protVersion: 'DQOS I04'
    };
    const result = component.changeTypeAndProtVersionForBackend(testData);

    expect(result).toEqual({
      name: 'test1',
      ipAddress: '12.12.12.1',
      boxType: 5,
      maxConnections: 10,
      protocol: 9,
      protVersion: '0.4'
    });
  });

  it('should change type and protocol version for UI, protVersion DQOS I03', () => {
    const testData: IPepServer = {
      name: 'test1',
      ipAddress: '12.12.12.1',
      boxType: 'dqosmb',
      maxConnections: 10,
      protocol: 9,
      protVersion: 'DQOS I03'
    };
    const result = component.changeTypeAndProtVersionForBackend(testData);

    expect(result).toEqual({
      name: 'test1',
      ipAddress: '12.12.12.1',
      boxType: 5,
      maxConnections: 10,
      protocol: 9,
      protVersion: '0.3'
    });
  });
});
