import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { QosCollectorsComponent } from './qos-collectors.component';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { NetworkConfigurationService } from 'src/app/modules/network-configuration/services/network-configuration.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('QosCollectorsComponent', () => {
  let component: QosCollectorsComponent;
  let fixture: ComponentFixture<QosCollectorsComponent>;
  const translate = {
    translateResults: {
      COMMON: {
        DELETE: 'Delete',
        EDIT: 'Edit',
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
      GATEWAY_CONTROLLERS: {
        TITLE: 'Gateway Controllers',
        SELECT_GW: 'Select a Gateway Controller',
        UNIT_0: 'Unit 0',
        UNIT_1: 'Unit 1',
        PROVISIONING: {
          TITLE: 'Provisioning',
          TABS: {
            COMMON: {
              GATEWAY_LIST: 'Gateway List',
              LINE_LIST: 'Line List',
              CARRIER_LIST: 'Carrier List',
              RETRIEVAL_CRITERIA: 'Retrieval Criteria',
              LIMIT_RESULT: 'Limit Result',
              REPLACE_LIST: 'Replace List',
              APPEND_TO_LIST: 'Append to List',
              EMPTY_MSG: 'No Records Found',
              BTN: {
                RETRIEVE: 'Retrieve',
                RETRIEVE_ALL: 'Retrieve All'
              }
            },
            QOS_COLLECTORS: {
              TITLE: 'QoS Collectors',
              COLLECTORS: 'Collectors',
              TABLE: {
                COLS: {
                  QOS_COLL_NAME: 'Qos Collector Name',
                  IP_ADDRESS: 'IP Address',
                  PORT: 'Port'
                }
              },
              STATUS: {
                ERROR: {
                  TITLE: 'Action Failed',
                  FAILED: 'Get QoS Collection Status failed'
                }
              },
              ADD: {
                ASSOCIATE: 'Associate',
                QOS_COLLECTOR: 'QoS Collector',
                NO_FREE_QOS_COL:
                  'No Free QoS collectors available for this GWC',
                ASSOCIATE_TITLE: 'Associate QoS Collector',
                MAX_ASSOCIATION_ERROR:
                  'Maximum number of 2 QoS Collectors per GWC has been reached.',
                APPLY_CONFIRM_QOS_ENABLE_TITLE: 'Confirm QoS Collection Enable',
                APPLY_CONFIRM_QOS_ENABLE_MESSAGE:
                  'QoS collection for /{{gwcName}}/ is about to be<br>configured. Note that QoS collection is only supported' +
                  '<br>with Gateways within certain solutions. Enabling QoS<br>collection in other solutions may cause unknown ' +
                  'behavior.<br>Please be sure that your solution supports QoS<br>functionality.  The currently supported solutions ' +
                  'are:<br>PT-IP, Intl PT-IP, IAW, Intl IAW, IAC, Intl IAC',
                APPLY_CONFIRM_DISABLE_RTCP_XR_TITLE:
                  'Confirm QoS Collection Disable',
                APPLY_CONFIRM_DISABLE_RTCP_XR_MESSAGE:
                  'QoS collection and RTCP-XR negotiation for /{{gwcName}}/ is about to be disabled.',
                CONFIRM_POPUP_ALL_TRUE:
                  'QoS collection for /{{gwcName}}/ <br>is about to be disabled.<br>RTCP-XR Negotiation for /{{gwcName}}/ ' +
                  '<br>is about to be enabled.',
                CONFIRM_POPUP_ALL_FALSE:
                  'QoS collection and RTCP-XR for /{{gwcName}}/ <br>is about to be disabled.',
                ERROR: {
                  CONFIGURE_QOS_COLLECTION_TITLE: 'Configure QoS Collection',
                  CONFIGURE_QOS_COLLECTION_MESSAGE:
                    'QOS reporting will be configured even though no QOS <br>collectors have been associated with this GWC.' +
                    '<br>QOS collection for this GWC will begin as soon <br>as at least one QOS collector has been associated.',
                  CONFIGURE_QOS_COLLECTION_DETAILS:
                    'To associate a QoS Collector, select the associate <br>button and select a QoS Collector from the list',
                  POST_ERROR_TITLE: 'Configure QoS Collection Failed',
                  POST_ERROR_MESSAGE:
                    'Configure QoS Collection failed<br>due to an error during server processing.<br>/{{messageFromResponse}}/',
                  SYSTEM_ERROR: 'System Error',
                  POST_SYSTEM_ERROR_MESSAGE: 'Configure QoS Collection Failed.',
                  ASSOCIATE_FAILED_TITLE: 'Associate QoS Collector Failed',
                  ASSOCIATE_FAILED_MESSAGE:
                    'Association of QoS Collector failed due to an error during server processing.',
                  ERROR_MESSAGE: 'Associate QoS Collector Failed.',
                  CONFIRM_QOS_ENABLE_TITLE: 'Configure QoS Collection',
                  CONFIRM_QOS_ENABLE_MESSAGE: 'QOS reporting will be configured even though no QOS <br>' +
                    'collectors have been associated with this GWC.<br>QOS collection for this GWC will begin as soon ' +
                    '<br>as at least one QOS collector has been associated.',
                  CONFIRM_QOS_ENABLE_DETAILS: 'To associate a doS Collector, select the associate ' +
                    '<br>button and select a QoS Collector from the list'
                },
                NEW_QOS_COLLECTOR: {
                  TITLE: 'Add New QoS Collectors',
                  NAME: 'QoS Collector Name'
                }
              },
              CONFIGURATION: {
                TITLE: 'Configuration',
                QOS_COLLECTION: 'QoS Collection',
                QOS_COLLECTION_PENDING: 'QoS Collection pending',
                CURRENT_BASE_METRICS: 'Current Base Metrics',
                RTCP_BASE_REMOTE_METRICS: 'RTCP Base Remote Metrics',
                EXTRA_BASE_METRICS: 'Extra Base Metrics',
                CODEC_METRICS: 'Codec Metrics',
                RTCP_XR_REPORTING: 'RTCP-XR Reporting',
                DISABLE_RTCP_XR_NEGOTIATION: 'Disable RTCP-XR Negotiation',
                V_Q_MONITOR_METRIC: 'VoiceQualityMonitorMetric',
                V_Q_DEBUG_METRIC: 'VoiceQualityDebugMetric',
                LOSS_DEBUG_METRIC: 'LossDebugMetric',
                UNIT_STIM_SPECIFIC_METRIC: 'UnitStimSpecificMetric',
                JITTER_DEBUG_METRIC: 'JitterDebugMetric',
                TOOLTIP_TEXT: {
                  CURRENT_BASE_METRICS:
                    '<b>Statistics reported in Current Base metrics: </b><hr noshade><pre><font size=3>- startTime              ' +
                    '- ipAddress</font><br><font size=3>- endTime                ' +
                    '- portNumber</font><br><font size=3>- timeZoneOffset         ' +
                    '- inboundPacketCount</font><br><font size=3>- callCompletionCode     ' +
                    '- inboundByteCount</font><br><font size=3>- proprietoryErrorCode   ' +
                    '- outboundPacketCount</font><br><font size=3>- sequenceNumber         ' +
                    '- outboundByteCount</font><br><font size=3>- uniqueCallId           ' +
                    '- packetDelayVariation</font><br><font size=3>- hostName               ' +
                    '- averagePacketLatency</font><br><font size=3>- subscriberID           ' +
                    '- packetLossPercentage/Loss Rate</font><br><font size=3>- originalDestinationId  ' +
                    '- inboundLostPacketCount (Non H.248 GWs)</font><br></pre>',
                  RTP_BASE_REMOTE_METRICS:
                    '<b>Statistics reported in RTP Base Remote metrics: </b><hr noshade><pre><font size=3>- ' +
                    'inboundPacketCount</font><br><font size=3>- inboundByteCount</font><br><font size=3>- ' +
                    'outboundPacketCount</font><br><font size=3>- outboundByteCount</font><br><font size=3>- ' +
                    'packetDelayVariation</font><br><font size=3>- packetLossPercentage/Loss Rate</font><br><font size=3>- ' +
                    'inboundLostPacketCount</font><br></pre>',
                  EXTRA_BASE_METRICS:
                    '<b>Statistics reported in Extra Base metrics: </b><hr noshade><pre><font size=3>- local bearer IP</font>' +
                    '<br><font size=3>- remote bearer IP</font><br><font size=3>- local bearer port</font><br><font size=3>- ' +
                    'remote bearer Port</font><br><font size=3>- local bearer i/f</font><br><font size=3>- VBD Flag</font>' +
                    '<br><font size=3>- number of Fax pages received </font><br><font size=3>- number of Fax pages sent </font>' +
                    '<br><font size=3>- Average Jitter</font><br></pre>',
                  CODEC_METRICS:
                    '<b>Statistics reported in Codec metrics: </b><hr noshade><pre><font size=3>- preferred codec</font><br>' +
                    '<font size=3>- final negotiated Codec</font><br></pre>',
                  RTCP_XR_REPORTING:
                    '<b>Warning: </b><hr noshade><pre><font size=3>Check this box if and only if you want to fully disable collection, ' +
                    '</font><br><font size=3>reporting and responding functions for RTCP-XR metrics at the Gateway</font><br></pre>',
                  V_Q_MONITOR_METRIC:
                    '<b>Statistics reported in Voice Quality Monitor block: </b><hr noshade><pre><font size=3>- Conversational R</font>' +
                    '<br><font size=3>- Listening R</font><br><font size=3>- MOS-LQ</font><br><font size=3>- MOS-CQ</font><br></pre>',
                  V_Q_DEBUG_METRIC:
                    '<b>Statistics reported in Voice Quality Debug block: </b><hr noshade><pre><font size=3>- End System Delay</font>' +
                    '<br><font size=3>- Signal Level</font><br><font size=3>- Noise Level</font><br><font size=3>- Residual Echo Return'+
                    ' Loss</font><br><font size=3>- PLC Config</font><br></pre>',
                  LOSS_DEBUG_METRIC:
                    '<b>Statistics reported in Loss Debug block: </b><hr noshade><pre><font size=3>- Discard Rate</font><br>'+
                    '<font size=3>- Burst Duration</font><br><font size=3>- Burst Density</font><br><font size=3>- Gap Duration' +
                    '</font><br><font size=3>- Gap Density</font><br><font size=3>- Network Packet Loss Rate</font><br><font size=3>-'+
                    ' Gap Threshold setting </font><br>',
                  UNIT_STIM_SPECIFIC_METRIC:
                    '<b>Statistics reported in Unistim Specific block: </b><hr noshade><pre><font size=3>- PLC Effectiveness             '+
                    '           - Burst Count</font><br><font size=3>- Round Trip Time Average High Water Mark  - Gap R Factor</font><br>'+
                    '<font size=3>- Maximum One Way Delay in MS              - Burst R Factor</font><br><font size=3>- Average Network ' +
                    'Loss Rate                - Frames per Packet (ptime)</font><br><font size=3>- Inter-arrival Jitter HWM             ' +
                    '    - MIU Duplicate Percentage</font><br><font size=3>- Packets Out of Order                     ' +
                    '- silenceSuppression</font><br>',
                  JITTER_DEBUG_METRIC:
                    '<b>Statistics reported in Jitter Debug block: </b><hr noshade><pre><font size=3>- Jitter Buffer Adaptive config' +
                    '</font><br><font size=3>- Jitter Buffer Rate config</font><br><font size=3>- Jitter Buffer Nominal Delay</font>' +
                    '<br><font size=3>- Jitter Buffer Maximum Delay</font><br><font size=3>- Jitter Buffer Absolute Maximum Delay' +
                    '</font><br>'
                }
              },
              DELETE: {
                TITLE: 'Confirm QoS Collector Delete',
                MESSAGE_LAST_QOS_COLLECTOR:
                  'Note: QoS Data Reporting is enabled and you are about to disassociate the last QoS Collector on this GWC which will ' +
                  'result in loss of QoS Statistics.</br>Disassociate /{{qosName}}/ from /{{gwcName}}/ ?',
                CONFIRM_MESSAGE_DELETE:
                  'Disassociate /{{qosName}}/ from /{{gwcName}}/ ?',
                GWC_ERROR_EXP_TITLE: 'Disassociate QoS Collector Failed',
                GWC_ERROR_EXP_MESSAGE:
                  'Disassociation of QoS Collector failed<br>due to an error during server processing.',
                SYSTEM_ERROR: 'System Error',
                ERROR_MESSAGE: 'Disassociate QoS Collector Failed.'
              }
            }
          }
        }
      }
    }
  };
  const commonService = jasmine.createSpyObj('commonService', [ 'showAPIError', 'showAPIError$' ]);
  const gwcService = jasmine.createSpyObj('gwcService', [
    'getUnitStatus',
    'getNodeNumber',
    'checkRtcpxrSupported',
    'getEnhRepStatus',
    'getQosCollectors',
    'getQosCollectionStatus',
    'getAvailableAssociationList',
    'associateQoSCollector',
    'disassociateQoSCollector',
    'getQoSCollector',
    'postQosCollectionStatus'

  ]);
  const networkConfigurationService = jasmine.createSpyObj('networkConfigurationService',
    ['addQoSCollector']);

  const getUnitStatusRes = {
    unit0ID: '10.254.166.26:161',
    unit0IPAddr: '10.254.166.26',
    unit0Port: 161,
    unit1ID: '10.254.166.27:161',
    unit1IPAddr: '10.254.166.27',
    unit1Port: 161
  };
  const getNodeNumberRes = {
    count: 1,
    nodeList: [
      {
        gwcId: 'GWC-2',
        callServer: {
          name: 'CO39',
          cmMsgIpAddress: ''
        },
        elementManager: {
          ipAddress: '10.254.166.150',
          trapPort: 3162
        },
        serviceConfiguration: {
          gwcNodeNumber: 42,
          activeIpAddress: '10.254.166.24',
          inactiveIpAddress: '10.254.166.25',
          unit0IpAddress: '10.254.166.26',
          unit1IpAddress: '10.254.166.27',
          gwcProfileName: 'LINE_TRUNK_AUD_NA',
          capabilities: [
            {
              capability: { __value: 2 },
              capacity: 4094
            },
            {
              capability: { __value: 3 },
              capacity: 4096
            }
          ],
          bearerNetworkInstance: 'NET 2',
          bearerFabricType: 'IP',
          codecProfileName: 'default',
          execDataList: [
            {
              name: 'DPLEX',
              termtype: 'DPL_TERM'
            },
            {
              name: 'KSETEX',
              termtype: 'KEYSET'
            }
          ],
          defaultGwDomainName: ''
        },
        deviceList: []
      }
    ]
  };
  const qosCollFilterRes = {
    count: 1,
    list: [{ qosName: 'a', ipAddress: '12.12.13.13', port: '20000' }]
  };
  const getQosCollectionStatusRes = {
    qosReporting: 0,
    currentBaseMetrics: 0,
    rtpBaseRemoteMetrics: 0,
    extraBaseMetrics: 0,
    codecMetrics: 0,
    rtcpxrReporting: 2,
    rtcpxrBlocks: ['0', '0', '0', '0', '0', '0', '0', '0', '0']
  };

  const availableCodecListRes = {
    count: 3,
    list: [
      {
        qosName: 'test3',
        ipAddress: '12.1.2.4',
        port: '20000'
      },
      {
        qosName: 'tst',
        ipAddress: '1.1.1.1',
        port: '20000'
      },
      {
        qosName: 'test2',
        ipAddress: '12.1.2.3',
        port: '20000'
      }
    ]
  };

  const messageContent = '200 OK';

  const associateErrorWithoutGWCExc = {
    errorCode: '500',
    message: 'Exception occurred during assocQoSCollector_e'
  };

  const associateErrorWithGWCExc = {
    error: {
      errorCode: '500',
      message:
        '"message = A QoS Collector by the same name/ipaddress \nhas details = com.nortel.ptm.gwcem.exceptions.GWCException:'
    }
  };

  const addQosCollError = {
    error: {
      errorCode: '500',
      message:
        '"message = A QoS Collector added failed details = com.nortel.ptm.gwcem.exceptions.GWCException:'
    }
  };

  const gWCDisassociateException = {
    errorCode: '500',
    message:
      '"message = Active unit failed to disassociate.\nFailure reason: A commit failed error occured.,' +
      ' Error Index: 1 details = "'
  };

  const qosColRes = {
    count: 1,
    list: [
      {
        qosName: 'test1',
        ipAddress: '12.42.52.6',
        port: '20004'
      }
    ]
  };

  const postQoSCollectionData = {
    qosReporting: true,
    currentBaseMetrics: true,
    rtpBaseRemoteMetrics: false,
    extraBaseMetrics: false,
    codecMetrics: false,
    rtcpxrReporting: true,
    disableRtcpxrNegotiation: false,
    localVoiceQualityMonitorMetric: 'false',
    remoteVoiceQualityMonitorMetric: 'false',
    localVoiceQualityDebugMetric: 'false',
    remoteVoiceQualityDebugMetric: 'false',
    localLossDebugMetric: 'false',
    remoteLossDebugMetric: 'false',
    localUnitStimSpecificMetric: 'false',
    localJitterDebugMetric: 'false',
    remoteJitterDebugMetric: 'false'
  };

  const postQoSCollectionDataRtcpxrReportingFalse = {
    qosReporting: false,
    currentBaseMetrics: true,
    rtpBaseRemoteMetrics: false,
    extraBaseMetrics: false,
    codecMetrics: false,
    rtcpxrReporting: false,
    disableRtcpxrNegotiation: false,
    localVoiceQualityMonitorMetric: 'false',
    remoteVoiceQualityMonitorMetric: 'false',
    localVoiceQualityDebugMetric: 'false',
    remoteVoiceQualityDebugMetric: 'false',
    localLossDebugMetric: 'false',
    remoteLossDebugMetric: 'false',
    localUnitStimSpecificMetric: 'false',
    localJitterDebugMetric: 'false',
    remoteJitterDebugMetric: 'false'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QosCollectorsComponent, SafePipe ],
      providers: [
        { provide: GatewayControllersService, useValue: gwcService },
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: NetworkConfigurationService, useValue: networkConfigurationService },
        FormBuilder
      ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QosCollectorsComponent);
    component = fixture.componentInstance;
    component.configurationFormGroup = new FormGroup({
      qosReporting: new FormControl<boolean>({value: false, disabled: false}),
      currentBaseMetrics: new FormControl<boolean>({value: false, disabled: true}),
      rtpBaseRemoteMetrics: new FormControl<boolean>({value: false, disabled: true}),
      extraBaseMetrics: new FormControl<boolean>({value: false, disabled: true}),
      codecMetrics: new FormControl<boolean>({value: false, disabled: true}),
      rtcpxrReporting: new FormControl<boolean>({value: false, disabled: true}),
      disableRtcpxrNegotiation: new FormControl<boolean>({value: false, disabled: false}),
      localVoiceQualityMonitorMetric: new FormControl<boolean>(false),
      remoteVoiceQualityMonitorMetric: new FormControl<boolean>(false),
      localVoiceQualityDebugMetric: new FormControl<boolean>(false),
      remoteVoiceQualityDebugMetric: new FormControl<boolean>(false),
      localLossDebugMetric: new FormControl<boolean>(false),
      remoteLossDebugMetric: new FormControl<boolean>(false),
      localUnitStimSpecificMetric: new FormControl<boolean>(false),
      // remoteUnitStimSpecificMetric: new FormControl<boolean>(false),
      localJitterDebugMetric: new FormControl<boolean>(false),
      remoteJitterDebugMetric: new FormControl<boolean>(false)
    });

    component.gwControllerName = 'GWC-0';
    gwcService.getUnitStatus.and.returnValue(of(getUnitStatusRes));
    gwcService.getQosCollectionStatus.and.returnValue(of(getQosCollectionStatusRes));
    gwcService.getNodeNumber.and.returnValue(of(getNodeNumberRes));
    gwcService.checkRtcpxrSupported.and.returnValue(of(true));
    gwcService.getEnhRepStatus.and.returnValue(of(['1','1']));
    gwcService.getQosCollectors.and.returnValue(of(qosCollFilterRes));
    networkConfigurationService.addQoSCollector.and.returnValue(of('200 OK'));
    component.gwcIp = getUnitStatusRes.unit0ID;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnChanges', () => {
    spyOn(component, 'initialDataLoadHandler');
    component.currentGwcName = 'GWC-0';
    component.gwControllerName = 'GWC-1';

    component.ngOnChanges();

    expect(component.gwcIp).toBe('10.254.166.26:161');
    expect(component.initialDataLoadHandler).toHaveBeenCalled();
    expect(component.currentGwcName).toBe('GWC-1');
  });

  it('should call ngOnChanges with error', () => {
    gwcService.getUnitStatus.and.returnValue(throwError('error'));

    component.ngOnChanges();

    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  it('should call setQoSColPendingAndSetDisableOfDisassociationBtn count 2', () => {
    component.enhRepStatus = 'UNKNOWN';
    component.setQoSColPendingAndSetDisableOfDisassociationBtn(2);

    // expect(component.isDisassociateBtnEnable).toEqual(false);
    expect(component.isQoSColPendingDisplay).toEqual(false);
  });

  it('should call setQoSColPendingAndSetDisableOfDisassociationBtn count 1, enhRepStatus === SUPPORTED', () => {
    component.enhRepStatus = 'SUPPORTED';
    component.setQoSColPendingAndSetDisableOfDisassociationBtn(1);

    expect(component.isDisassociateBtnEnable).toBe(true);
    expect(component.isQoSColPendingDisplay).toBe(false);
  });

  it('should call setQoSColPendingAndSetDisableOfDisassociationBtn count 0', () => {
    component.configurationFormGroup.controls['qosReporting']?.setValue(true);

    component.setQoSColPendingAndSetDisableOfDisassociationBtn(0);

    expect(component.isQoSColPendingDisplay).toBe(true);
  });

  it('should call setQoSColPendingAndSetDisableOfDisassociationBtn count 0 and qosReporting 0', () => {
    component.configurationFormGroup.controls['qosReporting']?.setValue(0);

    component.setQoSColPendingAndSetDisableOfDisassociationBtn(0);

    expect(component.isDisassociateBtnEnable).toBe(false);
    expect(component.isQoSColPendingDisplay).toBe(false);
  });

  /* it('should call refreshQosCollectorsTable', () => {
    spyOn(component, 'checkAssociateBtnEnableAndSetConfigurationCheckbox');
    component.refreshQosCollectorsTable();

    expect(component.isLoading).toBe(false);
    expect(component.checkAssociateBtnEnableAndSetConfigurationCheckbox).toHaveBeenCalled();
  });*/
  it('should call refreshQosCollectorsTable', () => {
    spyOn(component, 'initialDataLoadHandler');
    component.refreshQosCollectorsTable();

    expect(component.initialDataLoadHandler).toHaveBeenCalled();
  });
  // checkSmallLineGWC, getTableData
  it('should call checkSmallLineGWC, getTableData with error', () => {
    const errorResponse = new HttpErrorResponse({ status: 500, statusText: '' });
    commonService.showAPIError$.and.returnValue(of(null));
    gwcService.getNodeNumber.and.returnValue(throwError(errorResponse));
    gwcService.getQosCollectors.and.returnValue(throwError(errorResponse));

    component.initialDataLoadHandler();

    expect(commonService.showAPIError$).toHaveBeenCalledWith(errorResponse);
  });

  // getQosCollectionStatus
  it('should call getQosCollectionStatus with GWCException error', () => {
    const errorResponse = {
      error: {
        status: '500',
        message: '"message = getting qos collection status failed details = "' }
    };
    gwcService.getQosCollectionStatus.and.returnValue(throwError(errorResponse));

    component.initialDataLoadHandler();

    expect(component.showAddAssociateAndQosStatus).toBeTrue();
    expect(component.errorTitleAddAssociateAndQosStatus)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.STATUS.ERROR.TITLE);
  });

  it('should call getQosCollectionStatus with GWCException error', () => {
    const errorResponse = {
      status: '500',
      message: 'getting qos collection status failed'
    };
    gwcService.getQosCollectionStatus.and.returnValue(throwError(errorResponse));

    component.initialDataLoadHandler();

    expect(component.showErrorPopup).toBeTrue();
    expect(component.errorTitle)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.STATUS.ERROR.TITLE);
    expect(component.errorText)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.STATUS.ERROR.FAILED);
  });

  // setEnhRepStatusAndJitterDebugSupported
  it('should call setEnhRepStatusAndJitterDebugSupported', () => {
    gwcService.getEnhRepStatus.and.returnValue(of(['2','2']));
    component.initialDataLoadHandler();

    expect(component.enhRepStatus).toBe('UNSUPPORTED');
    expect(component.isJitterDebugSupported).toBe(false);
  });

  it('should call setEnhRepStatusAndJitterDebugSupported return null', () => {
    gwcService.getEnhRepStatus.and.returnValue(of([]));
    component.initialDataLoadHandler();

    expect(component.enhRepStatus).toBe('UNSUPPORTED');
    expect(component.isJitterDebugSupported).toBe(false);
  });

  it('should call setEnhRepStatusAndJitterDebugSupported with error', () => {
    gwcService.getEnhRepStatus.and.returnValue(throwError('error'));
    component.initialDataLoadHandler();

    expect(component.enhRepStatus).toBe('UNKNOWN');
    expect(component.isJitterDebugSupported).toBe(false);
  });
  // checkRtcpxrSupported
  it('should call checkRtcpxrSupported with error', () => {
    gwcService.checkRtcpxrSupported.and.returnValue(throwError('eror'));
    component.initialDataLoadHandler();

    expect(component.isRtcpxrSupported).toEqual(false);
  });

  // updateRtcpxrNegotiationClick
  it('should call updateRtcpxrNegotiationClick with true', () => {
    spyOn(component, 'setBlocksTableDataToZero');
    component.updateRtcpxrNegotiationClick(true);

    expect(component.configurationFormGroup.get('rtcpxrReporting')?.disabled).toBeTrue();
    expect(component.setBlocksTableDataToZero).toHaveBeenCalled();
  });

  it('should call updateRtcpxrNegotiationClick with false', () => {
    component.updateRtcpxrNegotiationClick(false);
    expect(component.configurationFormGroup.get('rtcpxrReporting')?.disabled).toBeFalse();
  });

  // updateRtcpxrReportingClick
  it('should call updateRtcpxrReportingClick with true', () => {
    component.updateRtcpxrReportingClick(true);

    expect(component.configurationFormGroup.get('disableRtcpxrNegotiation')?.disabled).toBeTrue();
  });

  it('should call updateRtcpxrReportingClick with false', () => {
    spyOn(component, 'setBlocksTableDataToZero');
    component.updateRtcpxrReportingClick(false);
    expect(component.setBlocksTableDataToZero).toHaveBeenCalled();
    expect(component.configurationFormGroup.get('disableRtcpxrNegotiation')?.disabled).toBeFalse();
  });

  // updateQosReportingClick
  it('should call updateQosReportingClick with true disableRtcpxrNegotiation true', () => {
    component.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(true);
    component.updateQosReportingClick(true);

    expect(component.configurationFormGroup.get('rtcpxrReporting')?.disabled).toBeTrue();

    expect(component.configurationFormGroup.get('currentBaseMetrics')?.value).toBeTrue();
    expect(component.configurationFormGroup.get('rtpBaseRemoteMetrics')?.disabled).toBeFalse();
    expect(component.configurationFormGroup.get('extraBaseMetrics')?.disabled).toBeFalse();
    expect(component.configurationFormGroup.get('codecMetrics')?.disabled).toBeFalse();
    expect(component.configurationFormGroup.get('disableRtcpxrNegotiation')?.disabled).toBeFalse();
  });

  it('should call updateQosReportingClick with true disableRtcpxrNegotiation false', () => {
    component.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false);
    component.updateQosReportingClick(true);

    expect(component.configurationFormGroup.get('rtcpxrReporting')?.disabled).toBeFalse();

    expect(component.configurationFormGroup.get('currentBaseMetrics')?.value).toBeTrue();
    expect(component.configurationFormGroup.get('rtpBaseRemoteMetrics')?.disabled).toBeFalse();
    expect(component.configurationFormGroup.get('extraBaseMetrics')?.disabled).toBeFalse();
    expect(component.configurationFormGroup.get('codecMetrics')?.disabled).toBeFalse();
    expect(component.configurationFormGroup.get('disableRtcpxrNegotiation')?.disabled).toBeFalse();
  });

  it('should call updateQosReportingClick with false', () => {
    spyOn(component.configurationFormGroup, 'setValue');
    spyOn(component, 'setBlocksTableDataToZero');
    component.updateQosReportingClick(false);

    expect(component.configurationFormGroup.setValue).toHaveBeenCalledWith({
      qosReporting: false,
      currentBaseMetrics: false,
      rtpBaseRemoteMetrics: false,
      extraBaseMetrics: false,
      codecMetrics: false,
      rtcpxrReporting: false,
      disableRtcpxrNegotiation: false,
      localVoiceQualityMonitorMetric: false,
      remoteVoiceQualityMonitorMetric: false,
      localVoiceQualityDebugMetric: false,
      remoteVoiceQualityDebugMetric: false,
      localLossDebugMetric: false,
      remoteLossDebugMetric: false,
      localUnitStimSpecificMetric: false,
      localJitterDebugMetric: false,
      remoteJitterDebugMetric: false
    });
    expect(component.setBlocksTableDataToZero).toHaveBeenCalled();
    expect(component.configurationFormGroup.get('currentBaseMetrics')?.disabled).toBeTrue();
    expect(component.configurationFormGroup.get('rtpBaseRemoteMetrics')?.disabled).toBeTrue();
    expect(component.configurationFormGroup.get('extraBaseMetrics')?.disabled).toBeTrue();

    expect(component.configurationFormGroup.get('codecMetrics')?.disabled).toBeTrue();
    expect(component.configurationFormGroup.get('rtcpxrReporting')?.disabled).toBeTrue();
    expect(component.configurationFormGroup.get('disableRtcpxrNegotiation')?.disabled).toBeFalse();
  });

  it('should call disableEnhRep', () => {
    spyOn(component.configurationFormGroup, 'updateValueAndValidity');
    spyOn(component, 'setBlocksTableDataToZero');
    component.disableEnhRep();

    expect(component.configurationFormGroup.get('rtpBaseRemoteMetrics')?.disabled).toBeTrue();
    expect(component.configurationFormGroup.get('extraBaseMetrics')?.disabled).toBeTrue();
    expect(component.configurationFormGroup.get('codecMetrics')?.disabled).toBeTrue();
    expect(component.configurationFormGroup.get('rtcpxrReporting')?.disabled).toBeTrue();
    expect(component.setBlocksTableDataToZero).toHaveBeenCalled();
    expect(component.configurationFormGroup.updateValueAndValidity).toHaveBeenCalled();
  });

  it('should call associateBtn qosCollectorsDataCount === 2', () => {
    component.qosCollectorsDataCount = 2;
    component.associateBtn();

    expect(component.errorTitle).toBe(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ASSOCIATE_TITLE);
    expect(component.errorText)
      .toBe(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.MAX_ASSOCIATION_ERROR);
    expect(component.showErrorPopup).toBe(true);
  });

  it('should call associateBtn qosCollectorsDataCount === 1', () => {
    spyOn(component, 'getAvailableAssociationList');
    component.qosCollectorsDataCount = 1;
    component.associateBtn();

    expect(component.getAvailableAssociationList).toHaveBeenCalled();
  });

  // getAvailableAssociationList
  it('should call getAvailableAssociationList()', () => {
    gwcService.getAvailableAssociationList.and.returnValue(of(availableCodecListRes));
    component.getAvailableAssociationList();

    expect(gwcService.getAvailableAssociationList).toHaveBeenCalled();
    expect(component.dropDownDataItems).toEqual([
      {label: 'test3:20000', value: 'test3:20000'},
      {label: 'tst:20000', value: 'tst:20000'},
      {label: 'test2:20000', value: 'test2:20000'}
    ]);
    expect(component.showAssociateDialog).toBeTrue();
  });

  it('should call getAvailableAssociationList() with count zero ', () => {
    gwcService.getAvailableAssociationList.and.returnValue(of({ count: 0, list: [] }));
    const noFreeAssociateAvailableData =
    translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.NO_FREE_QOS_COL;

    component.getAvailableAssociationList();

    expect(gwcService.getAvailableAssociationList).toHaveBeenCalled();
    expect(component.dropDownDataItems).toEqual([
      {label: noFreeAssociateAvailableData, value: noFreeAssociateAvailableData}
    ]);
    expect(component.showAssociateDialog).toBeTrue();
  });

  it('should call getAvailableAssociationList() with error', () => {
    gwcService.getAvailableAssociationList.and.returnValue(throwError('error'));

    component.getAvailableAssociationList();

    expect(gwcService.getAvailableAssociationList).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  it('should call associateFormFooterHandler() with true', () => {
    spyOn(component, 'associateQoSCollector');
    const event = true;
    component.associateFormFooterHandler(event);

    expect(component.associateQoSCollector).toHaveBeenCalled();
  });

  it('should call associateFormFooterHandler() with false', () => {
    spyOn(component, 'closeAddAndAssociateDialogAndDeleteFormValue');
    const event = false;
    component.associateFormFooterHandler(event);

    expect(component.closeAddAndAssociateDialogAndDeleteFormValue).toHaveBeenCalled();
  });

  // associateQoSCollector()
  it('should call associateQoSCollector()', () => {
    gwcService.associateQoSCollector.and.returnValue(of(messageContent));
    spyOn(component, 'closeAddAndAssociateDialogAndDeleteFormValue');
    spyOn(component, 'refreshQosCollectorsTable');
    const selectedData = {selectedQosCollector: 'test3:20000'};

    component.associateQoSCollector(selectedData);

    expect(gwcService.associateQoSCollector).toHaveBeenCalled();
    expect(component.closeAddAndAssociateDialogAndDeleteFormValue).toHaveBeenCalled();
    expect(component.refreshQosCollectorsTable).toHaveBeenCalled();
  });

  it('should call associateQoSCollector() with associateErrorWithoutGWCExc', () => {
    gwcService.associateQoSCollector.and.returnValue(throwError(associateErrorWithoutGWCExc));
    const selectedData = {selectedQosCollector: 'test3:20000'};

    component.associateQoSCollector(selectedData);

    expect(gwcService.associateQoSCollector).toHaveBeenCalled();
    expect(component.errorTitle)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.DELETE.SYSTEM_ERROR);
    expect(component.errorText)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.ERROR_MESSAGE);
    expect(component.showErrorPopup).toBeTrue();
  });

  it('should call associateQoSCollector() with associateErrorWithGWCExc', () => {
    gwcService.associateQoSCollector.and.returnValue(throwError(associateErrorWithGWCExc));
    const selectedData = {selectedQosCollector: 'test3:20000'};

    component.associateQoSCollector(selectedData);

    expect(gwcService.associateQoSCollector).toHaveBeenCalled();
    expect(component.errorTitleAddAssociateAndQosStatus)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.ASSOCIATE_FAILED_TITLE);
    expect(component.showAddAssociateAndQosStatus).toBeTrue();
  });

  it('should call closeErrorPopup()', () => {
    component.closeErrorPopup();

    expect(component.showErrorPopup).toBeFalse();
    expect(component.errorTitle).toEqual('');
    expect(component.errorText).toEqual('');
  });

  // addQosCollector
  it('should call addQosCollector()', () => {
    networkConfigurationService.addQoSCollector.and.returnValue(of(messageContent));
    spyOn(component, 'closeAddAndAssociateDialogAndDeleteFormValue');
    const data = {
      qosName: 'test3',
      ipAddress: '12.1.2.4',
      port: '20000'
    };

    component.addQosCollector(data);

    expect(networkConfigurationService.addQoSCollector).toHaveBeenCalled();
    expect(component.closeAddAndAssociateDialogAndDeleteFormValue).toHaveBeenCalled();
  });

  it('should call addQosCollector() with errror', () => {
    networkConfigurationService.addQoSCollector.and.returnValue(throwError(addQosCollError));
    const data = {
      qosName: 'test3',
      ipAddress: '12.1.2.4',
      port: '20000'
    };

    component.addQosCollector(data);

    expect(networkConfigurationService.addQoSCollector).toHaveBeenCalled();
    expect(component.showAddAssociateAndQosStatus).toBeTrue();
  });

  it('should call closeAddAndAssociateDialogAndDeleteFormValue()', () => {
    const addData = {
      qosName: null,
      ipAddress: null,
      port: null
    };
    const associateData = {
      selectedQosCollector: null
    };

    component.closeAddAndAssociateDialogAndDeleteFormValue();

    expect(component.addQosCollectorFormGroup.value).toEqual(addData);
    expect(component.associateFormGroup.value).toEqual(associateData);
    expect(component.showAddDialog).toBeFalse();
    expect(component.showAssociateDialog).toBeFalse();
  });

  it('should call closeAddAssociateAndQosStatusErrorDialog()', () => {

    component.closeAddAssociateAndQosStatusErrorDialog();

    expect(component.showAddAssociateAndQosStatus).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
    expect(component.errorTitleAddAssociateAndQosStatus).toEqual('');
    expect(component.messageTextAddAssociateAndQosStatusError).toEqual('');
    expect(component.detailsTextAddAssociateAndQosStatusError).toEqual('');
  });

  it('should call addNewQoSCollectorBtn()', () => {

    component.addNewQoSCollectorBtn();

    expect(component.showAddDialog).toBeTrue();
  });

  it('should call addQosCollectorFormFooterHandler() with true', () => {
    spyOn(component, 'addQosCollector');
    const data = {
      qosName: 'test3',
      ipAddress: '12.1.2.4',
      port: '20000'
    };
    component.addQosCollectorFormGroup.setValue(data);
    const event = true;
    component.addQosCollectorFormFooterHandler(event);

    expect(component.addQosCollector).toHaveBeenCalled();
  });

  it('should call addQosCollectorFormFooterHandler() with false', () => {
    spyOn(component, 'closeAddAndAssociateDialogAndDeleteFormValue');
    const event = false;
    component.addQosCollectorFormFooterHandler(event);

    expect(component.closeAddAndAssociateDialogAndDeleteFormValue).toHaveBeenCalled();
  });

  // disassociate
  it('should call disassociate()', () => {
    component.qosCollectorsDataCount = 1;
    const qosInfo = {
      qosName: 'test3',
      ipAddress: '12.1.2.4',
      port: '20000'
    };
    component.configurationFormGroup.get('qosReporting')?.setValue(true);

    component.disassociate(qosInfo);

    expect(component.showDeleteConfirmPopup).toBeTrue();
  });

  it('should call disassociate() dataCount not equal to 1', () => {
    component.qosCollectorsDataCount = 2;
    const qosInfo = {
      qosName: 'test3',
      ipAddress: '12.1.2.4',
      port: '20000'
    };
    component.configurationFormGroup.get('qosReporting')?.setValue(true);

    component.disassociate(qosInfo);

    expect(component.showDeleteConfirmPopup).toBeTrue();
  });

  it('should call closeDeleteConfirmPopup()', () => {

    component.closeDeleteConfirmPopup();

    expect(component.showDeleteConfirmPopup).toBeFalse();
    expect(component.deleteMessage).toEqual('');
    expect(component.deleteSelectedData).toEqual({
      qosName: '',
      ipAddress: '',
      port: ''
    });
  });

  it('should call deleteQoSCollectorFooterHandler() with true', () => {
    spyOn(component, 'deleteQosCollector');
    component.deleteQoSCollectorFooterHandler(true);

    expect(component.deleteQosCollector).toHaveBeenCalled();
  });

  it('should call deleteQoSCollectorFooterHandler() with false', () => {
    spyOn(component, 'closeDeleteConfirmPopup');
    component.deleteQoSCollectorFooterHandler(false);

    expect(component.closeDeleteConfirmPopup).toHaveBeenCalled();
  });

  // deleteQoSCollector
  it('should call deleteQosCollector()', () => {
    gwcService.disassociateQoSCollector.and.returnValue(of(messageContent));
    spyOn(component, 'closeDeleteConfirmPopup');
    component.deleteSelectedData = {
      qosName: 'test3',
      ipAddress: '12.1.2.4',
      port: '20000'
    };
    component.deleteQosCollector();

    expect(component.closeDeleteConfirmPopup).toHaveBeenCalled();
  });

  it('should call deleteQosCollector() with error with GWC exception', () => {
    gwcService.disassociateQoSCollector.and.returnValue(throwError(gWCDisassociateException));

    component.deleteQosCollector();

    expect(component.showDeleteErrorPopup).toBeTrue();
  });

  it('should call deleteQosCollector() with error', () => {
    gwcService.disassociateQoSCollector.and.returnValue(throwError('error'));

    component.deleteQosCollector();

    expect(component.deleteErrorTitle)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.DELETE.SYSTEM_ERROR);
    expect(component.deleteMessageText)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.DELETE.ERROR_MESSAGE);
    expect(component.showDeleteErrorPopup).toBeTrue();
  });

  it('should call closeDeleteErrorPopup()', () => {
    component.closeDeleteErrorPopup();

    expect(component.showDeleteErrorPopup).toBeFalse();
    expect(component.deleteErrorTitle).toEqual('');
    expect(component.deleteMessageText).toEqual('');
  });

  // Configuration Panel Apply
  it('should call onFooterHandlerConfigurationPanel() with true', () => {
    spyOn(component, 'openConfirmationPopupForApplyConfgPanel');
    component.onFooterHandlerConfigurationPanel(true);

    expect(component.openConfirmationPopupForApplyConfgPanel).toHaveBeenCalled();
  });

  it('should call onFooterHandlerConfigurationPanel() with false', () => {
    spyOn(component, 'resetConfigurationPanel');
    component.onFooterHandlerConfigurationPanel(false);

    expect(component.resetConfigurationPanel).toHaveBeenCalled();
  });

  it('should call resetConfigurationPanel()', () => {
    spyOn(component, 'initialDataLoadHandler');
    component.resetConfigurationPanel();

    expect(component.initialDataLoadHandler).toHaveBeenCalled();
  });

  it('should call resetConfigurationPanelWithAvailableData()', () => {
    spyOn(component, 'checkAssociateBtnEnableAndSetConfigurationCheckbox');
    component.resetConfigurationPanelWithAvailableData();

    expect(component.checkAssociateBtnEnableAndSetConfigurationCheckbox).toHaveBeenCalled();
  });

  it('should call openConfirmationPopupForApplyConfgPanel() qosReporting true', () => {
    component.configurationFormGroup.get('qosReporting')?.setValue(true);
    component.openConfirmationPopupForApplyConfgPanel();

    expect(component.showConfirmPopupApplyWithQoSCollEnable).toBeTrue();
  });

  it('should call openConfirmationPopupForApplyConfgPanel() qosReporting false, disableRtcpxrNegotiation true ', () => {
    component.configurationFormGroup.get('qosReporting')?.setValue(false);
    component.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(true);
    component.openConfirmationPopupForApplyConfgPanel();

    expect(component.showConfirmPopupApplyWithQoSCollDisable).toBeTrue();
  });

  it('should call openConfirmationPopupForApplyConfgPanel() qosReporting false, disableRtcpxrNegotiation'+
    'false, all true isRtcpxrSupported && isJitterDebugSupported && isSmallLineGWC', () => {
    component.configurationFormGroup.get('qosReporting')?.setValue(false);
    component.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false);
    component.isRtcpxrSupported = true;
    component.isJitterDebugSupported = true;
    component.isSmallLineGWC = true;
    component.openConfirmationPopupForApplyConfgPanel();

    expect(component.confirmPopupTitle)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.APPLY_CONFIRM_DISABLE_RTCP_XR_TITLE);
    expect(component.confirmPopupMessage)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.CONFIRM_POPUP_ALL_TRUE
        .replace('/{{gwcName}}/', component.gwControllerName));
    expect(component.showAddConfirmPopup).toBeTrue();
  });

  it('should call openConfirmationPopupForApplyConfgPanel() qosReporting false, disableRtcpxrNegotiation false,'+
    ' false isRtcpxrSupported && isJitterDebugSupported && isSmallLineGWC', () => {
    component.configurationFormGroup.get('qosReporting')?.setValue(false);
    component.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false);
    component.isRtcpxrSupported = false;
    component.isJitterDebugSupported = false;
    component.isSmallLineGWC = false;
    component.openConfirmationPopupForApplyConfgPanel();

    expect(component.confirmPopupTitle)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.APPLY_CONFIRM_DISABLE_RTCP_XR_TITLE);
    expect(component.confirmPopupMessage)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.CONFIRM_POPUP_ALL_FALSE
        .replace('/{{gwcName}}/', component.gwControllerName));
    expect(component.showAddConfirmPopup).toBeTrue();
  });

  it('should call addConfirmPopupQoSCollectorFooterHandler() with true', () => {
    spyOn(component, 'postQosCollectionStatus');
    component.addConfirmPopupQoSCollectorFooterHandler(true);

    expect(component.postQosCollectionStatus).toHaveBeenCalled();
  });

  it('should call addConfirmPopupQoSCollectorFooterHandler() with false', () => {
    spyOn(component, 'refreshQosCollectorsTable');
    spyOn(component, 'closeApplyConfirmPopup');
    component.addConfirmPopupQoSCollectorFooterHandler(false);

    expect(component.refreshQosCollectorsTable).toHaveBeenCalled();
    expect(component.closeApplyConfirmPopup).toHaveBeenCalled();
  });

  it('should call closeApplyConfirmPopup()', () => {
    component.closeApplyConfirmPopup();

    expect(component.showConfirmPopup).toBeFalse();
    expect(component.showConfirmPopupApplyWithQoSCollEnable).toBeFalse();
    expect(component.showConfirmPopupApplyWithQoSCollDisable).toBeFalse();
    expect(component.showAddConfirmPopup).toBeFalse();
    expect(component.confirmPopupTitle).toEqual('');
    expect(component.confirmPopupMessage).toEqual('');
  });

  // qosReporting true
  it('should call applyConfirmationPopupQoSCollEnableFooterHandler() with true', () => {
    spyOn(component, 'applyConfirmationPanel');
    component.applyConfirmationPopupQoSCollEnableFooterHandler(true);

    expect(component.applyConfirmationPanel).toHaveBeenCalled();
  });

  it('should call applyConfirmationPopupQoSCollEnableFooterHandler() with false', () => {
    spyOn(component, 'closeApplyConfirmPopup');
    component.applyConfirmationPopupQoSCollEnableFooterHandler(false);

    expect(component.closeApplyConfirmPopup).toHaveBeenCalled();
  });

  // applyConfirmationPanel
  it('should call applyConfirmationPanel', () => {
    component.qosCollectorsDataCount = 0;
    component.applyConfirmationPanel();

    expect(component.titleText)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIRM_QOS_ENABLE_TITLE);
    expect(component.messageText)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIRM_QOS_ENABLE_MESSAGE);
    expect(component.detailsText)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIRM_QOS_ENABLE_DETAILS);
    expect(component.showErrorDialog).toEqual(true);
  });

  it('should call applyConfirmationPanel', () => {
    component.qosCollectorsDataCount = 1;
    gwcService.getQoSCollector.and.returnValue(of({
      count: 0,
      list: []
    }));
    component.applyConfirmationPanel();

    expect(component.titleText)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIGURE_QOS_COLLECTION_TITLE);
    expect(component.messageText)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIGURE_QOS_COLLECTION_MESSAGE);
    expect(component.detailsText)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIGURE_QOS_COLLECTION_DETAILS);
    expect(component.showErrorDialog).toEqual(true);
  });

  it('should call applyConfirmationPanel when count not equal to zero', () => {
    spyOn(component, 'postQosCollectionStatus');
    spyOn(component, 'closeApplyConfirmPopup');
    gwcService.getQoSCollector.and.returnValue(of({
      count: 1,
      list: [{}]
    }));
    component.applyConfirmationPanel();

    expect(component.postQosCollectionStatus).toHaveBeenCalled();
    expect(component.closeApplyConfirmPopup).toHaveBeenCalled();
  });

  it('should call applyConfirmationPanel with error', () => {
    gwcService.getQoSCollector.and.returnValue(throwError('error'));
    component.applyConfirmationPanel();

    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call showOrHideButtonClick()', () => {
    component.showDetailsBtn = true;
    component.showOrHideButtonClick();

    expect(component.showDetailsBtn).toBeFalse();
  });

  it('should call closeShowHideErrorDialogWithOkBtn() count is not 0', () => {
    spyOn(component, 'postQosCollectionStatus');
    spyOn(component, 'closeErrorDialog');
    component.qosCollectorsDataCount = 1;
    component.closeShowHideErrorDialogWithOkBtn();

    expect(component.postQosCollectionStatus).toHaveBeenCalled();
    expect(component.closeErrorDialog).toHaveBeenCalled();
  });

  it('should call closeShowHideErrorDialogWithOkBtn() count is 0', () => {
    spyOn(component, 'resetConfigurationPanelWithAvailableData');
    spyOn(component, 'closeErrorDialog');
    component.qosCollectorsDataCount = 0;
    component.closeShowHideErrorDialogWithOkBtn();

    expect(component.resetConfigurationPanelWithAvailableData).toHaveBeenCalled();
    expect(component.closeErrorDialog).toHaveBeenCalled();
  });

  it('should call closeErrorDialog()', () => {
    spyOn(component, 'closeApplyConfirmPopup');
    component.closeErrorDialog();

    expect(component.showErrorDialog).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
    expect(component.titleText).toEqual('');
    expect(component.messageText).toEqual('');
    expect(component.detailsText).toEqual('');
    expect(component.closeApplyConfirmPopup).toHaveBeenCalled();
  });

  // qosReporting false
  it('should call applyConfirmationPopupQoSCollDisableFooterHandler() with true', () => {
    spyOn(component, 'postQosCollectionStatus');
    component.applyConfirmationPopupQoSCollDisableFooterHandler(true);

    expect(component.postQosCollectionStatus).toHaveBeenCalled();
  });

  it('should call applyConfirmationPopupQoSCollDisableFooterHandler() with false', () => {
    spyOn(component, 'confirmationPopupQoSCollectionDisableNoOption');
    component.applyConfirmationPopupQoSCollDisableFooterHandler(false);

    expect(component.confirmationPopupQoSCollectionDisableNoOption).toHaveBeenCalled();
  });

  it('should call confirmationPopupQoSCollectionDisableNoOption()', () => {
    spyOn(component, 'refreshQosCollectorsTable');
    spyOn(component, 'closeApplyConfirmPopup');
    component.confirmationPopupQoSCollectionDisableNoOption();

    expect(component.refreshQosCollectorsTable).toHaveBeenCalled();
    expect(component.closeApplyConfirmPopup).toHaveBeenCalled();
  });

  // postQosCollectionStatus
  it('should call postQosCollectionStatus()', () => {
    gwcService.postQosCollectionStatus.and.returnValue(of(messageContent));
    spyOn(component, 'refreshQosCollectorsTable');
    component.configurationFormGroup.setValue(postQoSCollectionData);
    component.postQosCollectionStatus();

    expect(gwcService.postQosCollectionStatus).toHaveBeenCalled();
    expect(component.refreshQosCollectorsTable).toHaveBeenCalled();
  });

  it('should call postQosCollectionStatus()', () => {
    gwcService.postQosCollectionStatus.and.returnValue(of(messageContent));
    spyOn(component, 'refreshQosCollectorsTable');
    component.isJitterDebugSupported = true;
    component.isSmallLineGWC = true;
    component.configurationFormGroup.setValue(postQoSCollectionDataRtcpxrReportingFalse);
    component.postQosCollectionStatus();

    expect(gwcService.postQosCollectionStatus).toHaveBeenCalled();
    expect(component.refreshQosCollectorsTable).toHaveBeenCalled();
  });

  it('should call postQosCollectionStatus() with error with GWC exception', () => {
    gwcService.postQosCollectionStatus.and.returnValue(throwError(gWCDisassociateException));

    component.postQosCollectionStatus();

    expect(component.showPostErrorDialog).toBeTrue();
  });

  it('should call postQosCollectionStatus() with error', () => {
    gwcService.postQosCollectionStatus.and.returnValue(throwError('error'));

    component.postQosCollectionStatus();

    expect(component.titleText)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.SYSTEM_ERROR);
    expect(component.messageText)
      .toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.POST_SYSTEM_ERROR_MESSAGE);
    expect(component.showPostErrorDialog).toBeTrue();
  });

  it('should call closeShowPostShowHideErrorDialogWithOkBtn()', () => {
    spyOn(component, 'closeApplyConfirmPopup');
    component.closeShowPostShowHideErrorDialogWithOkBtn();

    expect(component.closeApplyConfirmPopup).toHaveBeenCalled();
  });
});
