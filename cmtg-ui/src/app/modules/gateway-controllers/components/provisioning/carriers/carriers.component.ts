import { SelectItem } from 'primeng/api';
import { ITableConfig, Icols, FilterTypes, ExpandDataMode, ExpandDisplayType, ColumnHidingMode, FieldName } from 'rbn-common-lib';
import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import {
  IProvisioningCarriersData,
  IProvisioningCarriersRes,
  IProvisioningCarriersTableData,
  IProvisioningDeleteCarrierData,
  IProvisioningDisplayCarriersRes,
  IProvisioningDisplayCarriersTableData,
  IProvisioningGWCInfoRes,
  IProvisioningGetNodeNumberRes,
  mapCarrierErrorType} from '../../../models/carriers';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { tableConfigCommon } from 'src/app/types/const';
import { retry, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-carriers',
  templateUrl: './carriers.component.html',
  styleUrls: ['./carriers.component.scss']
})
export class CarriersComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() gwControllerName!: string;

  translateResults: any;
  isLoading = false;

  // Carriers Table
  carriersTableConfig: ITableConfig;
  carriersTableCols: Icols[] = [];
  carriersTableData: IProvisioningCarriersTableData[] = [];

  // Display Carriers Table
  @ViewChild('displayCarrierTable', { static: false }) displayCarrierTable: any;

  tableConfigChildren: ITableConfig;
  colsChildren: Icols[] = [];
  dataChildren: IProvisioningDisplayCarriersTableData[] = [];

  retrieveForm: FormGroup;
  retrivalCriteriaOptions: SelectItem[];
  limitResultOptions: SelectItem[];
  searchCarriersHistory: { label: string; value: string }[] = [];
  gwcIp: string;

  currentGwcName: string;

  // Add Carrier
  showAddCarrier = false;
  addCarrierFormGroup: FormGroup;
  showAddSuccessDialog = false;
  isnumberOfPortsEnable = false;
  isIIDsEnable = false;
  numberReg = /^[0-9]+$/;

  showErrorDialog = false;
  errorTitle = '';
  errorData: {
    errorCode: string,
    message: string
  };
  messageText: string;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showDetailsBtn = true;
  btnLabel = 'Show Details';

  // Delete Carrier
  deleteSelectedData: IProvisioningDeleteCarrierData = {
    gatewayName: '',
    carrierName: ''
  };
  showDeleteConfirmDialog = false;
  showDeleteErrorDialog = false;
  showDeleteSuccessDialog = false;

  deleteErrorTitle = '';
  deleteMessageText: string;

  constructor(
    private fb: FormBuilder,
    private gwcService: GatewayControllersService,
    private commonService: CommonService,
    private translateService: TranslateInternalService
  ) {
    this.translateResults = this.translateService.translateResults;
    this.carriersTableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        selectionMode: 'multiple',
        rowExpandMode: 'multiple',
        dataKey: 'order',
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: true,
        show3DotsButton: true,
        btn3DotsConfig: {
          exportCSVByLib: true
        }
      },
      showCloseTableButton: false,
      isSupportGrouping: true,
      enableSearchGlobal: true,
      expandDataMode: ExpandDataMode.Client,
      expandDisplayType: ExpandDisplayType.Table,
      columnHidingMode: ColumnHidingMode.Simple,
      loading: false,
      isShowContextMenu: false,
      selectedRows: [],
      tableName: 'ProvisioningCarriersTbl',
      enableFilter: true,
      isScrollable: true,
      scrollX: true,
      isResizableColumns: true,
      isUsingAppendTo: false,
      emptyMessageContent: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.COMMON.EMPTY_MSG,
      actionColumnConfig: {
        actions: [
          {
            icon: 'fas fa-trash',
            label: 'Delete',
            tooltip: 'Delete',
            onClick: (data: any, index: any) => {
              if(data.carrierName !== null && data.gatewayName !== null) {
                this.deleteSelectedData = {
                  gatewayName: data.gatewayName,
                  carrierName: data.carrierName
                };
                this.showDeleteConfirmDialog = true;
              }
            }
          }
        ]
      },
      useManualColWidth: true
    };
    this.tableConfigChildren = {
      ...tableConfigCommon,
      showCloseTableButton: false,

      tableOptions: {
        dataKey: '',
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: true,
        hideRefreshButton: true
      },
      selectedRows: [],
      tableName: 'tableChildrenClient',
      isSupportGrouping: false,
      isScrollable: true,
      enableSearchGlobal: false,
      enableFilter: false,
      columnHidingMode: ColumnHidingMode['None'],
      loading: false,
      isShowContextMenu: true,
      isTableChildren: true,
      isUsingAppendTo: false,
      isResizableColumns: true,
      emptyMessageContent: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.COMMON.EMPTY_MSG
    };

    this.retrieveForm = this.fb.group({
      limitResult: ['25', Validators.required],
      retrivalCriteria: ['', Validators.required],
      radioButton: ['replaceList', []]
    });
    this.limitResultOptions = [
      { label: '25', value: '25' },
      { label: '50', value: '50' },
      { label: '100', value: '100' },
      { label: '250', value: '250' },
      { label: '500', value: '500' },
      { label: '1000', value: '1000' },
      { label: 'No Limit', value: '30000' }
    ];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const newConfig = { ...this.carriersTableConfig };
      newConfig.extensibleTemplateTableChildren = this.displayCarrierTable;
      this.carriersTableConfig = newConfig;
    }, 0);
  }

  initForm() {
    this.addCarrierFormGroup = new FormGroup({
      carrierName: new FormControl<string>('', Validators.required),
      gatewayName: new FormControl<string | null>('', Validators.required),
      firstTn: new FormControl<number | null>( null, [Validators.pattern(this.numberReg), Validators.min(0), Validators.max(4094)]),
      voipVPN: new FormControl<boolean>(false),
      h323: new FormControl<boolean>(false),
      priDpnss: new FormControl<boolean>(false),
      noOfPorts: new FormControl<number | null>({ value: null, disabled: true },
        [Validators.pattern(this.numberReg), Validators.min(0), Validators.max(4094)]),
      priInterfaceId: new FormControl<number | null>({ value: null, disabled: true },
        [Validators.pattern(this.numberReg), Validators.min(0), Validators.max(63)]),
      priIUAInterfaceId: new FormControl<number | null>({ value: null, disabled: true },
        [Validators.pattern(this.numberReg), Validators.min(1), Validators.max(2048)])
    });
  }

  ngOnInit(): void {
    this.checkV52Supported();
    const storedHistory = sessionStorage.getItem('searchCarriersHistory');
    if (storedHistory) {
      this.searchCarriersHistory = JSON.parse(storedHistory);
    }
    this.initChildrenCols();

    this.initForm();

    this.addCarrierFormGroup.controls[ 'voipVPN' ].valueChanges.subscribe((checkbox) => {
      if(checkbox) {
        this.addCarrierFormGroup.get('h323')?.setValue(false);
        this.addCarrierFormGroup.get('priDpnss')?.setValue(false);
        this.addCarrierFormGroup.get('h323')?.updateValueAndValidity();
        this.addCarrierFormGroup.get('priDpnss')?.updateValueAndValidity();

        this.addCarrierFormGroup.controls[ 'noOfPorts' ].enable();
        this.isnumberOfPortsEnable = true;
      } else {
        this.addCarrierFormGroup.controls[ 'noOfPorts' ].disable();
        this.addCarrierFormGroup.controls[ 'noOfPorts' ].setValue(null);
        this.isnumberOfPortsEnable = false;
      }
    });
    this.addCarrierFormGroup.controls[ 'h323' ].valueChanges.subscribe((checkbox) => {
      if(checkbox) {
        this.addCarrierFormGroup.get('voipVPN')?.setValue(false);
        this.addCarrierFormGroup.get('priDpnss')?.setValue(false);

        this.addCarrierFormGroup.get('voipVPN')?.updateValueAndValidity();
        this.addCarrierFormGroup.get('priDpnss')?.updateValueAndValidity();

        this.addCarrierFormGroup.controls[ 'noOfPorts' ].enable();
        this.isnumberOfPortsEnable = true;
      } else {
        this.addCarrierFormGroup.controls[ 'noOfPorts' ].disable();
        this.addCarrierFormGroup.controls[ 'noOfPorts' ].setValue(null);
        this.isnumberOfPortsEnable = false;
      }
    });
    this.addCarrierFormGroup.controls[ 'priDpnss' ].valueChanges.subscribe((checkbox) => {
      if(checkbox) {
        this.addCarrierFormGroup.get('voipVPN')?.setValue(false);
        this.addCarrierFormGroup.get('h323')?.setValue(false);
        this.addCarrierFormGroup.get('voipVPN')?.updateValueAndValidity();
        this.addCarrierFormGroup.get('h323')?.updateValueAndValidity();

        this.addCarrierFormGroup.controls[ 'priInterfaceId' ].enable();
        this.addCarrierFormGroup.controls[ 'priIUAInterfaceId' ].enable();
        this.isIIDsEnable = true;
      } else {
        this.addCarrierFormGroup.controls[ 'priInterfaceId' ].disable();
        this.addCarrierFormGroup.controls[ 'priInterfaceId' ].setValue(null);
        this.addCarrierFormGroup.controls[ 'priIUAInterfaceId' ].disable();
        this.addCarrierFormGroup.controls[ 'priIUAInterfaceId' ].setValue(null);
        this.isIIDsEnable = false;
      }
    });

    const newConfig = { ...this.carriersTableConfig };
    newConfig.extensibleTemplateTableChildren = this.displayCarrierTable;
    this.carriersTableConfig = newConfig;
  }

  checkV52Supported(){
    this.isLoading = true;
    this.gwcService.checkV52Supported().subscribe(res => {
      this.isLoading = false;
      if(res) {
        // v5.2 support
        this.initV52SupportCols();
      } else {
        // v5.2 unsupport
        this.initV52UnsupportCols();
      }
    }, error => {
      this.isLoading = false;
      this.commonService.showAPIError(error);
    });
  }

  initV52UnsupportCols() {
    this.carriersTableCols = [
      { field: FieldName.Expand, header: '', sort: false, data: [], colsEnable: true, colDisable: false },
      {
        data: [],
        field: 'carrierName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.NAME,
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
        field: 'gatewayName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.GATEWAY,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 112,
        manualMinColWidth: 112
      },
      {
        data: [],
        field: 'gwDefaultDomain',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.GATEWAY_DOMAIN,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 165,
        manualMinColWidth: 165
      },
      {
        data: [],
        field: 'nodeNo',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.NODE_NUMBER,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 143,
        manualMinColWidth: 143
      },
      {
        data: [],
        field: 'firstTn',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.START_TERM,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 116,
        manualMinColWidth: 116
      },
      {
        data: [],
        field: 'noOfPorts',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.NUM_PORTS,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 118,
        manualMinColWidth: 118
      },
      {
        data: [],
        field: 'priInterfaceId',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.NFAS_DPNSS_IID,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 158,
        manualMinColWidth: 158
      },
      {
        data: [],
        field: 'priIUAInterfaceId',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.IUA_IID,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 99,
        manualMinColWidth: 99
      },
      {
        data: [],
        field: FieldName.Action,
        header: this.translateResults.COMMON.ACTION,
        colsEnable: true,
        sort: false,
        autoSetWidth: true
      }
    ];
  }

  initV52SupportCols() {
    this.carriersTableCols = [
      { field: FieldName.Expand, header: '', sort: false, data: [], colsEnable: true, colDisable: false },
      {
        data: [],
        field: 'carrierName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.NAME,
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
        field: 'gatewayName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.GATEWAY,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 112,
        manualMinColWidth: 112
      },
      {
        data: [],
        field: 'gwDefaultDomain',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.GATEWAY_DOMAIN,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 165,
        manualMinColWidth: 165
      },
      {
        data: [],
        field: 'nodeNo',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.NODE_NUMBER,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 143,
        manualMinColWidth: 143
      },
      {
        data: [],
        field: 'firstTn',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.START_TERM,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 116,
        manualMinColWidth: 116
      },
      {
        data: [],
        field: 'noOfPorts',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.NUM_PORTS,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 118,
        manualMinColWidth: 118
      },
      {
        data: [],
        field: 'v52InterfaceId',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.V52_IID,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 108,
        manualMinColWidth: 108
      },
      {
        data: [],
        field: 'v52LinkId',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.V52_LINK_ID,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 134,
        manualMinColWidth: 134
      },
      {
        data: [],
        field: 'v5UALinkId',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.V5_UA_LINK_ID,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 140,
        manualMinColWidth: 140
      },
      {
        data: [],
        field: 'priInterfaceId',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.NFAS_DPNSS_IID,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 158,
        manualMinColWidth: 158
      },
      {
        data: [],
        field: 'priIUAInterfaceId',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.TABLE.COLS.IUA_IID,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 99,
        manualMinColWidth: 99
      },
      {
        data: [],
        field: FieldName.Action,
        header: this.translateResults.COMMON.ACTION,
        colsEnable: true,
        sort: false,
        autoSetWidth: true
      }
    ];
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
      this.carriersTableData = [];
    }
    this.currentGwcName = this.gwControllerName;
    this.checkV52Supported();
  }

  onRetrieveHandle(event: boolean) {
    // reset - false
    // retrieve - true
    const inputValue = this.retrieveForm.get('retrivalCriteria')?.value?.trim();
    if (inputValue !== undefined && (inputValue !== '' && !this.isValueSearchedBefore(inputValue))) {
      const newItem = { label: inputValue, value: inputValue };
      this.searchCarriersHistory.push(newItem);
      // Save searchCarriersHistory to sessionStorage
      sessionStorage.setItem('searchCarriersHistory', JSON.stringify(this.searchCarriersHistory));
    }
    if (event) {
      const searchString = this.retrieveForm.get('retrivalCriteria')?.value;
      const limitResult = this.retrieveForm.get('limitResult')?.value;
      const maxReturnRows =  limitResult < 0 ? '3000' : limitResult;
      if (isNaN(maxReturnRows)|| !maxReturnRows || maxReturnRows >= 2147483647) {
        this.commonService.showErrorMessage(this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.ERROR.NUMERIC);
        return;
      }
      this.isLoading = true;
      this.gwcService.getCarriersDataRetrive(this.gwcIp, searchString, maxReturnRows)
        .pipe(take(1),retry(1),
          tap((res: IProvisioningCarriersRes) => {
            this.isLoading = false;
            const tableDataBackup = this.carriersTableData;
            this.carriersTableData = [];
            const transformedData = res.crData.map(
              (item: IProvisioningCarriersData, index: number) => ({
                gatewayName: item.gatewayName,
                gwHostname: item.gwHostname,
                gwDefaultDomain: item.gwDefaultDomain === 'NOT_SET' ? '' : item.gwDefaultDomain,
                carrierName: item.carrierName,
                nodeNo: item.nodeNo,
                firstTn: item.firstTn,
                noOfPorts: item.noOfPorts,
                v52InterfaceId: item.v52InterfaceId === -99 ? '' : item.v52InterfaceId,
                v52LinkId: item.v52LinkId === -99 ? '' : item.v52LinkId,
                v5UALinkId: item.v5UALinkId === -99 ? '' : item.v5UALinkId,
                priInterfaceId: item.priInterfaceId === -99 ? '' : item.priInterfaceId,
                priIUAInterfaceId: item.priIUAInterfaceId === -99 ? '' : item.priIUAInterfaceId,
                dataExpand: [{}],
                order: index.toString() // unique property requirements for dataKey
              })
            );
            this.carriersTableData = [
              ...(this.retrieveForm.get('radioButton')?.value === 'appendToList' ? tableDataBackup : []),
              ...transformedData
            ];
          })
        )
        .subscribe({
          error: (error) => {
            this.isLoading = false;
            this.errorTitle = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.ERROR.TITLE;
            this.errorData = error?.error || error;
            const messageAndDetails = JSON.stringify(this.errorData?.message);
            const parsedData = messageAndDetails?.split('details = ');
            this.detailsText = parsedData[0]?.split('message = ')[1]?.replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' ) || '';
            this.messageText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.ERROR.MESSAGE;
            this.showErrorDialog = true;
          }
        });
    } else {
      this.setDefaultValues();
    }
  }

  onRetriveAllHandle() {
    this.isLoading = true;
    this.gwcService
      .getCarriersDataRetriveAll(this.gwcIp)
      .pipe(take(1), retry(1))
      .subscribe({
        next: (res: IProvisioningCarriersRes) => {
          this.isLoading = false;
          this.carriersTableData = [];
          this.carriersTableData = res.crData.map(
            (item: IProvisioningCarriersData, index: number) => ({
              gatewayName: item.gatewayName,
              gwHostname: item.gwHostname,
              gwDefaultDomain: item.gwDefaultDomain === 'NOT_SET' ? '' : item.gwDefaultDomain,
              carrierName: item.carrierName,
              nodeNo: item.nodeNo,
              firstTn: item.firstTn,
              noOfPorts: item.noOfPorts,
              v52InterfaceId: item.v52InterfaceId === -99 ? '' : item.v52InterfaceId,
              v52LinkId: item.v52LinkId === -99 ? '' : item.v52LinkId,
              v5UALinkId: item.v5UALinkId === -99 ? '' : item.v5UALinkId,
              priInterfaceId: item.priInterfaceId === -99 ? '' : item.priInterfaceId,
              priIUAInterfaceId: item.priIUAInterfaceId === -99 ? '' : item.priIUAInterfaceId,
              dataExpand: [{}],
              order: index.toString() // unique property requirements for dataKey
            })
          );
        },
        error: (error) => {
          this.isLoading = false;
          this.commonService.showAPIError(error);
        }
      });
    this.setDefaultValues();
  }

  setDefaultValues() {
    this.retrieveForm = this.fb.group({
      limitResult: ['25'],
      retrivalCriteria: [],
      radioButton: ['replaceList', []]
    });
  }

  isValueSearchedBefore(value: string): boolean {
    return this.searchCarriersHistory.some((item) => item.value === value);
  }

  refreshCarriersTable() {
    if (this.retrieveForm.controls['retrivalCriteria'].value) {
      this.onRetrieveHandle(true);
    } else {
      this.onRetriveAllHandle();
    }
  }

  // Display Table
  fetchChildItem(event: any) {
    this.getChildrenTableData(event.rowData.gatewayName, event.rowData.carrierName);
  }

  removeDataColumn(cols: any[]) {
    if (cols && cols.length > 0) {
      cols.forEach(element => {
        if (element.data && element.data.length > 0) {
          element.data = [];
        }
      });
    }
  }

  initChildrenCols() {
    this.colsChildren = [
      {
        data: [],
        field: 'endpointName',
        header: 'Name',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'extTerminalNumber',
        header: 'Terminal Number',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      }
    ];
  }

  getChildrenTableData(gatewayName: string, carrierName: string ) {
    this.isLoading = true;
    this.gwcService
      .getDisplayCarriersData(this.gwcIp, gatewayName, carrierName)
      .subscribe({
        next: (res: IProvisioningDisplayCarriersRes) => {
          this.isLoading = false;
          this.dataChildren = [];
          this.dataChildren = res.epData.map(
            (item: IProvisioningDisplayCarriersTableData) => ({
              endpointName: item.endpointName,
              extTerminalNumber: item.extTerminalNumber
            })
          );
          this.removeDataColumn(this.colsChildren);
        }, error: (error) => {
          this.isLoading = false;
          this.commonService.showAPIError(error);
        }
      });
  }

  // Add Carrier
  addNewCarrierBtn(){
    this.showAddCarrier = true;
  }

  getNodeNumber() {
    this.isLoading = true;
    this.gwcService
      .getNodeNumber(this.gwControllerName)
      .subscribe({
        next: (res: IProvisioningGetNodeNumberRes) => {
          this.isLoading = false;
          const gwcNodeNumber = res.nodeList[0]?.serviceConfiguration?.gwcNodeNumber;
          this.addCarrier(gwcNodeNumber);
        },
        error: (error) => {
          this.isLoading = false;
          this.commonService.showAPIError(error);
        }
      });
  }

  addCarrier(gwcNodeNumber: number){
    this.isLoading = true;
    const body = {
      gatewayName: this.addCarrierFormGroup.get('gatewayName')?.value,
      gwHostname: 'NOT_SET',
      gwDefaultDomain: 'NOT_SET',
      carrierName: this.addCarrierFormGroup.get('carrierName')?.value,
      nodeNo: gwcNodeNumber,
      firstTn: this.addCarrierFormGroup.get('firstTn')?.value || -99,
      noOfPorts: this.addCarrierFormGroup.get('noOfPorts')?.value || -99,
      v52InterfaceId: -99,
      v52LinkId: -99,
      v5UALinkId: -99,
      priInterfaceId: this.addCarrierFormGroup.get('priInterfaceId')?.value || -99,
      priIUAInterfaceId: this.addCarrierFormGroup.get('priIUAInterfaceId')?.value || -99
    };
    let serviceType = 1;
    if(this.addCarrierFormGroup.get('voipVPN')?.value) {
      serviceType = 9;
    } else if(this.addCarrierFormGroup.get('h323')?.value) {
      serviceType = 5;
    } else if(this.addCarrierFormGroup.get('priDpnss')?.value) {
      serviceType = 2;
    }
    this.gwcService
      .addCarrier(body, this.gwControllerName, serviceType )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.showAddSuccessDialog = true;
          this.closeAddCarrier();
          this.refreshCarriersTable();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorTitle = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.ADD.ERROR_TITLE;
          this.errorData = error?.error || error;
          const messageAndDetails = JSON.stringify(this.errorData?.message);
          const parsedData = messageAndDetails?.split('details = ');
          this.detailsText = parsedData ?
            parsedData[0]?.split('"message = ')[1]?.replace(this.reg, '<br>')?.replace(this.tabReg, ' &emsp;' ): '';
          this.messageText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.ADD.ERROR_MESSAGE
            .replace('${carrierName}', this.addCarrierFormGroup.get('carrierName')?.value)
            .replace('${gatewayName}', this.addCarrierFormGroup.get('gatewayName')?.value);
          this.showErrorDialog = true;
        }
      });
  }

  getFormInput(formName: string){
    return this.addCarrierFormGroup.get(formName);
  }

  closeAddCarrier() {
    this.showAddCarrier = false;
    this.addCarrierFormGroup.setValue({
      carrierName: '',
      gatewayName: '',
      firstTn: null,
      voipVPN: false,
      h323: false,
      priDpnss: false,
      noOfPorts: null,
      priInterfaceId: null,
      priIUAInterfaceId: null
    });
  }

  addCarrierFormFooterHandler(event: any) {
    if (event) {
      this.getNodeNumber();
    } else {
      this.closeAddCarrier();
    }
  }

  closeAddSuccessDialog(){
    this.showAddSuccessDialog = false;
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
    this.showDetailsBtn = true;
    this.errorTitle = '';
    this.messageText = '';
    this.detailsText = '';
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  // Delete Carrier
  deleteCarrier() {
    this.isLoading = true;
    this.gwcService
      .deleteCarrier( this.deleteSelectedData.gatewayName, this.deleteSelectedData.carrierName )
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if(res === 0) {
            this.showDeleteSuccessDialog = true;
            this.closeDeleteConfirmDialog();
            this.refreshCarriersTable();
          } else if(res >= 1 && res <= 9) {
            this.deleteErrorTitle = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_TITLE;
            if (mapCarrierErrorType[res]) {
              this.deleteMessageText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_MESSAGE
                .replace('/{{carrierName}}/', `${this.deleteSelectedData.carrierName}`)
                .replace('/{{gatewayName}}/', `${this.deleteSelectedData.gatewayName}`)
                .replace('/{{errorMessage}}/', `${mapCarrierErrorType[res]}`);
            } else {
              this.deleteMessageText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_MESSAGE
                .replace('/{{carrierName}}/', `${this.deleteSelectedData.carrierName}`)
                .replace('/{{gatewayName}}/', `${this.deleteSelectedData.gatewayName}`)
                .replace(', /{{errorMessage}}/', '');
            }
            this.showDeleteErrorDialog = true;
          } else {
            this.deleteErrorTitle = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_TITLE;
            this.deleteMessageText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.DEFAULT_ERROR_MESSAGE
              .replace('/{{returnCode}}/', `${res}`);
            this.showDeleteErrorDialog = true;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorTitle = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_TITLE;
          this.errorData = error?.error || error;
          const messageAndDetails = JSON.stringify(this.errorData?.message);
          const parsedData = messageAndDetails?.split('details = ');
          this.detailsText = parsedData ?
            parsedData[0]?.split('"message = ')[1]?.replace(this.reg, '<br>')?.replace(this.tabReg, ' &emsp;' ) : '';
          this.messageText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_MESSAGE_500
            .replace('${carrierName}', `"${this.deleteSelectedData.carrierName}"`)
            .replace('${gatewayName}', `"${this.deleteSelectedData.gatewayName}"`);
          this.showErrorDialog = true;
        }
      });
  }

  closeDeleteErrorDialog() {
    this.showDeleteErrorDialog = false;
    this.deleteErrorTitle = '';
    this.deleteMessageText = '';
    this.closeDeleteConfirmDialog();
  }

  closeDeleteConfirmDialog() {
    this.showDeleteConfirmDialog = false;
    this.deleteSelectedData = {
      gatewayName: '',
      carrierName: ''
    };
  }

  deleteDialogFooterHandler($event: any) {
    $event ? this.deleteCarrier() : this.closeDeleteConfirmDialog();
  }

  closeDeleteSuccessDialog() {
    this.showDeleteSuccessDialog = false;
  }
}
