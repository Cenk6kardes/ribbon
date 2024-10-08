import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgsComponent } from './algs.component';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { of, throwError } from 'rxjs';
import { IALGs, IEditSelectedALG } from '../models/algs';

describe('AlgsComponent', () => {
  let component: AlgsComponent;
  let fixture: ComponentFixture<AlgsComponent>;
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
        ALGS: {
          TABLE_TITLE: {
            NAME: 'Name',
            IP_ADDRESS: 'IP Address',
            PROTOCOL: 'Protocol',
            PORT: 'Port'
          },
          COMMON: {
            NUMERIC_VALUE: 'Numeric value',
            OUT_OF_RANGE: 'out of range of int (-2147483648 - 2147483647)'
          },
          ADD_ALG: {
            ADD_BTN_LABEL: 'New ALG',
            TITLE: 'Add ALG',
            NAME: 'Name',
            IP_ADDRESS: 'IP Address',
            PORT: 'port',
            PROTOCOL: 'Protocol',
            NCS: 'NCS',
            NAME_INFO: 'Valid Values: DNS styled character string',
            IP_ADDRESS_INFO: 'Valid Values: <0-255>.<0-255>.<0-255>.<0-255>',
            ALG_ADDED_SUCCESSFULLY: 'ALG added successfully',
            FAILED_MESSAGE: 'Addition of {{algName}} failed.',
            ONLY_NUMBER: 'Valid Values: Only numeric characters'
          },
          DELETE_ALG: {
            TITLE: 'Delete ALG',
            DELETE_DIALOG_MESSAGE: 'Are you sure that you want to delete the ',
            ALG: ' ALG',
            NO_ALG_DIALOG:
              'Please select an ALG from the list and resubmit request.',
            ALG_DELETED_SUCCESSFULLY: 'ALG deleted successfully',
            FAILED_MESSAGE: 'Deletion of {{algName}} failed.'
          },
          EDIT_ALG: {
            TITLE: 'Edit ALG',
            ALG_EDITED_SUCCESSFULLY: 'ALG edited successfully',
            FAILED_MESSAGE: 'Change of {{algName}} failed.'
          }
        }
      }
    }
  };

  const getAlgsResponse = {
    'count': 1,
    'list': [
      {
        'name': 'test',
        'ipAddress': '12.54.26.8',
        'port': 2427,
        'protocol': 1
      }
    ]
  };

  const messageContent = '200 OK';

  const dataALG: IALGs = {
    'name': 'test',
    'ipAddress': '12.54.26.8',
    'port': 2427,
    'protocol': 1
  };

  const errorAddAlg = {
    error: {
      'errorCode': '500',
      'message':
        'message = Failed to add ALG middlebox test :\nValidation error: invalid name - test  (not DNS compliant) details = '
    }
  };

  const errorDeleteAlg = {
    'errorCode': '500',
    'message': 'message = Failed to delete ALG middlebox tst:\nValidation' +
      ' error occurred during operation to delete new zone: zone tst not ready for deletion, still in use on 1 device(s). details = '
  };

  const invalidPositivePortData: IALGs = {
    'name': 'test',
    'ipAddress': '12.54.26.8',
    'port': 9999999999999,
    'protocol': 1
  };

  const invalidNegativePortData: IALGs = {
    'name': 'test',
    'ipAddress': '12.54.26.8',
    'port': -9999999999999,
    'protocol': 1
  };

  const editDataBody: IEditSelectedALG = {
    'ipAddress': '12.54.26.8',
    'port': 2427,
    'protocol': 1
  };

  const errorEditAlg = {
    error: {
      'errorCode': '500',
      'message': 'message = Failed to change ALG middlebox test:\nNo changes found for middlebox test details = '
    }
  };

  const networkConfigurationService = jasmine.createSpyObj('networkConfigurationService',
    ['getAlgs', 'addAlg', 'deleteAlg', 'editAlg']);

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError', 'showErrorMessage', 'showSuccessMessage']);

  const mockEventEmitter = new EventEmitter<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlgsComponent, SafePipe],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: NetworkConfigurationService, useValue: networkConfigurationService },
        { provide: CommonService, useValue: commonService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AlgsComponent);
    component = fixture.componentInstance;
    networkConfigurationService.getAlgs.and.returnValue(of(getAlgsResponse));
    networkConfigurationService.addAlg.and.returnValue(of(messageContent));
    networkConfigurationService.deleteAlg.and.returnValue(of(messageContent));
    networkConfigurationService.editAlg.and.returnValue(of(messageContent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit()', () => {
    spyOn(component, 'initCols');
    spyOn(component, 'initForm');
    spyOn(component, 'getAlgsData');

    component.ngOnInit();

    expect(component.initCols).toHaveBeenCalled();
    expect(component.initForm).toHaveBeenCalled();
    expect(component.getAlgsData).toHaveBeenCalled();
  });

  it('should call getAlgsData() and resturns error', () => {
    networkConfigurationService.getAlgs.and.returnValue(throwError('error'));

    component.getAlgsData();

    expect(networkConfigurationService.getAlgs).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should refreshTable()', () => {
    spyOn(component, 'getAlgsData');

    component.refreshTable();

    expect(component.getAlgsData).toHaveBeenCalled();
  });


  // add ALG
  it('should call addAlg()', () => {
    spyOn(component, 'closeAddDialogAndDeleteFormValue');
    spyOn(component, 'refreshTable');

    component.addAlg(dataALG);

    expect(networkConfigurationService.addAlg).toHaveBeenCalledWith(dataALG);
    expect(commonService.showSuccessMessage).toHaveBeenCalledWith(translate.translateResults.NETWORK.ALGS.ADD_ALG.ALG_ADDED_SUCCESSFULLY);
    expect(component.closeAddDialogAndDeleteFormValue).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('should handle error and set messageText, detailsText, and showErrorDialog', () => {
    networkConfigurationService.addAlg.and.returnValue(throwError(errorAddAlg));

    component.addAlg(dataALG);

    expect(networkConfigurationService.addAlg).toHaveBeenCalledWith(dataALG);
    expect(component.messageText).toBe('Addition of "test" failed.');
    expect(component.detailsText).toBe('Failed to add ALG middlebox test :<br>Validation error: invalid name - test  (not DNS compliant) ');
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

  it('should call addNewAlgBtn()', () => {
    spyOn(component, 'setFormValueToDefault');
    component.addNewAlgBtn();

    expect(component.showAddDialog).toEqual(true);
    expect(component.setFormValueToDefault).toHaveBeenCalled();
  });

  it('should call closeAddDialogAndDeleteFormValue()', () => {
    spyOn(component, 'setFormValueToDefault');

    component.closeAddDialogAndDeleteFormValue();

    expect(component.setFormValueToDefault).toHaveBeenCalled();
    expect(component.showAddDialog).toEqual(false);
  });

  it('should call addAlgFormFooterHandler() with event=true and valid port value', () => {
    spyOn(component, 'addAlg');
    const event = true;
    component.changedDataForRequest = dataALG;

    component.addAlgFormFooterHandler(event);

    expect(component.addAlg).toHaveBeenCalledWith(component.changedDataForRequest);
  });

  /**
   * The code blocks below were closed due to adding Validators.min(-32768), Validators.max(32767) values,
   * the error message is not needed since the add button is disabled.
   * These code blocks were added to ABH-2819 and edited on ABH-3213.
   * The codes were commented out so that they can be directly added when necessary later.
   *
   * it('should call addAlgFormFooterHandler() with event=true and invalid negative port value', () => {
    spyOn(component, 'addAlg');
    const event = true;
    component.addAlgFormGroup.setValue(invalidNegativePortData);
    component.changedDataForRequest = invalidNegativePortData;

    component.addAlgFormFooterHandler(event);

    expect(commonService.showErrorMessage).toHaveBeenCalledWith(`${translate
      .translateResults.NETWORK.ALGS.COMMON.NUMERIC_VALUE} (${component
      .addAlgFormGroup.get('port')?.value}) ${translate.translateResults.NETWORK.ALGS.COMMON.OUT_OF_RANGE}`);
  });

  it('should call addAlgFormFooterHandler() with event=true and invalid positive port value', () => {
    spyOn(component, 'addAlg');
    const event = true;
    component.addAlgFormGroup.setValue(invalidPositivePortData);
    component.changedDataForRequest = invalidPositivePortData;

    component.addAlgFormFooterHandler(event);

    expect(commonService.showErrorMessage).toHaveBeenCalledWith(`${translate
      .translateResults.NETWORK.ALGS.COMMON.NUMERIC_VALUE} (${component
      .addAlgFormGroup.get('port')?.value}) ${translate.translateResults.NETWORK.ALGS.COMMON.OUT_OF_RANGE}`);
  }); */

  it('should call addAlgFormFooterHandler() with event=false', () => {
    spyOn(component, 'closeAddDialogAndDeleteFormValue');
    const event = false;
    component.changedDataForRequest = dataALG;

    component.addAlgFormFooterHandler(event);

    expect(component.closeAddDialogAndDeleteFormValue).toHaveBeenCalled();
  });

  // Delete ALG
  it('should call deleteALG()', () => {
    component.deleteSelectedData = dataALG;
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    spyOn(component, 'refreshTable');

    component.deleteALG();

    expect(networkConfigurationService.deleteAlg).toHaveBeenCalledWith(component.deleteSelectedData.name);
    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('should handle error details message on deleteALG()', () => {
    networkConfigurationService.deleteAlg.and.returnValue(throwError(errorDeleteAlg));
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    component.deleteSelectedData = dataALG;

    component.deleteALG();

    expect(networkConfigurationService.deleteAlg).toHaveBeenCalledWith(component.deleteSelectedData.name);
    expect(component.showErrorDialog).toBeTrue();
    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
  });

  it('should call deleteDialogFooterHandler() with event=true', () => {
    spyOn(component, 'deleteALG');
    const event = true;

    component.deleteDialogFooterHandler(event);

    expect(component.deleteALG).toHaveBeenCalled();
  });

  it('should call deleteDialogFooterHandler() with event=false', () => {
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    const event = false;

    component.deleteDialogFooterHandler(event);

    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
    expect(component.showInfoAboutNoOptionDialog).toEqual(true);
  });

  it('should call closeInfoAboutNoOptionDialog()', () => {
    component.closeInfoAboutNoOptionDialog();

    expect(component.showInfoAboutNoOptionDialog).toEqual(false);
  });

  it('should call closeDeleteDialogAndDeleteSelectedData()', () => {
    component.closeDeleteDialogAndDeleteSelectedData();

    expect(component.showDeleteDialog).toEqual(false);
    expect(component.deleteSelectedData).toEqual({
      name: '',
      ipAddress: '',
      port: 2427,
      protocol: null
    });
  });

  // Edit Alg
  it('should call editAlg()', () => {
    const body: IEditSelectedALG = editDataBody;
    spyOn(component, 'closeEditDialogAndDeleteFormValue');
    spyOn(component, 'refreshTable');

    component.editAlg(dataALG);

    expect(networkConfigurationService.editAlg).toHaveBeenCalledWith(body, dataALG.name);
    expect(commonService.showSuccessMessage).toHaveBeenCalledWith(translate.translateResults.NETWORK.ALGS.EDIT_ALG.ALG_EDITED_SUCCESSFULLY);
    expect(component.closeEditDialogAndDeleteFormValue).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('should handle error and set messageText, detailsText, and showErrorDialog', () => {
    const body: IEditSelectedALG = editDataBody;
    networkConfigurationService.editAlg.and.returnValue(throwError(errorEditAlg));

    component.editAlg(dataALG);

    expect(networkConfigurationService.editAlg).toHaveBeenCalledWith(body, dataALG.name);
    expect(component.messageText).toBe('Change of "test" failed.');
    expect(component.detailsText).toBe('Failed to change ALG middlebox test:<br>No changes found for middlebox test ');
    expect(component.showErrorDialog).toBe(true);
  });

  it('should call editAlgFormFooterHandler() with event=true and valid port value', () => {
    spyOn(component, 'editAlg');
    const event = true;
    component.changedDataForRequest = dataALG;

    component.editAlgFormFooterHandler(event);

    expect(component.editAlg).toHaveBeenCalledWith(component.changedDataForRequest);
  });

  it('should call editAlgFormFooterHandler() with event=true and invalid negative port value', () => {
    spyOn(component, 'editAlg');
    const event = true;
    component.addAlgFormGroup.setValue(invalidNegativePortData);
    component.changedDataForRequest = invalidNegativePortData;

    component.editAlgFormFooterHandler(event);

    expect(commonService.showErrorMessage).toHaveBeenCalledWith(`${translate
      .translateResults.NETWORK.ALGS.COMMON.NUMERIC_VALUE} (${component
      .addAlgFormGroup.get('port')?.value}) ${translate.translateResults.NETWORK.ALGS.COMMON.OUT_OF_RANGE}`);
  });

  it('should call editAlgFormFooterHandler() with event=true and invalid positive port value', () => {
    spyOn(component, 'editAlg');
    const event = true;
    component.addAlgFormGroup.setValue(invalidPositivePortData);
    component.changedDataForRequest = invalidPositivePortData;

    component.editAlgFormFooterHandler(event);

    expect(commonService.showErrorMessage).toHaveBeenCalledWith(`${translate
      .translateResults.NETWORK.ALGS.COMMON.NUMERIC_VALUE} (${component
      .addAlgFormGroup.get('port')?.value}) ${translate.translateResults.NETWORK.ALGS.COMMON.OUT_OF_RANGE}`);
  });

  it('should call editAlgFormFooterHandler() with event=false', () => {
    spyOn(component, 'closeEditDialogAndDeleteFormValue');
    const event = false;
    component.changedDataForRequest = dataALG;

    component.editAlgFormFooterHandler(event);

    expect(component.closeEditDialogAndDeleteFormValue).toHaveBeenCalled();
  });

  it('should call closeEditDialogAndDeleteFormValue()', () => {
    spyOn(component, 'setFormValueToDefault');
    component.closeEditDialogAndDeleteFormValue();

    expect(component.showEditDialog).toEqual(false);
    expect(component.setFormValueToDefault).toHaveBeenCalled();
  });

  it('should call setFormValueToDefault()', () => {
    component.setFormValueToDefault();

    expect(component.addAlgFormGroup.value).toEqual({
      name: null,
      ipAddress: null,
      port: 2427,
      protocol: null
    });
  });
});
