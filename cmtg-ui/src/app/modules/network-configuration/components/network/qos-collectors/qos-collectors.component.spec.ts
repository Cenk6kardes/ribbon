import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QosCollectorsComponent } from './qos-collectors.component';
import { AppModule } from 'src/app/app.module';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { of, throwError } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';

describe('QosCollectorsComponent', () => {
  let component: QosCollectorsComponent;
  let fixture: ComponentFixture<QosCollectorsComponent>;
  const messageContent = '200 OK';
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
      NETWORK: {
        HEADER: {
          TITLE: 'Network Devices',
          GENERAL_NETWORK_SETTING: 'General Network Setting'
        },
        TABS: {
          QOS_COLLECTORS: 'QoS Collectors',
          ALGS: 'ALGs',
          GR_834_GWS: 'GR-834 GWs',
          PEP_SERVERS: 'PEP Servers'
        },
        QOS_COLLECTORS: {
          NEW_QOS_COLLECTOR: 'New QoS Collector',
          ADD_QOS_COLLECTOR: 'Add QoS Collector',
          DELETE_QOS_COLLECTOR: 'Delete QoS Collector',
          QOS_COLLECTOR_NAME: 'QoS Collector Name',
          IP_ADDRESS: 'IP Address',
          PORT: 'Port',
          DELETE_DIALOG_MESSAGE: 'Are you sure that you want to delete the',
          ON_PORT: 'on port',
          IP_ADDRESS_INFO: 'Valid Values: <0-255>.<0-255>.<0-255>.<0-255>',
          PORT_INFO: 'Valid Values: 20000-20004',
          ERROR_DIALOG_MESSAGE: 'has already provisioned with an IP address ',
          ALLOWED_MESSAGE:
            '. Only one insatance of a QoS Collector per SSPFS server is allowed.',
          QOS_ADDED_SUCCESSFULLY: 'QoS Collector added successfully',
          DELETE: {
            ERROR_MESSAGE: 'Delete QoS Collector Failed'
          }
        },
        ACTIONS: 'Actions',
        QOS_COLLECTORS_DETAIL: {
          QOS_COLLECTOR_NAME: 'QoS Collector Name',
          IP_ADDRESS: 'IP Address',
          PORT: 'Port'
        }
      }
    }
  };

  const qosCollectorResponse = {
    'count': 1,
    'list': [
      {
        'qosName': 'test1',
        'ipAddress': '12.42.52.6',
        'port': '20004'
      }
    ]
  };

  const qosCollectorData = {
    qosName: 'test2',
    ipAddress: '12.42.52.3',
    port: '20002'
  };

  const errorQosCollectorData = {
    qosName: 'test',
    ipAddress: '1.1.1.1',
    port: '20000'
  };

  const errorQoSCollector = {
    error: {
      errorCode: '500',
      message: 'message = test has already been provisioned with an ip address of 1.1.1.1.\nOnly one instance of a QoS Collector' +
        ' details = com.nortel.ptm.gwcem.exceptions.GWCException: test has already been provisioned with an ip'+
        ' address of 1.1.1.1.\nOnly one instance of a QoS Collector per SSPFS server is allowed.\n\t'
    }
  };

  const deleteErrorQoSCollector = {
    error: {
      'errorCode': '500',
      'message':
        'message = Failed to delete QoSCollector.\nSome error messages details = '
    }
  };

  const networkConfigurationService = jasmine.createSpyObj('networkConfigurationService',
    ['getQoSCollectors', 'addQoSCollector', 'deleteQosCollector']);

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError', 'showErrorMessage', 'showSuccessMessage']);

  const mockEventEmitter = new EventEmitter<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QosCollectorsComponent, SafePipe],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: NetworkConfigurationService, useValue: networkConfigurationService },
        { provide: CommonService, useValue: commonService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QosCollectorsComponent);
    component = fixture.componentInstance;
    networkConfigurationService.getQoSCollectors.and.returnValue(of(qosCollectorResponse));
    networkConfigurationService.addQoSCollector.and.returnValue(of(messageContent));
    networkConfigurationService.deleteQosCollector.and.returnValue(of(messageContent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getQOSCollectorsData() and resturns error', () => {
    networkConfigurationService.getQoSCollectors.and.returnValue(throwError('error'));

    component.getQOSCollectorsData();

    expect(networkConfigurationService.getQoSCollectors).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call addQosCollector()', () => {
    spyOn(component, 'closeAddDialogAndDeleteFormValue');
    spyOn(component, 'refreshTable');
    component.addQosCollector(qosCollectorData);

    expect(networkConfigurationService.addQoSCollector).toHaveBeenCalledWith(qosCollectorData);
    expect(commonService.showSuccessMessage).toHaveBeenCalledWith(translate.translateResults.NETWORK.QOS_COLLECTORS.QOS_ADDED_SUCCESSFULLY);
    expect(component.closeAddDialogAndDeleteFormValue).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('should handle error and set messageText, detailsText, and showErrorDialog', () => {
    networkConfigurationService.addQoSCollector.and.returnValue(throwError(errorQoSCollector));

    component.addQosCollector(qosCollectorData);

    expect(networkConfigurationService.addQoSCollector).toHaveBeenCalledWith(qosCollectorData);
    expect(component.messageText).toBe('test has already been provisioned with an ip address of 1.1.1.1.<br>Only one' +
      ' instance of a QoS Collector ');
    expect(component.detailsText).toBe('com.nortel.ptm.gwcem.exceptions.GWCException: test has already been provisioned' +
      ' with an ip address of 1.1.1.1.<br>Only one instance of a QoS Collector per SSPFS server is allowed.<br> &emsp;');
    expect(component.showErrorDialog).toBe(true);
  });

  it('should call showOrHideButtonClick()', () => {
    component.showOrHideButtonClick();

    expect(component.showDetailsBtn).toEqual(component.showDetailsBtn);
  });

  it('should call closeErrorDialog()', () => {
    component.closeErrorDialog();

    expect(component.showAddDialog).toBe(false);
    expect(component.showDetailsBtn).toBe(true);
  });

  it('should call addNewQoSCollectorBtn()', () => {
    component.addNewQoSCollectorBtn();

    expect(component.showAddDialog).toEqual(true);
  });

  it('should call addQosCollectorFormFooterHandler() with event=true', () => {
    spyOn(component, 'addQosCollector');
    const event = true;
    component.addQosCollectorFormGroup.setValue(qosCollectorData);

    component.addQosCollectorFormFooterHandler(event);

    expect(component.addQosCollectorFormGroup.valid).toBe(true);
    expect(component.addQosCollector).toHaveBeenCalledWith(component.addQosCollectorFormGroup.value);
  });

  it('should call addQosCollectorFormFooterHandler() with event=false', () => {
    spyOn(component, 'closeAddDialogAndDeleteFormValue');
    const event = false;
    component.addQosCollectorFormGroup.setValue(qosCollectorData);

    component.addQosCollectorFormFooterHandler(event);

    expect(component.closeAddDialogAndDeleteFormValue).toHaveBeenCalled();
  });

  it('should call deleteDialogFooterHandler() with event=true', () => {
    spyOn(component, 'deleteQoscollector');
    const event = true;

    component.deleteDialogFooterHandler(event);

    expect(component.deleteQoscollector).toHaveBeenCalled();
  });

  it('should call deleteDialogFooterHandler() with event=false', () => {
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    const event = false;

    component.deleteDialogFooterHandler(event);

    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
  });

  it('should call closeAddDialogAndDeleteFormValue()', () => {
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    const event = false;

    component.closeAddDialogAndDeleteFormValue();

    expect(component.addQosCollectorFormGroup.value).toEqual({
      qosName: null,
      ipAddress: null,
      port: null
    });
    expect(component.showAddDialog).toBeFalse();
  });

  it('should call deleteQoscollector()', () => {
    component.deleteQoscollector();
    expect(networkConfigurationService.deleteQosCollector).toHaveBeenCalledWith(true, { qosName: '', ipAddress: '', port: '' });
  });

  it('should handle deleteQosCollector error and set messageText, detailsText, and showErrorDialog', () => {
    networkConfigurationService.deleteQosCollector.and.returnValue(throwError(deleteErrorQoSCollector));
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    component.deleteSelectedData = { qosName: 'test1', ipAddress: '1.1.1.1', port: '20000' };

    component.deleteQoscollector();

    expect(networkConfigurationService.deleteQosCollector).toHaveBeenCalledWith(true, component.deleteSelectedData);
    expect(component.isLoading).toEqual(false);
    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
    expect(component.messageText).toBe('Delete QoS Collector Failed');
    expect(component.detailsText).toBe('Failed to delete QoSCollector.<br>Some error messages ');
    expect(component.showErrorDialog).toBe(true);
  });

  it('should handle deleteQosCollector error with showAPIError', () => {
    const deleteError = {
      error: {
        'errorCode': '500',
        'message': 'Failed to delete QoSCollector.'
      }
    };
    networkConfigurationService.deleteQosCollector.and.returnValue(throwError(deleteError));
    spyOn(component, 'closeDeleteDialogAndDeleteSelectedData');
    component.deleteSelectedData = { qosName: 'test1', ipAddress: '1.1.1.1', port: '20000' };

    component.deleteQoscollector();

    expect(networkConfigurationService.deleteQosCollector).toHaveBeenCalledWith(true, component.deleteSelectedData);
    expect(component.isLoading).toEqual(false);
    expect(component.closeDeleteDialogAndDeleteSelectedData).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalledWith(deleteError);
  });
});
