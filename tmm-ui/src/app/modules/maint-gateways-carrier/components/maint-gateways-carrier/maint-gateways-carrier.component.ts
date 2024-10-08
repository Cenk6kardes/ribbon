import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IPageHeader, IColsPickList } from 'rbn-common-lib';
import { SelectItem } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { MaintGatewaysCarrierService } from '../../services/maint-gateways-carrier.service';
import {
  actionsHaveParamSecurityInfo,
  actionsNeedCallQESByCarrier,
  actionsNeedCallQESByGatewayName,
  CMaintenanceByCarrierOptionsData,
  CMaintenanceByGatewayOptionsData,
  CQueryingShowOptions,
  ECommandKey,
  ICarriers,
  IDataCarrier,
  IDataConfirm,
  IEventPickList,
  IGatewayNames,
  IMaintenance,
  IStatevalues,
  ISummaryData,
  ITypeMaintenance,
  IEmitActionTable,
  IRunType,
  ERunType,
  TableNameStorage,
  ILastRunQueryData
} from '../../models/maint-gateways-carrier';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-maint-gateways-carrier',
  templateUrl: './maint-gateways-carrier.component.html',
  styleUrls: ['./maint-gateways-carrier.component.scss']
})
export class MaintGatewaysCarrierComponent implements OnInit, OnDestroy {
  @ViewChild('pickListCarrier', { read: ElementRef }) pickListCarrierEl: ElementRef;

  showDetailCols = false;
  headerData: IPageHeader;
  translateResults: any;
  data: any[] = [];
  dataCarrierTarget: IDataCarrier[] = [];
  dataCarrierSource: IDataCarrier[] = [];
  colsCarrier: IColsPickList[] = [];
  carriersData: IDataCarrier[] = [];
  pickListLabel = {
    labelSource: '',
    labelTarget: ''
  };
  formGroup: FormGroup;
  // to use in html file
  validators = Validators;
  gatewayNamesOptions: SelectItem[] = [];
  showSummary = false;
  showDetail = false;
  maintenanceOptions: SelectItem[];

  queryingShowOptions: SelectItem[];
  isInprocess = false;
  summaryData: ISummaryData;
  selectAccord = true;
  typeMaintenance: ITypeMaintenance = 'BY_GATEWAYS';
  dataConfirm: IDataConfirm = { title: '', content: '' };
  showConfirmActions = false;
  autoRefreshSubscription: Subscription;
  lastRefreshedTime = {
    value: '',
    format: 'MM/DD/YYYY HH:mm:ss'
  };
  targetConfigPickList = {
    emptyMessageContent: ''
  };

  constructor(
    private translateService: TranslateInternalService,
    private fb: FormBuilder,
    private maiGatewaysCarrierService: MaintGatewaysCarrierService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private preferencesService: PreferencesService,
    private cdr: ChangeDetectorRef
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  get getFormFieldShowDetails() {
    return this.formGroup.controls['ShowDetails'];
  }

  get getFormFieldGatewayName() {
    return this.formGroup.controls['GatewayName'];
  }

  get getFormFieldMaintenanceAction() {
    return this.formGroup.controls['MaintenanceAction'];
  }

  get getFormFieldFilterState() {
    return this.formGroup.controls['FilterState'];
  }

  get getFormFieldEndpointRange() {
    return this.formGroup.controls['EndpointRange'];
  }

  ngOnInit(): void {
    this.removeStorageTable();
    const snapshotData = this.route.snapshot.data;
    if (snapshotData && snapshotData['data']) {
      this.typeMaintenance = snapshotData['data'].typeMaintenance;
      const title = snapshotData['data'].title;
      this.initPageHeader(title);
    }
    this.formGroup = this.fb.group({
      ShowDetails: [false, Validators.required],
      GatewayName: ['', Validators.required],
      MaintenanceAction: ['', Validators.required],
      FilterState: [{ value: '', disabled: false }, Validators.required],
      EndpointRange: ['', [Validators.required, Validators.pattern(/^\d+(-\d*)?(,\d+(-\d*)?)*$/)]]
    });
    this.getFormFieldEndpointRange.setValue('0-');
    this.getGatewayNames();
    this.initMaintenanceOptions();
    this.initQueryingShowOptions();
    this.pickListLabel.labelSource = this.translateResults.MAI_GATE_WAYS_CARRIER.FIELD_LABEL.AVAILABLE_CARRIER_NAMES;
    this.pickListLabel.labelTarget = this.translateResults.MAI_GATE_WAYS_CARRIER.FIELD_LABEL.SELECTED_CARRIER_NAMES;
    this.colsCarrier = [{ field: 'CarrierNames', header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.CARRIER_NAMES }];
    this.targetConfigPickList.emptyMessageContent = `--- ${this.translateResults.MAI_GATE_WAYS_CARRIER.FIELD_LABEL.ALL_CARRIERS} ---`;
    this.initSummaryData();
    this.formGroup.valueChanges.subscribe({
      next: () => {
        this.handleFormActionsQueriesValueChanges();
      }
    });
  }

  initMaintenanceOptions() {
    switch (this.typeMaintenance) {
      case 'BY_CARRIER':
        this.maintenanceOptions = [
          {
            label: CMaintenanceByCarrierOptionsData.QES_BY_CARRIER.label,
            value: CMaintenanceByCarrierOptionsData.QES_BY_CARRIER.value
          },
          {
            label: CMaintenanceByCarrierOptionsData.POST_BY_CARRIER.label,
            value: CMaintenanceByCarrierOptionsData.POST_BY_CARRIER.value
          },
          {
            label: CMaintenanceByCarrierOptionsData.BSY_BY_CARRIER.label,
            value: CMaintenanceByCarrierOptionsData.BSY_BY_CARRIER.value
          },
          {
            label: CMaintenanceByCarrierOptionsData.RTS_BY_CARRIER.label,
            value: CMaintenanceByCarrierOptionsData.RTS_BY_CARRIER.value
          },
          {
            label: CMaintenanceByCarrierOptionsData.FRLS_BY_CARRIER.label,
            value: CMaintenanceByCarrierOptionsData.FRLS_BY_CARRIER.value
          },
          {
            label: CMaintenanceByCarrierOptionsData.INB_BY_CARRIER.label,
            value: CMaintenanceByCarrierOptionsData.INB_BY_CARRIER.value
          }
        ];
        this.getFormFieldMaintenanceAction.setValue(this.maintenanceOptions[0].value);
        break;
      case 'BY_GATEWAYS':
        this.maintenanceOptions = [
          {
            label: CMaintenanceByGatewayOptionsData.QES_BY_GATEWAY_NAME.label,
            value: CMaintenanceByGatewayOptionsData.QES_BY_GATEWAY_NAME.value
          },
          {
            label: CMaintenanceByGatewayOptionsData.POST_BY_GATEWAY_NAME.label,
            value: CMaintenanceByGatewayOptionsData.POST_BY_GATEWAY_NAME.value
          },
          {
            label: CMaintenanceByGatewayOptionsData.BSY_BY_GATEWAY_NAME.label,
            value: CMaintenanceByGatewayOptionsData.BSY_BY_GATEWAY_NAME.value
          },
          {
            label: CMaintenanceByGatewayOptionsData.RTS_BY_GATEWAY_NAME.label,
            value: CMaintenanceByGatewayOptionsData.RTS_BY_GATEWAY_NAME.value
          },
          {
            label: CMaintenanceByGatewayOptionsData.FRLS_BY_GATEWAY_NAME.label,
            value: CMaintenanceByGatewayOptionsData.FRLS_BY_GATEWAY_NAME.value
          },
          {
            label: CMaintenanceByGatewayOptionsData.INB_BY_GATEWAY_NAME.label,
            value: CMaintenanceByGatewayOptionsData.INB_BY_GATEWAY_NAME.value
          }
        ];
        this.getFormFieldMaintenanceAction.setValue(this.maintenanceOptions[0].value);
        break;
      default:
        break;
    }
  }

  initQueryingShowOptions() {
    this.queryingShowOptions = [
      { label: CQueryingShowOptions.ALL_STATES.label, value: CQueryingShowOptions.ALL_STATES.value },
      { label: CQueryingShowOptions.ONLY_CP_DELOAD.label, value: CQueryingShowOptions.ONLY_CP_DELOAD.value },
      { label: CQueryingShowOptions.ONLY_IDLE.label, value: CQueryingShowOptions.ONLY_IDLE.value },
      { label: CQueryingShowOptions.ONLY_MANUAL_BUSY.label, value: CQueryingShowOptions.ONLY_MANUAL_BUSY.value },
      { label: CQueryingShowOptions.ONLY_UNEQUIPPED.label, value: CQueryingShowOptions.ONLY_UNEQUIPPED.value },
      { label: CQueryingShowOptions.ONLY_INSTALLATION_BUSY.label, value: CQueryingShowOptions.ONLY_INSTALLATION_BUSY.value },
      { label: CQueryingShowOptions.ONLY_NETWORK_BUSY.label, value: CQueryingShowOptions.ONLY_NETWORK_BUSY.value },
      { label: CQueryingShowOptions.ONLY_PM_BUSY.label, value: CQueryingShowOptions.ONLY_PM_BUSY.value },
      { label: CQueryingShowOptions.ONLY_REMOTE_BUSY.label, value: CQueryingShowOptions.ONLY_REMOTE_BUSY.value },
      { label: CQueryingShowOptions.ONLY_SYSTEM_BUSY.label, value: CQueryingShowOptions.ONLY_SYSTEM_BUSY.value },
      { label: CQueryingShowOptions.ONLY_CALL_PROCESSING_BUSY.label, value: CQueryingShowOptions.ONLY_CALL_PROCESSING_BUSY.value },
      { label: CQueryingShowOptions.ONLY_CARRIER_FAIL.label, value: CQueryingShowOptions.ONLY_CARRIER_FAIL.value },
      { label: CQueryingShowOptions.ONLY_LOCKOUT.label, value: CQueryingShowOptions.ONLY_LOCKOUT.value },
      { label: CQueryingShowOptions.ONLY_DELOADED.label, value: CQueryingShowOptions.ONLY_DELOADED.value },
      { label: CQueryingShowOptions.ONLY_INITIALIZE.label, value: CQueryingShowOptions.ONLY_INITIALIZE.value },
      { label: CQueryingShowOptions.ONLY_RESTRICTED_IDLE.label, value: CQueryingShowOptions.ONLY_RESTRICTED_IDLE.value },
      { label: CQueryingShowOptions.ONLY_SEIZED.label, value: CQueryingShowOptions.ONLY_SEIZED.value },
      { label: CQueryingShowOptions.ONLY_DCHANNEL_MAN_BUSY.label, value: CQueryingShowOptions.ONLY_DCHANNEL_MAN_BUSY.value },
      { label: CQueryingShowOptions.ONLY_DCHANNEL_FAIL.label, value: CQueryingShowOptions.ONLY_DCHANNEL_FAIL.value }];
    switch (this.typeMaintenance) {
      case 'BY_CARRIER':
        this.queryingShowOptions.push({ label: CQueryingShowOptions.ONLY_UNKNOWN.label, value: CQueryingShowOptions.ONLY_UNKNOWN.value });
        break;
      case 'BY_GATEWAYS':
        this.queryingShowOptions.push(
          { label: CQueryingShowOptions.ONLY_DCHANNEL_SERVICE.label, value: CQueryingShowOptions.ONLY_DCHANNEL_SERVICE.value },
          { label: CQueryingShowOptions.ONLY_DCHANNEL_STANDBY.label, value: CQueryingShowOptions.ONLY_DCHANNEL_STANDBY.value },
          { label: CQueryingShowOptions.ONLY_UNKNOWN.label, value: CQueryingShowOptions.ONLY_UNKNOWN.value }
        );
        break;
      default:
        break;
    }
    this.getFormFieldFilterState.setValue(this.queryingShowOptions[0].value);
  }

  initPageHeader(titlePage: string) {
    this.headerData = {
      title: titlePage
    };
  }

  handleInitCols(action = '') {
    const maintActionSelected = action ? action : this.getFormFieldMaintenanceAction.value;
    const postByGatewayOrCarrier = maintActionSelected === ECommandKey.PostByGatewayName
      || maintActionSelected === ECommandKey.PostByCarrier;
    this.showDetailCols = postByGatewayOrCarrier ? true : false;
  }

  changeCarrierNames(e: IEventPickList): void {
    this.dataCarrierTarget = e.target;
    this.handleFormActionsQueriesValueChanges();
  }

  handleClear() {
    this.formGroup.reset({ ShowDetails: false });
    this.initSummaryData();
    this.showSummary = false;
    this.showDetail = false;
    this.dataCarrierSource = [];
    this.dataCarrierTarget = [];
    this.removeRefresh();
  }

  callActionTable(event: IEmitActionTable) {
    // update value for ShowDetails
    this.getFormFieldShowDetails.setValue(true);
    this.handleRun(ERunType.ACTIONS_TABLE, event.action, event.endpointNumbers);
  }

  handleRun(runType: IRunType = ERunType.QUERIES, action = '', endpointNumbers = '', dataBody?: any[], securityInfo?: string) {
    if (runType !== ERunType.AUTO) {
      this.isInprocess = true;
      this.showDetail = false;
      this.showSummary = false;
    }
    const dataSubmit = dataBody !== undefined ? dataBody : this.getDataSubmit(endpointNumbers);
    let securityInfoParam = '';
    const maintenanceAction = action ? action : this.getFormFieldMaintenanceAction.value;
    if (securityInfo !== undefined) {
      securityInfoParam = securityInfo;
    } else if (actionsHaveParamSecurityInfo.includes(maintenanceAction)) {
      securityInfoParam = `UserID=${this.storageService.userID}`;
    }

    this.maiGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying(
      maintenanceAction,
      dataSubmit,
      securityInfoParam).subscribe({
      next: (rs: IMaintenance) => {
        const nodeNumber = rs[maintenanceAction].Header?.NodeNumber;
        const errObject = rs[maintenanceAction].Error;
        if (errObject) {
          this.commonService.showErrorMessage(errObject.Message);
          if (runType !== ERunType.AUTO) {
            this.isInprocess = false;
          }
          return;
        }
        this.setSummaryData();
        if (actionsNeedCallQESByGatewayName.includes(maintenanceAction)) {
          const tempSubmitValue = this.getTempSubmitValue(dataSubmit, false);
          const tempSecurityInfoParam = `UserID=${this.storageService.userID}`;
          this.maiGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying(
            ECommandKey.QESByGatewayName, tempSubmitValue, tempSecurityInfoParam).subscribe({
            next: (res2) => {
              let lastRunQueryData: ILastRunQueryData;
              const state: IStatevalues[] = res2[ECommandKey.QESByGatewayName].Header?.Summary?.State || [];
              if (state) {
                this.setSummaryData(state,nodeNumber);
              }
              const showDetailsItem = dataSubmit.find(item => item.key === 'ShowDetails');
              if (showDetailsItem.value) {
                this.handleShowDetail(res2, runType, ECommandKey.QESByGatewayName);
              }
              if (runType !== ERunType.AUTO) {
                lastRunQueryData = {
                  command: ECommandKey.QESByGatewayName,
                  dataBody: tempSubmitValue,
                  sSecurityInfo: tempSecurityInfoParam
                };
                this.setAutoRefresh(lastRunQueryData);
              }
            },
            error: (err) => {
              this.commonService.showAPIError(err);
            }
          });
        } else if (actionsNeedCallQESByCarrier.includes(maintenanceAction)) {
          const tempSubmitValue = this.getTempSubmitValue(dataSubmit, true);
          const tempSecurityInfoParam = `UserID=${this.storageService.userID}`;
          this.maiGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying(
            ECommandKey.QESByCarrier, tempSubmitValue, tempSecurityInfoParam).subscribe({
            next: (res3) => {
              let lastRunQueryData: ILastRunQueryData;
              const state: IStatevalues[] = res3[ECommandKey.QESByCarrier].Header?.Summary?.State || [];
              if (state) {
                this.setSummaryData(state,nodeNumber);
              }
              const showDetailsItem = dataSubmit.find(item => item.key === 'ShowDetails');
              if (showDetailsItem.value) {
                this.handleShowDetail(res3, runType, ECommandKey.QESByCarrier);
              }
              if (runType !== ERunType.AUTO) {
                lastRunQueryData = {
                  command: ECommandKey.QESByCarrier,
                  dataBody: tempSubmitValue,
                  sSecurityInfo: tempSecurityInfoParam
                };
                this.setAutoRefresh(lastRunQueryData);
              }
            },
            error: (err) => {
              this.commonService.showAPIError(err);
            }
          });
        } else {
          let lastRunQueryData: ILastRunQueryData;
          const state: IStatevalues[] = rs[maintenanceAction].Header?.Summary?.State || [];
          if (state) {
            this.setSummaryData(state,nodeNumber);
          }
          const showDetailsItem = dataSubmit.find(item => item.key === 'ShowDetails');
          if (showDetailsItem.value) {
            this.handleShowDetail(rs, runType, maintenanceAction);
          }
          if (runType !== ERunType.AUTO) {
            lastRunQueryData = {
              command: maintenanceAction,
              dataBody: dataSubmit,
              sSecurityInfo: securityInfoParam
            };
            this.setAutoRefresh(lastRunQueryData);
          }
        }

        if (runType !== ERunType.AUTO) {
          this.isInprocess = false;
        }
        this.showSummary = true;
        this.lastRefreshedTime.value = this.commonService.getCurrentTime(this.lastRefreshedTime.format);
      },
      error: (err) => {
        this.lastRefreshedTime.value = this.commonService.getCurrentTime(this.lastRefreshedTime.format);
        if (runType !== ERunType.AUTO) {
          this.isInprocess = false;
        }
        this.commonService.showAPIError(err);
      }
      // end set data for summary
    });
  }

  getDataSubmit(endpointNumbers = ''): any[] {
    const dataSubmit: any[] = [];
    const carrierGWC = this.getCarrierNamesGWCNameSelected();
    if (carrierGWC.carriers.length > 0) {
      dataSubmit.push(
        { key: 'CarrierNames', value: carrierGWC.carriers.toString() },
        { key: 'GWCName', value: carrierGWC.gwcNames }
      );
    }
    const valueForm = this.formGroup.value;
    let arKeys = Object.keys(valueForm);
    arKeys = arKeys.filter(n => n !== 'MaintenanceAction');
    for (let i = 0; i < arKeys.length; i++) {
      const tempObject = {
        key: arKeys[i],
        value: valueForm[arKeys[i]]
      };
      dataSubmit.push(tempObject);
    }
    const indexEndpointRange = dataSubmit.findIndex(n => n.key === 'EndpointRange');
    if (endpointNumbers && indexEndpointRange > -1) {
      dataSubmit[indexEndpointRange].value = endpointNumbers;
    }
    return dataSubmit;
  }

  getCarrierNamesGWCNameSelected() {
    const gwcNameArr: Array<string> = [];
    const carrierNamesArr: any[] = [];
    let dataCarrier: IDataCarrier[] = [];
    dataCarrier = this.dataCarrierTarget.length > 0 ? this.dataCarrierTarget : this.dataCarrierSource;
    for (let i = 0; i < dataCarrier.length; i++) {
      carrierNamesArr.push(dataCarrier[i].CarrierNames);
      gwcNameArr.push(dataCarrier[i].GWCName);
    }
    const result = {
      carriers: [] as Array<string>,
      gwcNames: ''
    };
    if (carrierNamesArr.length > 0) {
      result.carriers = carrierNamesArr;
      result.gwcNames = gwcNameArr[0];
    }
    return result;
  }

  handleShowDetail(res: IMaintenance, runType: IRunType = ERunType.QUERIES, actionKey?: string): void {
    if (runType === ERunType.ACTIONS_TABLE) {
      this.handleRun(ERunType.TABLE);
      return;
    }
    const action = actionKey ? actionKey : this.getFormFieldMaintenanceAction.value;
    let valueDetail = res[action].Members?.Member || [];
    const valueTable = [];
    if (!Array.isArray(valueDetail)) {
      valueDetail = [valueDetail];
    }
    for (const val of valueDetail) {
      if (Object.keys(val)[0] === 'Error') {
        if (val.TerminalNumber) {
          valueTable.push({ State: val.Error?.Message, TerminalNumber: val.TerminalNumber });
        } else if (runType !== ERunType.AUTO && val.Error?.Message) {
          this.commonService.showErrorMessage(val.Error.Message);
        }
      } else {
        if (val.hasOwnProperty('TrunkSignaling')) {
          val.TrunkSignalingPreHtml = `<pre>${val.TrunkSignaling?.trim()}</pre>`;
        }
        valueTable.push(val);
      }
    }
    this.handleInitCols(actionKey);
    this.data = valueTable;
    this.showDetail = true;
    this.cdr.detectChanges();
    if (runType === ERunType.QUERIES) {
      this.selectAccord = !this.selectAccord;
    }
  }

  getTempSubmitValue(dataSubmit: any[], actionNeedCallQESByCarrier: boolean): any[] {
    const tempSubmitValue = [
      { key: 'GatewayName', value: dataSubmit.find(n => n.key === 'GatewayName')?.value },
      { key: 'EndpointRange', value: dataSubmit.find(n => n.key === 'EndpointRange')?.value },
      { key: 'ShowDetails', value: dataSubmit.find(n => n.key === 'ShowDetails')?.value },
      { key: 'FilterState', value: this.queryingShowOptions[0].value }
    ];
    if (actionNeedCallQESByCarrier) {
      tempSubmitValue.push(
        { key: 'GWCName', value: dataSubmit.find(n => n.key === 'GWCName')?.value },
        { key: 'CarrierNames', value: dataSubmit.find(n => n.key === 'CarrierNames')?.value }
      );
    }
    return tempSubmitValue;
  }

  onFormSubmit(event: boolean) {
    if (event) {
      this.checkValidation();
    } else {
      this.handleClear();
    }
  }

  checkValidation() {
    if (this.formGroup.invalid) {
      if (this.getFormFieldGatewayName.hasError('required')) {
        this.commonService.showErrorMessage(this.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.GATEWAYNAME_REQUIRED);
      } else if (this.getFormFieldMaintenanceAction.hasError('required')) {
        this.commonService.showErrorMessage(this.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.MAINTENANCEACTION_REQUIRED);
      } else if (this.getFormFieldEndpointRange.invalid) {
        this.commonService.showErrorMessage(this.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.ENDPOINTRANGE_REQUIRED);
      } else if (this.getFormFieldFilterState.hasError('required')) {
        this.commonService.showErrorMessage(this.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.FILTERSTATE_REQUIRED);
      } else if (this.getFormFieldShowDetails.hasError('required')) {
        this.commonService.showErrorMessage(this.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.SHOWDETAILS_REQUIRED);
      } else {
        this.commonService.showErrorMessage(this.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.INPUT_INVALID);
      }
      return;
    }
    const preferences = sessionStorage.getItem('tmm_preferences');
    if (preferences) {
      const preferencesParse = JSON.parse(preferences);
      if (preferencesParse.confirmation.checked) {
        this.showConfirmActions = true;
        this.dataConfirm.title = this.translateResults.MAI_GATE_WAYS_CARRIER.CONFIRMATION_ACTIONS.TITLE;
        const actionCurrent = this.getLabelForm(this.maintenanceOptions, this.getFormFieldMaintenanceAction.value);
        const endpointRangeValue = this.getFormFieldEndpointRange.value;
        if (endpointRangeValue === '0-') {
          this.dataConfirm.content = this.translateResults.MAI_GATE_WAYS_CARRIER.CONFIRMATION_ACTIONS.CONTENT_ALL_TRUNK
            .replace('{{action}}', actionCurrent);
        } else {
          this.dataConfirm.content = this.translateResults.MAI_GATE_WAYS_CARRIER.CONFIRMATION_ACTIONS.CONTENT
            .replace('{{action}}', actionCurrent).replace('{{range}}', this.getFormFieldEndpointRange.value);
        }
        return;
      }
    }
    this.handleRun();
  }

  handleConfirmAction(e: boolean) {
    if (e) {
      this.handleRun();
      this.showConfirmActions = false;
    } else {
      this.showConfirmActions = false;
    }
  }

  getTotalEndpoint(stateValue: IStatevalues[]) {
    let result = 0;
    for (let i = 0; i < stateValue.length; i++) {
      const item = stateValue[i];
      result += item.Count;
    }
    return result;
  }

  getGatewayNames() {
    const key = ECommandKey.GetGatewayNames;
    this.isInprocess = true;
    this.maiGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying(key).subscribe({
      next: (rs: IGatewayNames) => {
        this.isInprocess = false;
        if (rs[key] && rs[key].Gateway && rs[key].Gateway.Names) {
          const names = rs[key].Gateway.Names;
          const namesObject = names.split(',').map((item: string) => ({ label: item, value: item }));
          this.gatewayNamesOptions = namesObject;
          if (this.gatewayNamesOptions.length > 0) {
            this.getFormFieldGatewayName.setValue(this.gatewayNamesOptions[0].value);
          }
          if (this.typeMaintenance === 'BY_CARRIER') {
            this.getCarrierNames();
          }
        }
      },
      error: (err) => {
        this.isInprocess = false;
        this.commonService.showAPIError(err);
      }
    });
  }

  getCarrierNames() {
    const key = ECommandKey.GetCarriers;
    this.isInprocess = true;
    this.maiGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying(key).subscribe({
      next: (rs: ICarriers) => {
        this.isInprocess = false;
        if (rs[key] && rs[key].Carriers) {
          let carriers: IDataCarrier[] = rs[key].Carriers;
          if (carriers && !Array.isArray(carriers)) {
            carriers = [carriers];
          }
          this.carriersData = carriers;
          carriers = carriers.filter(n => n.GatewayName === this.getFormFieldGatewayName.value);
          this.setDataCarrierSource(carriers);
        }
      },
      error: (err) => {
        this.isInprocess = false;
        this.commonService.showAPIError(err);
      }
    });
  }

  initSummaryData() {
    this.summaryData = {
      query: {
        gatewayName: { label: this.translateResults.MAI_GATE_WAYS_CARRIER.FIELD_LABEL.GATEWAY_NAME, value: '' },
        maintenanceAction: { label: this.translateResults.MAI_GATE_WAYS_CARRIER.FIELD_LABEL.MAINTENANCE_ACTION, value: '' },
        endpointRange: { label: this.translateResults.MAI_GATE_WAYS_CARRIER.FIELD_LABEL.ENDPOINT_RANGE, value: '' },
        filterState: { label: this.translateResults.MAI_GATE_WAYS_CARRIER.FIELD_LABEL.WHEN_QUERYING_SHOW, value: '' },
        carriers: { label: this.translateResults.MAI_GATE_WAYS_CARRIER.FIELD_LABEL.CARRIERS, value: '' },
        nodeNumber: { label: this.translateResults.MAI_GATE_WAYS_CARRIER.FIELD_LABEL.NODE_NUMBER, value: '' }
      },
      state: {
        totalEndpoint: { label: this.translateResults.MAI_GATE_WAYS_CARRIER.FIELD_LABEL.TOTAL_ENDPOINT, value: '' },
        values: []
      }
    };
  }

  setSummaryData(state?: IStatevalues[], nodeNumber?: any): void {
    if (!state) {
      const valueForm = { ...this.formGroup.value };
      this.summaryData.query.gatewayName.value = this.getLabelForm(this.gatewayNamesOptions, valueForm.GatewayName);
      this.summaryData.query.maintenanceAction.value = this.getLabelForm(this.maintenanceOptions, valueForm.MaintenanceAction);
      this.summaryData.query.endpointRange.value = valueForm.EndpointRange;
      this.summaryData.query.filterState.value = this.getLabelForm(this.queryingShowOptions, valueForm.FilterState);
      const carrierGWC = this.getCarrierNamesGWCNameSelected();
      this.summaryData.query.carriers.value = carrierGWC.carriers.length;
      this.summaryData.query.carriers.data = carrierGWC.carriers;
    } else {
      if (!Array.isArray(state)) {
        state = [state];
      }
      this.summaryData.query.nodeNumber.value = nodeNumber;
      this.summaryData.state.values = state;
      this.summaryData.state.totalEndpoint.value = this.getTotalEndpoint(state);
    }
  }

  changeGatewayNames() {
    const carriers: IDataCarrier[] = this.carriersData.filter(n => n.GatewayName === this.getFormFieldGatewayName.value);
    this.setDataCarrierSource(carriers);
    this.dataCarrierTarget = [];
  }

  changeMaintenanceAction(command: ECommandKey) {
    if (command === ECommandKey.FRLSByGatewayName || command === ECommandKey.FRLSByCarrier) {
      this.getFormFieldEndpointRange.setValidators([Validators.required, Validators.pattern(/^\d+(,\d+)*$/)]);
    } else {
      this.getFormFieldEndpointRange.setValidators([Validators.required, Validators.pattern(/^\d+(-\d*)?(,\d+(-\d*)?)*$/)]);
    }
    this.getFormFieldEndpointRange.updateValueAndValidity();

    const noStateActions = [
      ECommandKey.BSYByGatewayName, ECommandKey.RTSByGatewayName,
      ECommandKey.FRLSByGatewayName, ECommandKey.INBByGatewayName,
      ECommandKey.BSYByCarrier, ECommandKey.RTSByCarrier,
      ECommandKey.FRLSByCarrier, ECommandKey.INBByCarrier
    ];
    if (noStateActions.includes(command)) {
      if (!this.formGroup.get('FilterState')?.disabled) {
        this.formGroup.get('FilterState')?.disable();
      }
    } else {
      if (this.formGroup.get('FilterState')?.disabled) {
        this.formGroup.get('FilterState')?.enable();
      }
    }
  }

  setDataCarrierSource(carriers: IDataCarrier[]) {
    const result: IDataCarrier[] = [];
    for (let i = 0; i < carriers.length; i++) {
      const item = carriers[i];
      if (item.CarrierNames.indexOf(',') !== -1) {
        const childItemName = item.CarrierNames.split(',');
        for (let j = 0; j < childItemName.length; j++) {
          result.push({ CarrierNames: childItemName[j], GatewayName: item.GatewayName, GWCName: item.GWCName });
        }
      } else {
        result.push({ CarrierNames: item.CarrierNames, GatewayName: item.GatewayName, GWCName: item.GWCName });
      }
    }
    this.dataCarrierSource = result;
  }

  onTabOpen($event: any) {
    this.selectAccord = $event.index === 0 ? true : false;
  }

  getLabelForm(options: SelectItem[], value: string) {
    const item = options.find(n => n.value === value);
    if (item && item.label) {
      return item.label;
    } else {
      return '';
    }
  }

  setAutoRefresh(queryData: ILastRunQueryData) {
    this.removeRefresh();
    this.autoRefreshSubscription = this.preferencesService.autoRefreshEmit.subscribe(() => {
      if ((this.showSummary || this.showDetail) && queryData) {
        this.handleRun(ERunType.AUTO, queryData.command, '',
          queryData.dataBody, queryData.sSecurityInfo);
      }
    });
  }

  removeRefresh() {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.removeStorageTable();
    this.removeRefresh();
  }

  handleFormActionsQueriesValueChanges() {
    this.removeRefresh();
  }

  handleRefreshTable() {
    this.handleRun(ERunType.TABLE);
  }

  removeStorageTable() {
    sessionStorage.removeItem('storage_' + TableNameStorage.carrierTable);
    sessionStorage.removeItem('storage_' + TableNameStorage.carrierTableDetailCols);
    sessionStorage.removeItem('storage_' + TableNameStorage.gatewaysTable);
    sessionStorage.removeItem('storage_' + TableNameStorage.gatewaysTableDetailCols);
  }
}
