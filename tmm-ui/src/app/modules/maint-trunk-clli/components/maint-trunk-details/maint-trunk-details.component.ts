import { Component, Input, OnInit, ViewChild } from '@angular/core';

import {
  PaginatorMode,
  FieldName,
  ITableConfig,
  Icols,
  TableComponent,
  IActionColumn,
  FilterTypes
} from 'rbn-common-lib';
import { MaintTrunkClliService } from '../../services/maint-trunk-clli.service';
import {
  CMaintenanceByTrunkClliOptionsData,
  DChannelBulkActionOptionsData,
  EBulkKey,
  ERunType,
  ITrunkResponse,
  TableNameStorage
} from '../../models/maint-trunk-clli';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { MaintGatewaysCarrierService } from 'src/app/modules/maint-gateways-carrier/services/maint-gateways-carrier.service';
import { StorageService } from 'src/app/services/storage.service';
import { ITrunkMtcResourceInterface } from 'src/app/shared/models/trunk-mtc-resource-interface';
import { CommonService } from 'src/app/services/common.service';
import { ECommandKey, IDataConfirm, ITrunkClliEvent } from 'src/app/modules/maint-gateways-carrier/models/maint-gateways-carrier';
import { ConfirmDialogComponent } from 'rbn-common-lib';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-maint-trunk-details',
  templateUrl: './maint-trunk-details.component.html',
  styleUrls: ['./maint-trunk-details.component.scss']
})
export class MaintTrunkDetailsComponent implements OnInit {
  @ViewChild('bulkAction', { static: false }) elBulkActions: any;
  @ViewChild('rbnTableDetails') rbnTableDetails: TableComponent;
  @ViewChild('confirmTrunkCLI') confirmTrunkCLI: ConfirmDialogComponent;

  @Input() showTableSelected!: boolean;
  @Input() tabIndex!: number;
  @Input() trunkCLLI!: string | any;

  cols: Icols[] = [];
  bulkActions: any = [];
  selectedRows: any = [];
  selectedAction = null;
  tableDetail: ITrunkResponse | ITrunkResponse[] = [];
  translateResults: any = {};
  data: any = [];
  tableConfig: ITableConfig = {
    tableOptions: {
      dataKey: '',
      selectionMode: 'multiple',
      hideTableButtons: false,
      hideCheckboxAll: false,
      hideColumnInLib: true
    },
    tableName: '',
    isScrollable: false,
    showCloseTableButton: false,
    paginatorMode: PaginatorMode.Client,
    numberRowPerPage: 5,
    rowsPerPageOptions: [5, 10, 15],
    isReorderColsByStorage: true
  };
  pageTab: string;
  isInprocess = false;
  lastRefreshedTime = {
    value: '',
    format: 'MM/DD/YYYY HH:mm:ss'
  };

  dataConfirm: IDataConfirm = { title: '', content: '' };
  showConfirmActions = false;
  constructor(
    private maintTrunkClliService: MaintTrunkClliService,
    private maintGatewaysCarrierService: MaintGatewaysCarrierService,
    private storageService: StorageService,
    private commonService: CommonService,
    private translateService: TranslateInternalService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    if (this.trunkCLLI) {
      this.lastRefreshedTime.value = this.commonService.getCurrentTime(
        this.lastRefreshedTime.format
      );
    }
    this.setColumns();
    this.initBulkActions();
    this.initActionColumn();
  }

  refreshTableData() {
    this.maintTrunkClliService.refreshTable$.next(this.tabIndex);
  }

  setColumns() {
    this.maintTrunkClliService.tableCols.subscribe((dataMaintTrunkClli) => {
      this.tableDetail = dataMaintTrunkClli.trunkResponse;
      this.lastRefreshedTime.value =
        this.commonService.getCurrentTime(
          this.lastRefreshedTime.format
        );
      if (dataMaintTrunkClli.runType !== ERunType.AUTO) {
        if (dataMaintTrunkClli.colsDefault) {
          this.cols = dataMaintTrunkClli.colsDefault;
        } else {
          let headers: any;
          this.cols = [
            {
              field: FieldName.Checkbox,
              header: '',
              data: [],
              colsEnable: true
            }
          ];

          if (Array.isArray(this.tableDetail)) {
            headers = this.tableDetail[0];
          } else {
            headers = this.tableDetail;
          }
          if (headers) {
            for (let i = 0; i < Object.keys(headers).length; i++) {
              this.cols[i + 1] = {
                field: Object.keys(headers)[i],
                header:
                  this.translateResults.TRUNK_CLLI.HEADER.COLUMNS[Object.keys(headers)[i]],
                data: [],
                colsEnable: true,
                type: FilterTypes.InputText,
                sort: true
              };
            }
          }

          this.cols.push({
            field: FieldName.Action,
            header: this.translateResults.COMMON.ACTION,
            colsEnable: true,
            colWidth: 30
          });
        }
      }
      this.checkTabIndex();
    });
  }

  reloadBulkActions() {
    setTimeout(() => {
      let newConfig: ITableConfig;
      if (this.tabIndex === 0) {
        // General Trunk Maintenance Tab
        newConfig = {
          ...this.tableConfig,
          tableOptions: {
            dataKey: 'TrunkMember',
            selectionMode: 'multiple',
            hideTableButtons: false,
            hideCheckboxAll: false,
            hideColumnInLib: true,
            show3DotsButton: true,
            btn3DotsConfig: {
              exportCSVByLib: true
            }
          }

        };
        newConfig.tableName =
          TableNameStorage.generalTrunkMaintenanceTable +
          '_Columns_' +
          this.cols.length;
      } else if (this.tabIndex === 1) { // D-Channel Maintenance Tab
        newConfig = {
          ...this.tableConfig,
          tableOptions: {
            dataKey: '',
            selectionMode: 'multiple',
            hideTableButtons: false,
            hideCheckboxAll: false,
            hideColumnInLib: true,
            show3DotsButton: true,
            btn3DotsConfig: {
              exportCSVByLib: true
            }
          }
        };
        newConfig.tableName = TableNameStorage.dChannelMaintenanceTable + '_Columns_' + this.cols.length;
      } else { // ISUP COT Test Tab
        newConfig = {
          ...this.tableConfig,
          tableOptions: {
            dataKey: 'TrunkMember',
            selectionMode: 'multiple',
            hideTableButtons: false,
            hideCheckboxAll: false,
            hideColumnInLib: true,
            show3DotsButton: false,
            btn3DotsConfig: {
              exportCSVByLib: false
            }
          }
        };
        newConfig.tableName =
          TableNameStorage.dChannelMaintenanceTable +
          '_Columns_' +
          this.cols.length;
      }
      newConfig.extensibleHeaderTemplate = this.elBulkActions;
      this.tableConfig = newConfig;
      if (this.rbnTableDetails) {
        this.rbnTableDetails.tableName = newConfig.tableName;
        this.rbnTableDetails.loadDataStorageToTable();
      }
    }, 100);
  }

  initActionColumn() {
    let actions: IActionColumn[] = [];
    if (this.tabIndex === 1) {
      actions = [
        {
          label: DChannelBulkActionOptionsData.BSY_BY_TRUNKS.label,
          tooltip: DChannelBulkActionOptionsData.BSY_BY_TRUNKS.label,
          onClick: (row: any) => {
            this.selectedRows.push(row);
            this.checkShowConfirm(DChannelBulkActionOptionsData.BSY_BY_TRUNKS);
          }
        },
        {
          label: DChannelBulkActionOptionsData.RTS_BY_TRUNKS.label,
          tooltip: DChannelBulkActionOptionsData.RTS_BY_TRUNKS.label,
          onClick: (row: any) => {
            this.selectedRows.push(row);
            this.checkShowConfirm(DChannelBulkActionOptionsData.RTS_BY_TRUNKS);
          }
        },
        {
          label: DChannelBulkActionOptionsData.INB_BY_TRUNKS.label,
          tooltip: DChannelBulkActionOptionsData.INB_BY_TRUNKS.label,
          onClick: (row: any) => {
            this.selectedRows.push(row);
            this.checkShowConfirm(DChannelBulkActionOptionsData.INB_BY_TRUNKS);
          }
        }
      ];
    } else {
      actions = [
        {
          label: CMaintenanceByTrunkClliOptionsData.POST_BY_TRUNKS.label,
          tooltip: CMaintenanceByTrunkClliOptionsData.POST_BY_TRUNKS.label,
          onClick: (row: any) => {
            this.selectedRows.push(row);
            this.checkShowConfirm(
              CMaintenanceByTrunkClliOptionsData.POST_BY_TRUNKS
            );
          }
        },
        {
          label: CMaintenanceByTrunkClliOptionsData.BSY_BY_TRUNKS.label,
          tooltip: CMaintenanceByTrunkClliOptionsData.BSY_BY_TRUNKS.label,
          onClick: (row: any) => {
            this.selectedRows.push(row);
            this.checkShowConfirm(
              CMaintenanceByTrunkClliOptionsData.BSY_BY_TRUNKS
            );
          }
        },
        {
          label: CMaintenanceByTrunkClliOptionsData.RTS_BY_TRUNKS.label,
          tooltip: CMaintenanceByTrunkClliOptionsData.RTS_BY_TRUNKS.label,
          onClick: (row: any) => {
            this.selectedRows.push(row);
            this.checkShowConfirm(
              CMaintenanceByTrunkClliOptionsData.RTS_BY_TRUNKS
            );
          }
        },
        {
          label: CMaintenanceByTrunkClliOptionsData.FRLS_BY_TRUNKS.label,
          tooltip: CMaintenanceByTrunkClliOptionsData.FRLS_BY_TRUNKS.label,
          onClick: (row: any) => {
            this.selectedRows.push(row);
            this.checkShowConfirm(
              CMaintenanceByTrunkClliOptionsData.FRLS_BY_TRUNKS
            );
          }
        },
        {
          label: CMaintenanceByTrunkClliOptionsData.INB_BY_TRUNKS.label,
          tooltip: CMaintenanceByTrunkClliOptionsData.INB_BY_TRUNKS.label,
          onClick: (row: any) => {
            this.selectedRows.push(row);
            this.checkShowConfirm(
              CMaintenanceByTrunkClliOptionsData.INB_BY_TRUNKS
            );
          }
        }
      ];
    }
    this.tableConfig.actionColumnConfig = {
      actions: actions,
      quantityDisplayed: 0
    };
  }

  initBulkActions() {
    if (this.tabIndex === 1) {
      this.bulkActions = [
        {
          label: DChannelBulkActionOptionsData.BSY_BY_TRUNKS.label,
          value: DChannelBulkActionOptionsData.BSY_BY_TRUNKS.value,
          description: '',
          type: ''
        },
        {
          label: DChannelBulkActionOptionsData.RTS_BY_TRUNKS.label,
          value: DChannelBulkActionOptionsData.RTS_BY_TRUNKS.value,
          description: '',
          type: ''
        },
        {
          label: DChannelBulkActionOptionsData.INB_BY_TRUNKS.label,
          value: DChannelBulkActionOptionsData.INB_BY_TRUNKS.value,
          description: '',
          type: ''
        }
      ];
    } else {
      this.bulkActions = [
        {
          label: CMaintenanceByTrunkClliOptionsData.POST_BY_TRUNKS.label,
          value: CMaintenanceByTrunkClliOptionsData.POST_BY_TRUNKS.value
        },
        {
          label: CMaintenanceByTrunkClliOptionsData.BSY_BY_TRUNKS.label,
          value: CMaintenanceByTrunkClliOptionsData.BSY_BY_TRUNKS.value
        },
        {
          label: CMaintenanceByTrunkClliOptionsData.RTS_BY_TRUNKS.label,
          value: CMaintenanceByTrunkClliOptionsData.RTS_BY_TRUNKS.value
        },
        {
          label: CMaintenanceByTrunkClliOptionsData.FRLS_BY_TRUNKS.label,
          value: CMaintenanceByTrunkClliOptionsData.FRLS_BY_TRUNKS.value
        },
        {
          label: CMaintenanceByTrunkClliOptionsData.INB_BY_TRUNKS.label,
          value: CMaintenanceByTrunkClliOptionsData.INB_BY_TRUNKS.value
        }
      ];
    }
  }

  onCheckboxChange(event: any) {
    if (event) {
      this.selectedRows = event.selectedRows;
      if (this.selectedRows.length === 0) {
        this.clearSelectedOption();
      }
    }
  }

  checkTabIndex() {
    if (this.tabIndex === 2) {
      this.cols.shift();
      this.cols.pop();
    } else {
      this.reloadBulkActions();
    }
    if (this.rbnTableDetails) {
      this.rbnTableDetails.resetFilter();
    }
    this.data = this.tableDetail;
    this.initBulkActions();
    this.initActionColumn();
  }

  clearSelectedOption() {
    setTimeout(() => {
      this.selectedAction = null;
    }, 100);
  }

  callAction(event: any) {
    const body: ITrunkMtcResourceInterface[] = [];
    const sSecurityInfo = `UserID=${this.storageService.userID}`;
    if (this.tabIndex === 1) {
      this.selectedRows.map((row: any) => {
        body.push(
          { key: 'TerminalNumber', value: row?.TerminalNumber },
          { key: 'NodeNumber', value: row?.NodeNumber },
          { key: 'Force', value: true }
        );
        this.callBulkActionApi(event, body, sSecurityInfo);
      });
    } else {
      const trunkMembers: number[] = [];
      this.selectedRows.map((row: any) => {
        trunkMembers.push(row.TrunkMember);
      });
      body.push(
        { key: 'TrunkClli', value: this.trunkCLLI },
        { key: 'TrunkMembers', value: trunkMembers.join(',') }
      );
      this.callBulkActionApi(event, body, sSecurityInfo);
    }
    this.selectedRows = [];
    this.clearSelectedOption();
  }

  callBulkActionApi(
    event: string,
    body: ITrunkMtcResourceInterface[],
    sSecurityInfo: string
  ) {
    this.isInprocess = true;
    this.maintGatewaysCarrierService
      .genericCommandToPerformMaintenanceOrQuerying(event, body, sSecurityInfo)
      .subscribe({
        next: (rs: any) => {
          this.isInprocess = false;
          if (rs[event]?.Error || rs[event]?.Members?.Member?.Error) {
            this.commonService.showErrorMessage(
              rs[event]?.Error?.Message
                ? rs[event].Error.Message
                : rs[event].Members.Member.Error.Message
            );
          } else {
            this.isInprocess = true;
            if (this.tabIndex === 1) {
              event = EBulkKey.PostGroupDChannelByTrunkCLLI;
              body = [{ key: ECommandKey.TrunkCLLI, value: this.trunkCLLI }];
            } else {
              let range = '';
              this.maintTrunkClliService.summaryDetails.subscribe((summary) => {
                range = summary['TrunkMembers'];
              });
              event = CMaintenanceByTrunkClliOptionsData.POST_BY_TRUNKS.value;
              body = [
                { key: ECommandKey.TrunkCLLI, value: this.trunkCLLI },
                { key: 'TrunkMembers', value: range }
              ];
            }
            this.maintGatewaysCarrierService
              .genericCommandToPerformMaintenanceOrQuerying(
                event,
                body,
                sSecurityInfo
              )
              .subscribe({
                next: (res: any) => {
                  this.isInprocess = false;
                  this.maintTrunkClliService.handleTableData(
                    res[event]?.Members?.Member,
                    ERunType.ACTIONS_TABLE
                  );
                  this.lastRefreshedTime.value =
                    this.commonService.getCurrentTime(
                      this.lastRefreshedTime.format
                    );
                  this.commonService.showSuccessMessage(this.translateResults.TRUNK_CLLI.SUCCESSFULLY_UPDATED);
                },
                error: (err: any) => {
                  this.isInprocess = false;
                  this.commonService.showAPIError(err);
                }
              });
          }
        },
        error: (err: any) => {
          this.isInprocess = false;
          this.commonService.showAPIError(err);
        }
      });
  }

  checkShowConfirm(event: ITrunkClliEvent) {
    const preferences = sessionStorage.getItem('tmm_preferences');
    if (preferences) {
      const preferencesParse = JSON.parse(preferences);
      if (preferencesParse.confirmation.checked) {
        this.showConfirmActions = true;
        this.dataConfirm.title = this.translateResults.TRUNK_CLLI.CONFIRMATION_ACTIONS.TITLE;
        this.dataConfirm.content = this.translateResults.TRUNK_CLLI.CONFIRMATION_ACTIONS.CONTENT_ALL_TRUNK
          .replace('{{action}}', event.label);
        this.confirmTrunkCLI.emitConfirm.pipe(take(1)).subscribe(rs => {
          if (rs) {
            this.callAction(event.value);
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
