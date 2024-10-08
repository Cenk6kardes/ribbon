import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { tableConfigCommon } from 'src/app/types/const';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { Icols, ITableConfig, FilterTypes, FieldName, ItemDropdown } from 'rbn-common-lib';
import {
  IProvisioningAssociateDropdownData,
  IProvisioningCheckSmallLineGWCRes,
  IProvisioningFormData,
  IProvisioningGWCInfoRes, IProvisioningListData,
  IProvisioningQoSCollectionStatusRes,
  IProvisioningQoSCollectorsRes,
  IQOSCollectors
} from '../../../models/qosCollectors';
import { NetworkConfigurationService } from 'src/app/modules/network-configuration/services/network-configuration.service';
import { tap, catchError, take } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-qos-collectors',
  templateUrl: './qos-collectors.component.html',
  styleUrls: ['./qos-collectors.component.scss']
})
export class QosCollectorsComponent implements OnInit, OnChanges {
  @Input() gwControllerName!: string;

  transformedData: IProvisioningFormData;

  translateResults: any;
  isLoading = false;

  // QoS Collectors Table
  qosCollectorsTableConfig: ITableConfig;
  qosCollectorsTableCols: Icols[] = [];
  qosCollectorsTableData: IProvisioningListData[] = [];
  qosCollectorsDataCount = 0;

  gwcIp: string;
  currentGwcName: string;

  rtcpxrReportingOfGetQosCollectionStatus: number;

  // associate
  isSmallLineGWC: boolean;
  enhRepStatus: string;
  isRtcpxrSupported: boolean;
  isJitterDebugSupported: boolean;

  isNoFreeAvailableData = false;

  showErrorPopup = false;
  errorTitle = '';
  errorText = '';

  showErrorDialog = false;
  showPostErrorDialog = false;
  errorData: {
    errorCode: string,
    message: string
  };
  titleText: string;
  messageText: string;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showDetailsBtn = true;
  btnLabel = 'Show Details';

  configurationFormGroup: FormGroup;

  // disassociate
  showDeleteConfirmPopup = false;
  deleteMessage = '';
  deleteSelectedData: IProvisioningListData = {
    qosName: '',
    ipAddress: '',
    port: ''
  };
  deleteErrorTitle = '';
  deleteErrorData: {
    errorCode: string,
    message: string
  };
  deleteMessageText: string;
  showDeleteErrorPopup = false;

  // Enable/Disable
  isApplyBtnEnable = false; // disabled
  isDisassociateBtnEnable = true; // enabled
  isAssociateBtnEnable = true; // enabled

  // Display
  isQoSColPendingDisplay = true;
  isDisplayDisableRtcpxrNegotiationCheckbox = true;

  showConfirmPopupApplyWithQoSCollEnable = false;
  showConfirmPopupApplyWithQoSCollDisable = false;
  showConfirmPopup = false;
  confirmPopupTitle = '';
  confirmPopupMessage = '';

  // associate
  associateFormGroup: FormGroup;
  dropDownDataItems: ItemDropdown[];
  showAssociateDialog = false;

  // add qos collector
  addQosCollectorFormGroup: FormGroup;
  showAddDialog = false;
  showAddConfirmPopup= false;

  showAddAssociateAndQosStatus = false;
  errorTitleAddAssociateAndQosStatus = '';
  messageTextAddAssociateAndQosStatusError = '';
  detailsTextAddAssociateAndQosStatusError = '';

  // initial data load observables
  private checkSmallLineGWC$$: Observable<IProvisioningCheckSmallLineGWCRes | null>;
  private setEnhRepStatusAndJitterDebugSupported$$: Observable<string[] | boolean>;
  private getTableData$$: Observable<IProvisioningQoSCollectorsRes | null>;
  private getQosCollectionStatus$$: Observable<IProvisioningQoSCollectionStatusRes | boolean>;

  constructor(
    private gwcService: GatewayControllersService,
    private commonService: CommonService,
    private translateService: TranslateInternalService,
    private networkConfigurationService: NetworkConfigurationService
  ) {
    this.translateResults = this.translateService.translateResults;
    this.qosCollectorsTableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        ...tableConfigCommon.tableOptions,
        dataKey: 'qosName'
      },
      tableName: 'ProvisioningQosCollectorsTbl',
      emptyMessageContent: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.COMMON.EMPTY_MSG,
      actionColumnConfig: {
        actions: [
          {
            icon: 'fas fa-trash',
            label: 'Delete',
            tooltip: 'Delete',
            disabled: !this.isDisassociateBtnEnable,
            onClick: (event: any) => {
              this.deleteSelectedData = {
                qosName: event.qosName,
                ipAddress: event.ipAddress,
                port: event.port
              };
              this.disassociate(event);
            }
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    this.initAddForm();
    this.initAssociateForm();
    this.initForm();
    this.initCols();

    this.initialDataLoadHandler();
  }

  updateRtcpxrNegotiationClick(event: any){
    if(event) {
      this.configurationFormGroup.get('rtcpxrReporting')?.disable(); // disabled
      this.setBlocksTableDataToZero();
    } else {
      this.configurationFormGroup.get('rtcpxrReporting')?.enable(); // enable
    }
  }

  updateRtcpxrReportingClick(event: any){
    if(event) {
      this.configurationFormGroup.get('disableRtcpxrNegotiation')?.disable(); // disabled
    } else {
      this.setBlocksTableDataToZero();
      this.configurationFormGroup.get('disableRtcpxrNegotiation')?.enable(); // enable
    }
  }

  updateQosReportingClick(event: any){
    if(event) {
      if(this.configurationFormGroup.get('disableRtcpxrNegotiation')?.value){
        this.configurationFormGroup.get('rtcpxrReporting')?.disable(); // disabled
      } else {
        this.configurationFormGroup.get('rtcpxrReporting')?.enable(); // enabled
      }
      this.configurationFormGroup.get('currentBaseMetrics')?.setValue(true);
      this.configurationFormGroup.get('rtpBaseRemoteMetrics')?.enable(); // enabled
      this.configurationFormGroup.get('extraBaseMetrics')?.enable(); // enabled
      this.configurationFormGroup.get('codecMetrics')?.enable(); // enabled
      this.configurationFormGroup.get('disableRtcpxrNegotiation')?.enable(); // enabled
    } else {
      this.configurationFormGroup.setValue({
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
      this.setBlocksTableDataToZero();
      this.configurationFormGroup.get('currentBaseMetrics')?.disable(); // disabled
      this.configurationFormGroup.get('rtpBaseRemoteMetrics')?.disable(); // disabled
      this.configurationFormGroup.get('extraBaseMetrics')?.disable(); // disabled
      this.configurationFormGroup.get('codecMetrics')?.disable(); // disabled
      this.configurationFormGroup.get('rtcpxrReporting')?.disable(); // disabled
      this.configurationFormGroup.get('disableRtcpxrNegotiation')?.enable(); // enable
    }
  }

  initialDataLoadHandler() {
    this.isLoading = true;
    this.checkSmallLineGWC$$ = this.gwcService
      .getNodeNumber(this.gwControllerName)
      .pipe(
        tap((res: IProvisioningCheckSmallLineGWCRes) => {
          const gwcProfile = res.nodeList[0]?.serviceConfiguration?.gwcProfileName;
          this.isSmallLineGWC = gwcProfile.toLowerCase().includes('small_line');
        }),
        catchError((error: any) => this.commonService.showAPIError$(error))
      );
    this.setEnhRepStatusAndJitterDebugSupported$$ = this.gwcService
      .getEnhRepStatus(this.gwControllerName)
      .pipe(
        tap((res: string[]) => {
          if(res.length > 0) {
            if(res[0] === '1') {
              this.enhRepStatus = 'SUPPORTED';
            } else {
              this.enhRepStatus = 'UNSUPPORTED';
            }
            if(res[1] === '1') {
              this.isJitterDebugSupported = true;
            } else {
              this.isJitterDebugSupported = false;
            }
          } else {
            this.enhRepStatus = 'UNSUPPORTED';
            this.isJitterDebugSupported = false;
          }
        }),
        catchError((error: any) => {
          this.enhRepStatus = 'UNKNOWN';
          this.isJitterDebugSupported = false;
          return of(true);
        })
      );
    this.getTableData$$ = this.gwcService
      .getQosCollectors(this.gwControllerName)
      .pipe(
        tap((res: IProvisioningQoSCollectorsRes) => {
          this.qosCollectorsTableData = [];
          this.qosCollectorsTableData = res.list;
          this.qosCollectorsDataCount = res.count;
        }),
        catchError((error: any) => this.commonService.showAPIError$(error))
      );
    this.getQosCollectionStatus$$ = this.gwcService
      .getQosCollectionStatus(this.gwControllerName)
      .pipe(
        tap((res: IProvisioningQoSCollectionStatusRes) => {
          this.rtcpxrReportingOfGetQosCollectionStatus = res?.rtcpxrReporting;
          const rtcpxrReporting = this.rtcpxrReportingOfGetQosCollectionStatus === 1 ? true : false;
          this.transformedData = {
            qosReporting: res?.qosReporting === 1 ? true : false,
            currentBaseMetrics: res?.currentBaseMetrics === 1 ? true : false,
            rtpBaseRemoteMetrics: res?.rtpBaseRemoteMetrics === 1 ? true : false,
            extraBaseMetrics: res?.extraBaseMetrics === 1 ? true : false,
            codecMetrics: res?.codecMetrics === 1 ? true : false,
            rtcpxrReporting: rtcpxrReporting,
            disableRtcpxrNegotiation: !rtcpxrReporting,
            localVoiceQualityMonitorMetric: res?.rtcpxrBlocks[0] === '1' ? true : false,
            remoteVoiceQualityMonitorMetric: res?.rtcpxrBlocks[1] === '1' ? true : false,
            localVoiceQualityDebugMetric: res?.rtcpxrBlocks[2] === '1' ? true : false,
            remoteVoiceQualityDebugMetric: res?.rtcpxrBlocks[3] === '1' ? true : false,
            localLossDebugMetric: res?.rtcpxrBlocks[4] === '1' ? true : false,
            remoteLossDebugMetric: res?.rtcpxrBlocks[5] === '1' ? true : false,
            localUnitStimSpecificMetric: res?.rtcpxrBlocks[6] === '1' ? true : false,
            localJitterDebugMetric: res?.rtcpxrBlocks[7] === '1' ? true : false,
            remoteJitterDebugMetric: res?.rtcpxrBlocks[8] === '1' ? true : false
          };
          this.configurationFormGroup.setValue( this.transformedData, {emitEvent: false} );
        }),
        catchError((error: any) => {
          this.errorData = error?.error || error;
          const messageAndDetails = JSON.stringify(this.errorData?.message);
          const isErrorGWCException = messageAndDetails?.includes('"message =');
          if(isErrorGWCException) {
            this.errorTitleAddAssociateAndQosStatus =
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.STATUS.ERROR.TITLE;
            const parsedErrorData = messageAndDetails?.split('details = ');
            this.messageTextAddAssociateAndQosStatusError = parsedErrorData ?
              parsedErrorData[0]?.split('"message = ')[1]?.replace(this.reg, '<br>')?.replace(this.tabReg, ' &emsp;' ): '';
            this.detailsTextAddAssociateAndQosStatusError =
              parsedErrorData[1]?.split('"')[0]?.replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' );
            this.showAddAssociateAndQosStatus = true;
          } else {
            this.errorTitle = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.STATUS.ERROR.TITLE;
            this.errorText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.STATUS.ERROR.FAILED;
            this.showErrorPopup = true;
          }
          return of(true);
        })
      );
    const dataHub = forkJoin(
      {
        checkSmallLineGWC: this.checkSmallLineGWC$$,
        setEnhRepStatusAndJitterDebugSupported: this.setEnhRepStatusAndJitterDebugSupported$$,
        getTableData: this.getTableData$$,
        getQosCollectionStatus: this.getQosCollectionStatus$$
      }
    );

    dataHub.pipe(
      take(1)
    ).subscribe({
      next: (initalLoadedData) => {
        this.isLoading = false;

        if (
          initalLoadedData.checkSmallLineGWC &&
          initalLoadedData.setEnhRepStatusAndJitterDebugSupported &&
          initalLoadedData.getTableData &&
          initalLoadedData.getQosCollectionStatus
        ) {
          this.isLoading = true;
          const checkRtcpxrSupported$ = this.gwcService
            .checkRtcpxrSupported(initalLoadedData.checkSmallLineGWC.nodeList[0]?.serviceConfiguration?.gwcProfileName)
            .pipe(
              tap((res: boolean) => {
                this.isRtcpxrSupported = res;
              }),
              catchError((error: any) => {
                this.isRtcpxrSupported = false;
                return of(true);
              })
            );
          checkRtcpxrSupported$.subscribe({
            next: (lastDataLoaded) => {
              this.isLoading = false;
              this.checkAssociateBtnEnableAndSetConfigurationCheckbox();
            }, error: () => {
              this.isLoading = false;
            }
          });
        }
      }
    });
  }

  ngOnChanges(): void {
    this.isLoading = true;
    this.gwcService.getUnitStatus(this.gwControllerName).subscribe({
      next: (res: IProvisioningGWCInfoRes) => {
        this.isLoading = false;
        this.gwcIp = res.unit0ID;
      },
      error: (error) => {
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
    if(this.currentGwcName && this.gwControllerName && this.currentGwcName !== this.gwControllerName) {
      this.initialDataLoadHandler();
    }
    this.currentGwcName = this.gwControllerName;
  }

  initCols() {
    this.qosCollectorsTableCols = [
      {
        data: [],
        field: 'qosName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.TABLE.COLS.QOS_COLL_NAME,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 190,
        manualMinColWidth: 190
      },
      {
        data: [],
        field: 'ipAddress',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.TABLE.COLS.IP_ADDRESS,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 135,
        manualMinColWidth: 135
      },
      {
        data: [],
        field: 'port',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.TABLE.COLS.PORT,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 90,
        manualMinColWidth: 90
      },
      {
        data: [],
        field: FieldName.Action,
        header:
          this.translateResults.COMMON.ACTION,
        colsEnable: true,
        sort: false,
        autoSetWidth: true
      }
    ];
  }

  refreshQosCollectorsTable() {
    this.initialDataLoadHandler();
  }

  checkAssociateBtnEnableAndSetConfigurationCheckbox() {
    if(this.enhRepStatus === 'SUPPORTED') {
      this.isAssociateBtnEnable = true;
      if(this.configurationFormGroup.get('qosReporting')?.value) {
        this.configurationFormGroup.get('qosReporting')?.enable(); // enabled
        this.configurationFormGroup.get('qosReporting')?.setValue(true, {emitEvent: false});
        // this.isCurrentBaseMetricsDisabled = true; // disabled
        this.configurationFormGroup.get('currentBaseMetrics')?.setValue(true, {emitEvent: false});
        this.configurationFormGroup.get('rtpBaseRemoteMetrics')?.enable(); // enabled
        this.configurationFormGroup.get('extraBaseMetrics')?.enable(); // enabled
        this.configurationFormGroup.get('codecMetrics')?.enable(); // enabled

        if(this.isRtcpxrSupported && !this.configurationFormGroup.get('disableRtcpxrNegotiation')?.value) {
          this.configurationFormGroup.get('rtcpxrReporting')?.enable(); // enabled
        }
        this.configurationFormGroup.updateValueAndValidity();
      } else {
        this.configurationFormGroup.get('qosReporting')?.enable(); // enabled
        this.configurationFormGroup.get('qosReporting')?.setValue(false, {emitEvent: false});
        this.disableEnhRep();
        this.configurationFormGroup.updateValueAndValidity();
      }

      this.configurationFormGroup.get('rtpBaseRemoteMetrics')?.setValue(this.transformedData.rtpBaseRemoteMetrics, {emitEvent: false});
      this.configurationFormGroup.get('extraBaseMetrics')?.setValue(this.transformedData.extraBaseMetrics, {emitEvent: false});
      this.configurationFormGroup.get('codecMetrics')?.setValue(this.transformedData.codecMetrics, {emitEvent: false});
      this.configurationFormGroup.updateValueAndValidity();
      if(this.isRtcpxrSupported) {
        if(this.isJitterDebugSupported) {
          if(this.isSmallLineGWC) {
            this.isDisplayDisableRtcpxrNegotiationCheckbox = true;  // if DisableRtcpxrNegotiation checkbox is not available, set visible
            if( this.rtcpxrReportingOfGetQosCollectionStatus === 0  ) {
              this.configurationFormGroup.get('rtcpxrReporting')?.setValue(false, {emitEvent: false});
              this.configurationFormGroup.get('rtcpxrReporting')?.disable(); // disabled
              this.setBlocksTableDataToZero();
              this.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(true, {emitEvent: false});
              this.configurationFormGroup.get('disableRtcpxrNegotiation')?.enable(); // enabled
              this.configurationFormGroup.updateValueAndValidity();
            } else if( this.rtcpxrReportingOfGetQosCollectionStatus === 1  ) {
              this.configurationFormGroup.get('rtcpxrReporting')?.setValue(true, {emitEvent: false});
              this.configurationFormGroup.get('rtcpxrReporting')?.enable(); // enabled
              this.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false, {emitEvent: false});
              this.configurationFormGroup.get('disableRtcpxrNegotiation')?.disable(); // disabled
              // already blocks table has value from getQosCollectionStatus
              this.configurationFormGroup.updateValueAndValidity();
            } else if( this.rtcpxrReportingOfGetQosCollectionStatus === 2  ) {
              this.configurationFormGroup.get('rtcpxrReporting')?.setValue(false, {emitEvent: false});
              this.setBlocksTableDataToZero();
              this.configurationFormGroup.get('qosReporting')?.value ?
                this.configurationFormGroup.get('rtcpxrReporting')?.enable() :  // enabled
                this.configurationFormGroup.get('rtcpxrReporting')?.disable(); // disabled
              this.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false, {emitEvent: false});
              this.configurationFormGroup.get('disableRtcpxrNegotiation')?.enable(); // enabled
              this.configurationFormGroup.updateValueAndValidity();
            }
            this.configurationFormGroup.updateValueAndValidity();
          } else {
            this.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false, {emitEvent: false});
            this.configurationFormGroup.get('disableRtcpxrNegotiation')?.disable(); // disabled
            this.isDisplayDisableRtcpxrNegotiationCheckbox = false; // remove from ui
            if (this.rtcpxrReportingOfGetQosCollectionStatus === 1) {
              this.configurationFormGroup.get('rtcpxrReporting')?.setValue(true, {emitEvent: false});
              // already blocks table has value from getQosCollectionStatus
            } else {
              this.configurationFormGroup.get('rtcpxrReporting')?.setValue(false, {emitEvent: false});
              this.setBlocksTableDataToZero();
            }
            this.configurationFormGroup.updateValueAndValidity();
          }
        } else {
          this.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false, {emitEvent: false});
          this.configurationFormGroup.get('disableRtcpxrNegotiation')?.disable(); // disabled
          this.isDisplayDisableRtcpxrNegotiationCheckbox = false; // remove from ui
          if (this.rtcpxrReportingOfGetQosCollectionStatus === 1) {
            this.configurationFormGroup.get('rtcpxrReporting')?.setValue(true, {emitEvent: false});
            // already blocks table has value from getQosCollectionStatus
          } else {
            this.configurationFormGroup.get('rtcpxrReporting')?.setValue(false, {emitEvent: false});
            this.setBlocksTableDataToZero();
          }
          this.configurationFormGroup.updateValueAndValidity();
        }
      } else {
        this.configurationFormGroup.get('rtcpxrReporting')?.setValue(false, {emitEvent: false});
        this.configurationFormGroup.get('rtcpxrReporting')?.disable(); // disabled
        this.setBlocksTableDataToZero();
        this.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false, {emitEvent: false});
        this.isDisplayDisableRtcpxrNegotiationCheckbox = false; // remove from ui
        this.configurationFormGroup.updateValueAndValidity();
      }
    } else if( this.enhRepStatus === 'UNSUPPORTED') {
      this.isAssociateBtnEnable = true;
      this.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false, {emitEvent: false});
      this.isDisplayDisableRtcpxrNegotiationCheckbox = false;  // DisableRtcpxrNegotiation checkbox removed from ui
      if(this.configurationFormGroup.get('qosReporting')?.value) {
        this.configurationFormGroup.get('qosReporting')?.setValue(true, {emitEvent: false});
        this.disableEnhRep();
      } else {
        this.configurationFormGroup.get('qosReporting')?.setValue(false, {emitEvent: false});
        this.disableEnhRep();
      }
      this.configurationFormGroup.updateValueAndValidity();
    } else if( this.enhRepStatus === 'UNKNOWN') {
      this.isAssociateBtnEnable = false;
      this.configurationFormGroup.get('qosReporting')?.setValue(this.transformedData.qosReporting, {emitEvent: false});
      this.configurationFormGroup.get('currentBaseMetrics')?.setValue(this.transformedData.currentBaseMetrics, {emitEvent: false});
      this.configurationFormGroup.get('rtpBaseRemoteMetrics')?.setValue(this.transformedData.rtpBaseRemoteMetrics, {emitEvent: false});
      this.configurationFormGroup.get('extraBaseMetrics')?.setValue(this.transformedData.extraBaseMetrics, {emitEvent: false});
      this.configurationFormGroup.get('codecMetrics')?.setValue(this.transformedData.codecMetrics, {emitEvent: false});
      this.configurationFormGroup.updateValueAndValidity();

      if(this.isSmallLineGWC) {
        this.isDisplayDisableRtcpxrNegotiationCheckbox = true; // set to ui
        // this.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false);
        if( this.rtcpxrReportingOfGetQosCollectionStatus === 0  ) {
          this.configurationFormGroup.get('rtcpxrReporting')?.setValue(false, {emitEvent: false});
          this.setBlocksTableDataToZero();
          this.configurationFormGroup.get('rtcpxrReporting')?.disable(); // disabled
          this.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(true, {emitEvent: false});
          this.configurationFormGroup.get('disableRtcpxrNegotiation')?.enable(); // enabled
          this.configurationFormGroup.updateValueAndValidity();
        } else if( this.rtcpxrReportingOfGetQosCollectionStatus === 1  ) {
          this.configurationFormGroup.get('rtcpxrReporting')?.setValue(true, {emitEvent: false});
          this.configurationFormGroup.get('rtcpxrReporting')?.enable(); // enabled
          this.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false, {emitEvent: false});
          this.configurationFormGroup.get('disableRtcpxrNegotiation')?.disable(); // disabled
          this.configurationFormGroup.updateValueAndValidity();
        } else if( this.rtcpxrReportingOfGetQosCollectionStatus === 2  ) {
          this.configurationFormGroup.get('rtcpxrReporting')?.setValue(false, {emitEvent: false});
          this.setBlocksTableDataToZero();
          this.configurationFormGroup.get('rtcpxrReporting')?.enable(); // enabled
          this.configurationFormGroup.get('disableRtcpxrNegotiation')?.setValue(false, {emitEvent: false});
          this.configurationFormGroup.get('disableRtcpxrNegotiation')?.enable(); // enabled
          this.configurationFormGroup.updateValueAndValidity();
        }
        this.configurationFormGroup.updateValueAndValidity();
      } else {
        this.isDisplayDisableRtcpxrNegotiationCheckbox = false; // remove from ui
        if( this.rtcpxrReportingOfGetQosCollectionStatus === 0 ) {
          this.configurationFormGroup.get('rtcpxrReporting')?.setValue(false, {emitEvent: false});
          this.setBlocksTableDataToZero();
          this.configurationFormGroup.updateValueAndValidity();
        } else if( this.rtcpxrReportingOfGetQosCollectionStatus === 1 ) {
          this.configurationFormGroup.get('rtcpxrReporting')?.setValue(true, {emitEvent: false});
          this.configurationFormGroup.updateValueAndValidity();
        }
        this.configurationFormGroup.updateValueAndValidity();
      }
      this.configurationFormGroup.get('qosReporting')?.disable(); // disabled
      this.configurationFormGroup.get('currentBaseMetrics')?.disable(); // disabled
      this.configurationFormGroup.get('rtpBaseRemoteMetrics')?.disable(); // disabled
      this.configurationFormGroup.get('extraBaseMetrics')?.disable(); // disabled
      this.configurationFormGroup.get('codecMetrics')?.disable(); // disabled
      this.configurationFormGroup.get('rtcpxrReporting')?.disable(); // disabled
      if(this.isSmallLineGWC) {
        this.configurationFormGroup.get('disableRtcpxrNegotiation')?.disable(); // disabled
      }
      // table blocks shown with rtcpxrReporting
    }

    this.setQoSColPendingAndSetDisableOfDisassociationBtn(this.qosCollectorsDataCount);
  }

  setBlocksTableDataToZero(){
    this.configurationFormGroup.get('localVoiceQualityMonitorMetric')?.setValue(false, {emitEvent: false});
    this.configurationFormGroup.get('remoteVoiceQualityMonitorMetric')?.setValue(false, {emitEvent: false});
    this.configurationFormGroup.get('localVoiceQualityDebugMetric')?.setValue(false, {emitEvent: false});
    this.configurationFormGroup.get('remoteVoiceQualityDebugMetric')?.setValue(false, {emitEvent: false});
    this.configurationFormGroup.get('localLossDebugMetric')?.setValue(false, {emitEvent: false});
    this.configurationFormGroup.get('remoteLossDebugMetric')?.setValue(false, {emitEvent: false});
    this.configurationFormGroup.get('localUnitStimSpecificMetric')?.setValue(false, {emitEvent: false});
    this.configurationFormGroup.get('localJitterDebugMetric')?.setValue(false, {emitEvent: false});
    this.configurationFormGroup.get('remoteJitterDebugMetric')?.setValue(false, {emitEvent: false});
  }

  setQoSColPendingAndSetDisableOfDisassociationBtn(resCount: number) {
    if (resCount > 0) {
      (this.enhRepStatus === 'UNKNOWN') ? (this.isDisassociateBtnEnable = false) : (this.isDisassociateBtnEnable = true);
      this.isQoSColPendingDisplay = false;
    } else if (resCount === 0) {
      if(this.configurationFormGroup.get('qosReporting')?.value) {
        this.isQoSColPendingDisplay = true;
      } else {
        this.isQoSColPendingDisplay = false;
      }
      this.isDisassociateBtnEnable = false;
    }
  }

  disableEnhRep(){
    // this.isQosReportingDisabled = false; // enabled
    // this.isCurrentBaseMetricsDisabled = true; // disabled
    this.configurationFormGroup.get('currentBaseMetrics')?.setValue(false);
    this.configurationFormGroup.get('rtpBaseRemoteMetrics')?.disable(); // disabled
    this.configurationFormGroup.get('rtpBaseRemoteMetrics')?.setValue(false);
    this.configurationFormGroup.get('extraBaseMetrics')?.disable(); // disabled
    this.configurationFormGroup.get('extraBaseMetrics')?.setValue(false);
    this.configurationFormGroup.get('codecMetrics')?.disable(); // disabled
    this.configurationFormGroup.get('codecMetrics')?.setValue(false);
    this.configurationFormGroup.get('rtcpxrReporting')?.disable(); // disabled
    this.configurationFormGroup.get('rtcpxrReporting')?.setValue(false);
    this.setBlocksTableDataToZero();
    this.configurationFormGroup.updateValueAndValidity();
  }

  // Associate
  associateBtn() {
    if(this.qosCollectorsDataCount === 2) {
      this.errorTitle = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ASSOCIATE_TITLE;
      this.errorText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.MAX_ASSOCIATION_ERROR;
      this.showErrorPopup = true;
    } else {
      this.getAvailableAssociationList();
    }
  }

  initAssociateForm() {
    this.associateFormGroup = new FormGroup({
      selectedQosCollector: new FormControl<string | null>(null, Validators.required)
    });
  }

  getAvailableAssociationList() {
    this.isLoading = true;
    this.gwcService
      .getAvailableAssociationList(this.gwControllerName)
      .subscribe({
        next: (res: IProvisioningQoSCollectorsRes) => {
          this.isLoading = false;
          if(res.count !== 0){
            const associateAvailableQoSCollectorsData = res.list.map(qosCollector => `${qosCollector.qosName}:${qosCollector.port}`);
            this.isNoFreeAvailableData = false;
            this.dropDownDataItems = associateAvailableQoSCollectorsData.map((item) => ({
              label: item,
              value: item
            }));
          } else {
            const noFreeAssociateAvailableData =
              [this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.NO_FREE_QOS_COL];
            this.isNoFreeAvailableData = true;
            this.dropDownDataItems = noFreeAssociateAvailableData.map((item: string) => ({
              label: item,
              value: item
            }));
          }
          this.showAssociateDialog = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.commonService.showAPIError(error);
        }
      });
  }

  associateFormFooterHandler(event: any) {
    event
      ? this.associateQoSCollector(this.associateFormGroup.value)
      : this.closeAddAndAssociateDialogAndDeleteFormValue();
  }

  associateQoSCollector(selectedData: IProvisioningAssociateDropdownData){
    this.isLoading = true;
    const parsedData = selectedData.selectedQosCollector?.split(':');
    const body = {
      qosName: parsedData[0],
      ipAddress: '',
      port: parsedData[1]
    };
    this.gwcService
      .associateQoSCollector(this.gwControllerName, body)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.closeAddAndAssociateDialogAndDeleteFormValue();
          this.refreshQosCollectorsTable();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorData = error?.error || error;
          const messageAndDetails = JSON.stringify(this.errorData?.message);
          const isErrorGWCException = messageAndDetails?.includes('"message =');
          if(isErrorGWCException) {
            this.errorTitleAddAssociateAndQosStatus =
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.ASSOCIATE_FAILED_TITLE;
            const parsedErrorData = messageAndDetails?.split('details = ');
            const errorMessage = parsedErrorData ?
              parsedErrorData[0]?.split('"message = ')[1]?.replace(this.reg, '<br>')?.replace(this.tabReg, ' &emsp;' ): '';
            this.messageTextAddAssociateAndQosStatusError = `${this.translateResults
              .GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.ASSOCIATE_FAILED_MESSAGE}<br><br>${errorMessage}`;
            this.detailsTextAddAssociateAndQosStatusError =
              parsedErrorData[1]?.split('"')[0]?.replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' );
            this.showAddAssociateAndQosStatus = true;
          } else {
            this.errorTitle = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.DELETE.SYSTEM_ERROR;
            this.errorText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.ERROR_MESSAGE;
            this.showErrorPopup = true;
          }
        }
      });
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
    this.errorTitle = '';
    this.errorText = '';
  }

  // Add New QoS Collectors
  initAddForm() {
    this.addQosCollectorFormGroup = new FormGroup({
      qosName: new FormControl<string | null>(null, Validators.required),
      ipAddress: new FormControl<string | null>(null, [Validators.required,
        Validators.pattern('(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')]),
      port: new FormControl<string | null>(null, [Validators.required,
        Validators.min(20000), Validators.max(20004)])
    });
  }

  addQosCollector(data: IQOSCollectors) {
    this.isLoading = true;
    this.networkConfigurationService.addQoSCollector(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.closeAddAndAssociateDialogAndDeleteFormValue();
      }, error: (error) => {
        this.isLoading = false;
        this.errorTitleAddAssociateAndQosStatus = this.translateResults.COMMON.ACTION_FAILED;
        this.errorData = error?.error || error;
        const messageAndDetails = JSON.stringify(this.errorData?.message);
        const parsedData = messageAndDetails?.split('details = ');
        this.messageTextAddAssociateAndQosStatusError = parsedData[0]?.split('"message = ')[1]?.replace(this.reg, '<br>');
        this.detailsTextAddAssociateAndQosStatusError =
          parsedData[1]?.split('"')[0]?.replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' );
        this.showAddAssociateAndQosStatus = true;
      }
    });
  };

  closeAddAndAssociateDialogAndDeleteFormValue() {
    this.addQosCollectorFormGroup.setValue(
      {
        qosName: null,
        ipAddress: null,
        port: null
      });
    this.associateFormGroup.setValue({
      selectedQosCollector: null
    });
    this.showAddDialog = false;
    this.showAssociateDialog = false;
    this.isNoFreeAvailableData = false;
  }

  closeAddAssociateAndQosStatusErrorDialog() {
    this.showAddAssociateAndQosStatus = false;
    this.showDetailsBtn = true;
    this.errorTitleAddAssociateAndQosStatus = '';
    this.messageTextAddAssociateAndQosStatusError = '';
    this.detailsTextAddAssociateAndQosStatusError = '';
  }

  addNewQoSCollectorBtn() {
    this.showAddDialog = true;
  }

  addQosCollectorFormFooterHandler(event: boolean) {
    if (event) {
      this.addQosCollectorFormGroup.valid ?
        this.addQosCollector(this.addQosCollectorFormGroup.value) :
        this.commonService.showErrorMessage(this.translateResults.COMMON.FORM_NOT_VALID);
    } else {
      this.closeAddAndAssociateDialogAndDeleteFormValue();
    }
  }

  // Disassociate
  disassociate(qosInfo: any) {
    if( this.qosCollectorsDataCount === 1 && this.configurationFormGroup.get('qosReporting')?.value) {
      this.deleteMessage = this.translateResults
        .GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.DELETE.MESSAGE_LAST_QOS_COLLECTOR
        .replace('/{{qosName}}/', qosInfo.qosName)
        .replace('/{{gwcName}}/', this.gwControllerName);
      this.showDeleteConfirmPopup = true;
    } else {
      this.deleteMessage = this.translateResults
        .GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.DELETE.CONFIRM_MESSAGE_DELETE
        .replace('/{{qosName}}/', qosInfo.qosName)
        .replace('/{{gwcName}}/', this.gwControllerName);
      this.showDeleteConfirmPopup = true;
    }
  }

  closeDeleteConfirmPopup() {
    this.showDeleteConfirmPopup = false;
    this.deleteMessage = '';
    this.deleteSelectedData = {
      qosName: '',
      ipAddress: '',
      port: ''
    };
  }

  deleteQoSCollectorFooterHandler(event: any) {
    event ? this.deleteQosCollector() : this.closeDeleteConfirmPopup();
  }

  deleteQosCollector () {
    this.isLoading = true;
    this.gwcService
      .disassociateQoSCollector(this.gwControllerName, this.deleteSelectedData)
      .subscribe({
        next: (res: IProvisioningQoSCollectorsRes) => {
          this.isLoading = false;
          this.refreshQosCollectorsTable();
          this.closeDeleteConfirmPopup();
        },
        error: (error) => {
          this.isLoading = false;
          this.deleteErrorData = error?.error || error;
          const messageAndDetails = JSON.stringify(this.deleteErrorData?.message);
          const isErrorGWCException = messageAndDetails?.includes('"message =');
          if(isErrorGWCException) {
            this.deleteErrorTitle = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.DELETE.GWC_ERROR_EXP_TITLE;
            const parsedData = messageAndDetails?.split('details = ');
            const errorMessage = parsedData ?
              parsedData[0]?.split('"message = ')[1]?.replace(this.reg, '<br>')?.replace(this.tabReg, ' &emsp;' ): '';
            this.deleteMessageText = `${this.translateResults
              .GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.DELETE.GWC_ERROR_EXP_MESSAGE}<br><br>${errorMessage}`;
            this.showDeleteErrorPopup = true;
          } else {
            this.deleteErrorTitle = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.DELETE.SYSTEM_ERROR;
            this.deleteMessageText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.DELETE.ERROR_MESSAGE;
            this.showDeleteErrorPopup = true;
          }
        }
      });
  }

  closeDeleteErrorPopup() {
    this.showDeleteErrorPopup = false;
    this.deleteErrorTitle = '';
    this.deleteMessageText = '';
  }

  // Configuration Panel
  initForm() {
    this.configurationFormGroup = new FormGroup({
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
  }

  // / Apply
  onFooterHandlerConfigurationPanel(event: any) {
    event ? this.openConfirmationPopupForApplyConfgPanel() : this.resetConfigurationPanel();
  }

  resetConfigurationPanel() {
    this.initialDataLoadHandler();
    this.configurationFormGroup.markAsPristine();
  }

  resetConfigurationPanelWithAvailableData() {
    this.configurationFormGroup.setValue( this.transformedData );
    this.checkAssociateBtnEnableAndSetConfigurationCheckbox();
    this.configurationFormGroup.markAsPristine();
  }

  openConfirmationPopupForApplyConfgPanel() {
    if(this.configurationFormGroup.get('qosReporting')?.value) {
      this.confirmPopupTitle =
        this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.APPLY_CONFIRM_QOS_ENABLE_TITLE;
      this.confirmPopupMessage =
        this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.APPLY_CONFIRM_QOS_ENABLE_MESSAGE
          .replace('/{{gwcName}}/', this.gwControllerName);
      this.showConfirmPopupApplyWithQoSCollEnable = true;
    } else if(
      !this.configurationFormGroup.get('qosReporting')?.value &&
      this.configurationFormGroup.get('disableRtcpxrNegotiation')?.value
    ) {
      this.confirmPopupTitle =
        this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.APPLY_CONFIRM_DISABLE_RTCP_XR_TITLE;
      this.confirmPopupMessage =
        this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.APPLY_CONFIRM_DISABLE_RTCP_XR_MESSAGE
          .replace('/{{gwcName}}/', this.gwControllerName);
      this.showConfirmPopupApplyWithQoSCollDisable = true;
    } else if(
      !this.configurationFormGroup.get('qosReporting')?.value &&
      !this.configurationFormGroup.get('disableRtcpxrNegotiation')?.value) {
      if(this.isRtcpxrSupported && this.isJitterDebugSupported && this.isSmallLineGWC) {
        this.confirmPopupTitle =
          this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.APPLY_CONFIRM_DISABLE_RTCP_XR_TITLE;
        this.confirmPopupMessage = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.CONFIRM_POPUP_ALL_TRUE
          .replace('/{{gwcName}}/', this.gwControllerName);
        this.showAddConfirmPopup = true;
      } else {
        this.confirmPopupTitle =
          this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.APPLY_CONFIRM_DISABLE_RTCP_XR_TITLE;
        this.confirmPopupMessage = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.CONFIRM_POPUP_ALL_FALSE
          .replace('/{{gwcName}}/', this.gwControllerName);
        this.showAddConfirmPopup = true;
      }
    }
  }

  addConfirmPopupQoSCollectorFooterHandler(event: any) {
    if (event) {
      this.postQosCollectionStatus();
    } else {
      this.refreshQosCollectorsTable();
      this.closeApplyConfirmPopup();
    }
  }

  closeApplyConfirmPopup() {
    this.showConfirmPopup = false;
    this.showConfirmPopupApplyWithQoSCollEnable = false;
    this.showConfirmPopupApplyWithQoSCollDisable = false;
    this.showAddConfirmPopup = false;
    this.confirmPopupTitle = '';
    this.confirmPopupMessage = '';
    this.resetConfigurationPanelWithAvailableData();
  }

  // qosReporting true
  applyConfirmationPopupQoSCollEnableFooterHandler(event: any) {
    event ? this.applyConfirmationPanel() : this.closeApplyConfirmPopup();
  }

  applyConfirmationPanel() {
    if (this.qosCollectorsDataCount === 0) {
      this.titleText =
        this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIRM_QOS_ENABLE_TITLE;
      this.messageText =
        this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIRM_QOS_ENABLE_MESSAGE;
      this.detailsText =
        this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIRM_QOS_ENABLE_DETAILS;
      this.showErrorDialog = true;
    } else {
      this.isLoading = true;
      this.gwcService
        .getQoSCollector()
        .subscribe({
          next: (res: IProvisioningQoSCollectorsRes) => {
            this.isLoading = false;
            if(res.count === 0) {
              this.titleText =
                this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIGURE_QOS_COLLECTION_TITLE;
              this.messageText =
                this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIGURE_QOS_COLLECTION_MESSAGE;
              this.detailsText =
                this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.CONFIGURE_QOS_COLLECTION_DETAILS;
              this.showErrorDialog = true;
            } else {
              this.postQosCollectionStatus();
              this.closeApplyConfirmPopup();
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.commonService.showAPIError(error);
          }
        });
    }
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  closeShowHideErrorDialogWithOkBtn() {
    this.qosCollectorsDataCount === 0 ? this.resetConfigurationPanelWithAvailableData() : this.postQosCollectionStatus();
    this.closeErrorDialog();
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
    this.showDetailsBtn = true;
    this.titleText = '';
    this.messageText = '';
    this.detailsText = '';
    this.closeApplyConfirmPopup();
  }

  // qosReporting false
  applyConfirmationPopupQoSCollDisableFooterHandler(event: any){
    event ? this.postQosCollectionStatus() : this.confirmationPopupQoSCollectionDisableNoOption();
  }

  confirmationPopupQoSCollectionDisableNoOption() {
    this.refreshQosCollectorsTable();
    this.closeApplyConfirmPopup();
  }

  postQosCollectionStatus() {
    this.isLoading = true;
    let rtcpxrReporting!: number;
    if(this.configurationFormGroup.get('rtcpxrReporting')?.value) {
      rtcpxrReporting = 1;
    } else if(
      !this.configurationFormGroup.get('rtcpxrReporting')?.value &&
      this.isJitterDebugSupported &&
      this.isSmallLineGWC &&
      !this.configurationFormGroup.get('disableRtcpxrNegotiation')?.value) {
      rtcpxrReporting = 2;
    }
    const body = {
      qosReporting: this.configurationFormGroup.get('qosReporting')?.value ? 1 : 0,
      currentBaseMetrics: (this.configurationFormGroup.get('qosReporting')?.value && this.enhRepStatus === 'SUPPORTED') ? 1 : 0,
      rtpBaseRemoteMetrics: this.configurationFormGroup.get('rtpBaseRemoteMetrics')?.value ? 1 : 0,
      extraBaseMetrics: this.configurationFormGroup.get('extraBaseMetrics')?.value ? 1 : 0,
      codecMetrics: this.configurationFormGroup.get('codecMetrics')?.value ? 1 : 0,
      rtcpxrReporting: rtcpxrReporting,
      rtcpxrBlocks: [
        (this.configurationFormGroup.get('localVoiceQualityMonitorMetric')?.value ? '1' : '0'),
        (this.configurationFormGroup.get('remoteVoiceQualityMonitorMetric')?.value ? '1' : '0'),
        (this.configurationFormGroup.get('localVoiceQualityDebugMetric')?.value ? '1' : '0'),
        (this.configurationFormGroup.get('remoteVoiceQualityDebugMetric')?.value ? '1' : '0'),
        (this.configurationFormGroup.get('localLossDebugMetric')?.value ? '1' : '0'),
        (this.configurationFormGroup.get('remoteLossDebugMetric')?.value ? '1' : '0'),
        (this.configurationFormGroup.get('localUnitStimSpecificMetric')?.value ? '1' : '0'),
        (this.configurationFormGroup.get('localJitterDebugMetric')?.value ? '1' : '0'),
        (this.configurationFormGroup.get('remoteJitterDebugMetric')?.value ? '1' : '0')
      ]
    };
    this.gwcService
      .postQosCollectionStatus(this.gwControllerName, body)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.closeApplyConfirmPopup();
          this.refreshQosCollectorsTable();
          this.closeApplyConfirmPopup();
          this.configurationFormGroup.markAsPristine();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorData = error?.error || error;
          const messageAndDetails = JSON.stringify(this.errorData?.message);
          const isErrorGWCException = messageAndDetails?.includes('"message =');
          if(isErrorGWCException) {
            this.titleText =
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.POST_ERROR_TITLE;
            const parsedData = messageAndDetails?.split('details = ');
            const errorMessage = parsedData ?
              parsedData[0]?.split('"message = ')[1]?.replace(this.reg, '<br>')?.replace(this.tabReg, ' &emsp;' ): '';
            this.messageText =
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.POST_ERROR_MESSAGE
                .replace('/{{messageFromResponse}}/', errorMessage);
            this.detailsText = parsedData ?
              parsedData[1]?.split('"')[0]?.replace(this.reg, '<br>')?.replace(this.tabReg, ' &emsp;' ): '';
            this.showPostErrorDialog = true;
          } else {
            this.titleText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.SYSTEM_ERROR;
            this.messageText =
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.QOS_COLLECTORS.ADD.ERROR.POST_SYSTEM_ERROR_MESSAGE;
            this.showPostErrorDialog = true;
          }
        }
      });
  }

  closeShowPostShowHideErrorDialogWithOkBtn() {
    this.closeApplyConfirmPopup();
  }
}
