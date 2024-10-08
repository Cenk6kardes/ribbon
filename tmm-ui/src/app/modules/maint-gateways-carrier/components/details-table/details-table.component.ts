import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges,
  OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { PaginatorMode, ITableConfig, IActionColumn, FilterTypes, FieldName, Icols, ConfirmDialogComponent } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CMaintenanceByCarrierOptionsData,
  CMaintenanceByGatewayOptionsData, IEmitActionTable, ITypeMaintenance, TableNameStorage } from '../../models/maint-gateways-carrier';
import { TableComponent } from 'rbn-common-lib';
import { IDataConfirm } from '../../models/maint-gateways-carrier';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-details-table',
  templateUrl: './details-table.component.html',
  styleUrls: ['./details-table.component.scss']
})
export class DetailsTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: any[] = [];
  @Input() showDetailCols: boolean;
  @Input() bulkActionOptions: SelectItem[];

  @Output() callActionTable = new EventEmitter<IEmitActionTable>();
  @Output() refreshTable = new EventEmitter();
  @ViewChild('bulkAction', { static: false }) elBulkActions: any;
  @ViewChild('detailTableTemplate', { static: false }) detailTableTemplate: TableComponent;
  @ViewChild('confirmGatewaysCarrier') confirmGatewaysCarrier: ConfirmDialogComponent;

  selectedRows: any[] = [];
  cols: Icols[] = [];
  translateResults: any;
  bulkActions: SelectItem[] = [];
  selectedAction: any;
  detailsMsgData = {
    content: '',
    isClosable: true,
    showPanelMessages: true
  };

  tableConfig: ITableConfig = {
    tableOptions: {
      dataKey: 'TerminalNumber',
      hideTableButtons: false,
      usingTriStateCheckbox: false,
      hideColumnInLib: true,
      show3DotsButton: true,
      btn3DotsConfig: {
        exportCSVByLib: true
      }
    },
    tableName: '',
    showCloseTableButton: false,
    paginatorMode: PaginatorMode.Client,
    numberRowPerPage: 5,
    rowsPerPageOptions: [5, 10, 15],
    isReorderColsByStorage: true
  };

  dataConfirm: IDataConfirm = { title: '', content: '' };
  showConfirmActions = false;

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateInternalService,
    private cdr: ChangeDetectorRef
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    const snapshotData = this.route.snapshot.data;
    let typeMaintenance;
    if (snapshotData && snapshotData['data']) {
      typeMaintenance = snapshotData['data'].typeMaintenance;
      if (typeMaintenance === 'BY_CARRIER') {
        let nameTemp = TableNameStorage.carrierTable;
        if(this.showDetailCols) {
          nameTemp = TableNameStorage.carrierTableDetailCols;
        }
        this.tableConfig.tableName = nameTemp;
      }
      if(typeMaintenance === 'BY_GATEWAYS') {
        let nameTemp = TableNameStorage.gatewaysTable;
        if(this.showDetailCols) {
          nameTemp = TableNameStorage.gatewaysTableDetailCols;
        }
        this.tableConfig.tableName = nameTemp;
      }
    }
    this.detailsMsgData.showPanelMessages = true;
    this.detailsMsgData.content = this.translateResults.MAI_GATE_WAYS_CARRIER.DETAILS_MESSAGE;
    this.initActionColumn(typeMaintenance);
    this.initBulkActions(typeMaintenance);
  }

  ngAfterViewInit(): void {
    this.detailTableTemplate.loadDataStorageToTable();
    this.detailTableTemplate.resetFilter();
    this.cdr.detectChanges();
    const newConfig = { ...this.tableConfig };
    newConfig.extensibleHeaderTemplate = this.elBulkActions;
    this.tableConfig = newConfig;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['showDetailCols']) {
      const showDetailCols = changes['showDetailCols'].currentValue;
      if (showDetailCols) {
        this.initDetailCols();
      } else {
        this.initCols();
      }
    }
  }

  initCols() {
    this.cols = [
      {
        field: FieldName.Checkbox,
        header: '',
        sort: false,
        data: [],
        colsEnable: true,
        colWidth: 35
      },
      {
        field: 'TerminalNumber',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.ENDPOINT_NUMBER,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 175,
        type: FilterTypes.InputText
      },
      {
        field: 'State',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.STATE,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 150,
        type: FilterTypes.InputText
      },
      {
        field: FieldName.Action,
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.ACTIONS,
        sort: false,
        colWidth: 70,
        colsEnable: true
      }
    ];
  }

  initDetailCols() {
    this.cols = [
      {
        field: FieldName.Checkbox,
        header: '',
        sort: false,
        data: [],
        colsEnable: true,
        colWidth: 50
      },
      {
        field: 'TerminalNumber',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.ENDPOINT_NUMBER,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 100,
        type: FilterTypes.InputText
      },
      {
        field: 'State',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.STATE,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 200,
        type: FilterTypes.InputText
      },
      {
        field: 'ConnectedTo',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.CONNECTED_TO,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 100,
        type: FilterTypes.InputText
      },
      {
        field: 'TrunkDirection',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.DIRECTION,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 100,
        type: FilterTypes.InputText
      },
      {
        field: 'TrunkSignaling',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.SIGNALING,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 100,
        type: FilterTypes.InputText
      },
      {
        field: 'PMType',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.PM_TYPE,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 100,
        type: FilterTypes.InputText
      },
      {
        field: 'PMNumber',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.PM_NUMBER,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 100,
        type: FilterTypes.InputText
      },
      {
        field: 'EndpointName',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.ENDPOIN_NAME,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 200,
        type: FilterTypes.InputText
      },
      {
        field: 'TrunkCLLI',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.TRUNK_CLLI,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 100,
        type: FilterTypes.InputText
      },
      {
        field: 'TrunkMember',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.TRUNK_MEMBER,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 100,
        type: FilterTypes.InputText
      },
      {
        field: 'PMCarrier',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.PM_CARRIER,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 100,
        type: FilterTypes.InputText
      },
      {
        field: 'PMTimeSlot',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.PM_TIME_SLOT,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 100,
        type: FilterTypes.InputText
      },
      {
        field: 'TrunkType',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.TRUNK_TYPE,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 100,
        type: FilterTypes.InputText
      },
      {
        field: FieldName.Action,
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.ACTIONS,
        sort: false,
        colWidth: 70,
        colsEnable: true
      }
    ];
  }

  initBulkActions(typeMaintenance: ITypeMaintenance) {
    if (typeMaintenance === 'BY_CARRIER') {
      const ignoreCMaintenanceByCarrierOptions = [
        CMaintenanceByCarrierOptionsData.QES_BY_CARRIER,
        CMaintenanceByCarrierOptionsData.POST_BY_CARRIER
      ];
      this.bulkActions = this.bulkActionOptions.filter(n => ignoreCMaintenanceByCarrierOptions.findIndex(x => x.value === n.value) === -1);
    } else {
      const ignoreCMaintenanceByGatewayOptions = [
        CMaintenanceByGatewayOptionsData.QES_BY_GATEWAY_NAME,
        CMaintenanceByGatewayOptionsData.POST_BY_GATEWAY_NAME
      ];
      this.bulkActions = this.bulkActionOptions.filter(n => ignoreCMaintenanceByGatewayOptions.findIndex(x => x.value === n.value) === -1);
    }
  }

  initActionColumn(typeMaintenance: ITypeMaintenance) {
    const actions: IActionColumn[] = [];
    let tableActions: any;
    if (typeMaintenance === 'BY_CARRIER') {
      tableActions = {...CMaintenanceByCarrierOptionsData};
      delete tableActions.QES_BY_CARRIER;
      delete tableActions.POST_BY_CARRIER;
    } else {
      tableActions = {...CMaintenanceByGatewayOptionsData};
      delete tableActions.QES_BY_GATEWAY_NAME;
      delete tableActions.POST_BY_GATEWAY_NAME;
    }
    Object.keys(tableActions).forEach(key => {
      const action = tableActions[key];
      actions.push({
        label: action['label'],
        onClick: (row: any) => {
          const emitData: IEmitActionTable = {
            action: action['value'],
            endpointNumbers: row.TerminalNumber
          };
          this.checkShowConfirm(emitData, action['label']);
        }
      });
    });
    this.tableConfig.actionColumnConfig = {
      actions: actions,
      quantityDisplayed: 0
    };
  }

  onCheckboxChange(event: any) {
    if (event) {
      this.selectedRows = event.selectedRows;
    }
  }

  callAction() {
    const endpointNumbers: number[] = [];
    this.selectedRows.forEach(item => {
      endpointNumbers.push(item.TerminalNumber);
    });
    const emitData: IEmitActionTable = {
      action: this.selectedAction.value,
      endpointNumbers: endpointNumbers.join(',')
    };
    this.checkShowConfirm(emitData, this.selectedAction.label);
    this.selectedRows = [];
    this.clearSelectedOption();
  }

  clearSelectedOption() {
    setTimeout(() => {
      this.selectedAction = null;
    }, 100);
  }

  handleClosePanelMessages() {
    this.detailsMsgData.showPanelMessages = false;
  }

  handleRefreshData() {
    this.refreshTable.emit();
  }

  checkShowConfirm(event: IEmitActionTable, content: string) {
    const preferences = sessionStorage.getItem('tmm_preferences');
    if (preferences) {
      const preferencesParse = JSON.parse(preferences);
      if (preferencesParse.confirmation.checked) {
        this.showConfirmActions = true;
        this.dataConfirm.title = this.translateResults.MAI_GATE_WAYS_CARRIER.CONFIRMATION_ACTIONS.TITLE;
        this.dataConfirm.content = this.translateResults.MAI_GATE_WAYS_CARRIER.CONFIRMATION_ACTIONS.CONTENT_ALL_TRUNK
          .replace('{{action}}', content);
        this.confirmGatewaysCarrier.emitConfirm.pipe(take(1)).subscribe(rs => {
          if (rs) {
            this.callActionTable.emit(event);
            this.showConfirmActions = false;
          } else {
            this.showConfirmActions = false;
            this.clearSelectedOption();
          }
        });
      }
    }
  }
}
