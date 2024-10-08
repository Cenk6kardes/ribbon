import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DqosConfigurationComponent } from './dqos-configuration.component';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { of, throwError } from 'rxjs';

describe('DqosConfigurationComponent', () => {
  let component: DqosConfigurationComponent;
  let fixture: ComponentFixture<DqosConfigurationComponent>;

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
        NO: 'No',
        FORM_NOT_VALID: 'Form not valid',
        SELECT: 'Select',
        RESET: 'Reset',
        NOT_CONFIGURED: 'Not Configured',
        ACTION_FAILED: 'Action Failed!',
        SHOW_DETAILS: 'Show Details',
        HIDE_DETAILS: 'Hide Details',
        ENABLED: 'Enabled',
        DISABLED: 'Disabled',
        INPUT: 'Input',
        SEARCH: 'Search'
      },
      CODEC_PROFILE: {
        DQOS_CONF: {
          DSCP: 'DSCP (6-bit binary):',
          TIMER_T1: 'Timer-T1 (Seconds):',
          KEEP_ALIVE_TIMER: 'Keep Alive Timer (Seconds):',
          TIMER_T7: 'Timer-T7 (Seconds):',
          TIMER_T8: 'Timer-T8 (Seconds):',
          INFO: 'This info box will give a complete explanation of the relations between all of the above attributes.',
          ERROR_TITLE: 'Invalid Input',
          INVALID_T1: 'Invalid value for Timer-T1. Valid range: 0 to 65535.<br>',
          INVALID_KEEP_ALIVE_T:
            'Invalid value for Keep Alive Timer. Valid range: 1 to 65535.<br>',
          INVALID_T7:
            'Invalid value for this Timer-T7. Valid range: 0 to 65535.<br>',
          INVALID_T8: 'Invalid value for this Timer-T8. Valid range: 0 to 65535.',
          EDIT: {
            TITLE: 'Edit DQoS Configuration',
            CHECK_EXCEPTION_TEXT: 'com.nortel.ptm.gwcem.exceptions.GWCException',
            EDIT_ERROR_MESSAGE_CODE_13:
              'Update DQoS Configuration data successfully<br>with warning message.',
            EDIT_ERROR_MESSAGE_CODE_FAIL:
              'Failed to update DQoS Configuration data<br>for one or more Gateway Controllers.',
            EDIT_ERROR_MESSAGE_CODE_500:
              'An error occurred attempting to update<br>DQoS Configuration data.'
          }
        }
      }
    }
  };

  const messageContent = '200 OK';

  const dqosData = {
    'dsField': 184,
    't1Value': 315,
    't2Value': 0,
    'keepAliveTimer': 30,
    't7Value': 200,
    't8Value': 0
  };

  const dqosSaveData = {
    'dsField': 'Expedited Forwarding - EF (101110)',
    't1Value': 315,
    'keepAliveTimer': 30,
    't7Value': 200,
    't8Value': 0
  };

  const dqosErrData = {
    'dsField': 'Expedited Forwarding - EF (101110)',
    't1Value': '315',
    'keepAliveTimer': 0,
    't7Value': 200,
    't8Value': 0
  };

  const errorSaveWthoutErrExp = {
    'errorCode': '500',
    'message': 'message = Following GWC(s) does not support Dynamic\nQuality of Service capability, which will\nnot receive DQoS' +
      ' System Policy data:\nGWC-5, GWC-6, GWC-8 details = Following GWC(s) does not support Dynamic\nQuality of Service capability,' +
      ' which will\nnot receive DQoS System Policy data:\nGWC-5, GWC-6, GWC-'
  };

  const errorSaveWthoutErrExpWth12ErrCodewithDetails = {
    'errorCode': '12',
    'message': 'message = Request for Setting DQos System Data was not performed.\nPrior ' +
      'request for Setting DQos System Data is currently in progress. details = ERROR MESSAGE'
  };

  const errorSaveWthoutErrExpWth12ErrCode = {
    'errorCode': '12',
    'message': 'message = Request for Setting DQos System Data was not performed.\nPrior ' +
      'request for Setting DQos System Data is currently in progress. details = '
  };

  const errorSaveWthErrExp = {
    'errorCode': '500',
    'message': 'message = Following GWC(s) does not support Dynamic\nQuality of Service capability, which will\nnot receive DQoS' +
      ' System Policy data:\nGWC-5, GWC-6, GWC-8 details = com.nortel.ptm.gwcem.exceptions.GWCException: Following GWC(s) does not ' +
      'support Dynamic\nQuality of Service capability, which will\nnot receive DQoS System Policy data:\nGWC-5, GWC-6, GWC-'
  };

  const errorSaveWthErrExp13 = {
    'errorCode': '13',
    'message': 'message = Following GWC(s) does not support Dynamic\nQuality of Service capability, which will\nnot receive DQoS' +
      ' System Policy data:\nGWC-5, GWC-6, GWC-8 details = com.nortel.ptm.gwcem.exceptions.GWCException: Following GWC(s) does not ' +
      'support Dynamic\nQuality of Service capability, which will\nnot receive DQoS System Policy data:\nGWC-5, GWC-6, GWC-'
  };

  const networkConfigurationService = jasmine.createSpyObj('networkConfigurationService',
    ['getDQoSConf', 'saveDQoSConf']);

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError']);

  const mockEventEmitter = new EventEmitter<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DqosConfigurationComponent, SafePipe ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: NetworkConfigurationService, useValue: networkConfigurationService },
        { provide: CommonService, useValue: commonService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DqosConfigurationComponent);
    component = fixture.componentInstance;
    networkConfigurationService.getDQoSConf.and.returnValue(of(dqosData));
    networkConfigurationService.saveDQoSConf.and.returnValue(of(messageContent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should closeValidationInfoDialog()', () => {

    component.closeValidationInfoDialog();

    expect(component.showValidationInfoDialog).toBeFalse();
  });

  it('should call onFormSubmit() set showValidationInfoDialog to true if event is true ', () => {
    component.formGroup.controls['t1Value'].setValue(null);
    component.formGroup.controls['keepAliveTimer'].setValue(0);
    component.formGroup.controls['t7Value'].setValue(10);
    component.formGroup.controls['t8Value'].setValue(null);

    component.onFormSubmit(true);

    expect(component.showValidationInfoDialog).toBe(true);
  });

  it('should call onFormSubmit() set saveDQoSConf() if event is true ', () => {
    spyOn(component, 'saveDQoSConf');
    component.formGroup.controls['t1Value'].setValue(10);
    component.formGroup.controls['keepAliveTimer'].setValue(10);
    component.formGroup.controls['t7Value'].setValue(10);
    component.formGroup.controls['t8Value'].setValue(10);

    component.onFormSubmit(true);

    expect(component.saveDQoSConf).toHaveBeenCalled();
  });

  it('should call onFormSubmit() to set getDQoSConf() with event is false', () => {
    spyOn(component, 'getDQoSConf');

    component.onFormSubmit(false);

    expect(component.getDQoSConf).toHaveBeenCalled();
  });

  // get DQoS Configuration
  it('should call getDQoSConf() and resturns error', () => {
    networkConfigurationService.getDQoSConf.and.returnValue(throwError('error'));

    component.getDQoSConf();

    expect(networkConfigurationService.getDQoSConf).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  // Change DQoS Configuration
  it('should call saveDQoSConf()', () => {
    spyOn(component, 'setDataForApi');
    spyOn(component, 'getDQoSConf');

    component.formGroup.setValue(dqosSaveData);
    const data = component.setDataForApi();
    component.saveDQoSConf();

    expect(networkConfigurationService.saveDQoSConf).toHaveBeenCalledWith(data);
  });

  it('should call saveDQoSConf() with errorSaveWthErrExp with 500 errorCode', () => {
    networkConfigurationService.saveDQoSConf.and.returnValue(throwError(errorSaveWthErrExp));
    component.formGroup.setValue(dqosSaveData);
    const data = component.setDataForApi();

    component.saveDQoSConf();

    expect(networkConfigurationService.saveDQoSConf)
      .toHaveBeenCalledWith({ dsField: 736, t1Value: 315, t2Value: 0, keepAliveTimer: 30, t7Value: 200, t8Value: 0 });
    expect(component.detailsText).toEqual('com.nortel.ptm.gwcem.exceptions.GWCException: Following GWC(s) does not ' +
      'support Dynamic<br>Quality of Service capability, which will<br>not receive DQoS System Policy data:<br>GWC-5, GWC-6, GWC-');
  });

  it('should call saveDQoSConf() with errorSaveWthErrExp with 13 errorCode', () => {
    networkConfigurationService.saveDQoSConf.and.returnValue(throwError(errorSaveWthErrExp13));
    component.formGroup.setValue(dqosSaveData);
    const data = component.setDataForApi();

    component.saveDQoSConf();

    expect(networkConfigurationService.saveDQoSConf).toHaveBeenCalled();
    expect(component.detailsText).toEqual('Following GWC(s) does not support Dynamic<br>Quality of Service capability, which' +
      ' will<br>not receive DQoS System Policy data:<br>GWC-5, GWC-6, GWC-8 ');
  });

  it('should call saveDQoSConf() with errorSaveWithoutErrExp with 500 errorCode', () => {
    networkConfigurationService.saveDQoSConf.and.returnValue(throwError(errorSaveWthoutErrExp));
    component.formGroup.setValue(dqosSaveData);
    const data = component.setDataForApi();

    component.saveDQoSConf();

    expect(networkConfigurationService.saveDQoSConf)
      .toHaveBeenCalledWith({ dsField: 736, t1Value: 315, t2Value: 0, keepAliveTimer: 30, t7Value: 200, t8Value: 0 });
    expect(component.detailsText).toEqual('Following GWC(s) does not ' +
      'support Dynamic<br>Quality of Service capability, which will<br>not receive DQoS System Policy data:<br>GWC-5, GWC-6, GWC-');
  });

  it('should call saveDQoSConf() with errorSaveWithoutErrGWCExp with 12 errorCode and details exists', () => {
    networkConfigurationService.saveDQoSConf.and.returnValue(throwError(errorSaveWthoutErrExpWth12ErrCodewithDetails));
    component.formGroup.setValue(dqosSaveData);
    const data = component.setDataForApi();

    component.saveDQoSConf();

    expect(networkConfigurationService.saveDQoSConf).toHaveBeenCalled();
    expect(component.detailsText).toEqual('ERROR MESSAGE');
  });

  it('should call saveDQoSConf() with errorSaveWithoutErrGWCExp with 12 errorCode', () => {
    networkConfigurationService.saveDQoSConf.and.returnValue(throwError(errorSaveWthoutErrExpWth12ErrCode));
    component.formGroup.setValue(dqosSaveData);
    const data = component.setDataForApi();

    component.saveDQoSConf();

    expect(networkConfigurationService.saveDQoSConf).toHaveBeenCalled();
    expect(component.detailsText).toEqual('Request for Setting DQos System Data was not performed.<br>Prior '+
      'request for Setting DQos System Data is currently in progress. ');
  });

  it('should closeEditErrorDialog()', () => {

    component.closeEditErrorDialog();

    expect(component.showEditErrorDialog).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
  });

  it('should showOrHideButtonClick()', () => {
    component.showDetailsBtn = true;

    component.showOrHideButtonClick();

    expect(component.showDetailsBtn).toBeFalse();
  });
});
