import {
  AfterViewChecked,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
  EventEmitter,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  FilterTypes,
  PaginatorMode,
  FieldName,
  ITableConfig,
  Icols,
  TableComponent,
  IActionColumn
} from 'rbn-common-lib';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import {
  ILineValidateResponseInfo,
  IPropertyDetailInfo,
  IQdnQsipDetailInfo
} from 'src/app/shared/models/line-maintenance-manager';
import { HomeService } from '../../services/home.service';

import {
  GWC_ADDRESS,
  IBulkActionsDirectory,
  IDirectoryTable,
  IRefreshDNEmit,
  ACTION_TYPES,
  REFRESH_TYPE,
  SET_TYPE,
  EDirectoryValue,
  LINE_LIMIT
} from '../../models/home';
import { DirectoryService } from '../../services/directory.service';
import { CommonService } from 'src/app/services/common.service';
import { IGateway } from 'src/app/shared/models/gateway-controller-element-manager';
import { StatusLogService } from 'src/app/services/status-log.service';
import { Router } from '@angular/router';
import { PREFIX_URL } from 'src/app/types/const';
import { StorageService } from 'src/app/services/storage.service';

export interface IInformationData {
  content: string;
  title?: string;
}
@Component({
  selector: 'app-directory-table',
  templateUrl: './directory-table.component.html',
  styleUrls: ['./directory-table.component.scss']
})
export class DirectoryTableComponent
implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('bulkAction', { static: false }) elBulkActions: any;
  @ViewChild('rbnTableDirectory') rbnTableDirectory: TableComponent;
  @Output() refreshDN = new EventEmitter();

  translateResults: any = {};
  cols: Icols[] = [];
  data: IDirectoryTable[];
  bulkActions: IBulkActionsDirectory[] = [];
  selectedRows: IDirectoryTable[] = [];
  selectedAction = null;
  tableConfig: ITableConfig = {
    tableOptions: {
      dataKey: 'cm_dn',
      selectionMode: 'multiple',
      hideTableButtons: false,
      hideCheckboxAll: false,
      hideColumnInLib: true,
      showClearAllRowsButton: true,
      show3DotsButton: true,
      btn3DotsConfig: {
        exportCSVByLib: true
      }
    },
    tableName: 'directoryTable',
    showCloseTableButton: false,
    paginatorMode: PaginatorMode.Client,
    numberRowPerPage: 5,
    rowsPerPageOptions: [5, 10, 15]
  };

  displayWarningDialog = false;
  warningDialogData: {
    title: string;
    content: string;
    data?: IDirectoryTable[];
  } = {
      title: '',
      content: '',
      data: undefined
    };
  propertyActionList: IPropertyDetailInfo[] = [];
  qdnActionList: IQdnQsipDetailInfo[] = [];
  qsipActionList: IQdnQsipDetailInfo[] = [];

  autoRefreshSubscription: Subscription;
  runAutoRefreshSubscription: Subscription;
  dataTableSubscription: Subscription;
  actions: IActionColumn[];
  isInprocess = false;
  displayInfoDialog = false;
  infoDialogData = {
    title: '',
    content: ''
  };
  originDataCurrentPage: IDirectoryTable[] = [];

  constructor(
    private translateInternalService: TranslateInternalService,
    private preferencesService: PreferencesService,
    private directoryService: DirectoryService,
    private cd: ChangeDetectorRef,
    private homeService: HomeService,
    private commonService: CommonService,
    private statusLogService: StatusLogService,
    private router: Router,
    private storageService: StorageService
  ) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  ngOnInit(): void {
    this.translateResults = this.translateInternalService.translateResults;
    this.tableConfig.emptyMessageContent =
      this.translateResults.HOME.EMPTY_MESSAGE_CONTENT;

    this.initCols();
    this.initBulkActions();
    this.initActionColumn();

    this.directoryService.restoreDataTableFromStorage();
    this.data = this.directoryService.dataTable;
    this.dataTableSubscription =
      this.directoryService.dataTableChange$.subscribe((rs) => {
        if (rs) {
          this.data = [...this.directoryService.dataTable];
          this.setCurrentOriginData();
        }
      });
  }

  // #region Init view
  initCols() {
    this.cols = [
      {
        field: FieldName.Checkbox,
        header: '',
        sort: false,
        data: [],
        colsEnable: true
      },
      {
        field: 'cm_dn',
        header: 'Directory Number',
        sort: true,
        data: [],
        colsEnable: true,
        type: FilterTypes.Multiselect,
        colWidth: 150,
        options: {
          usingLink: true
        },
        allowHide: false
      },
      {
        field: 'clli',
        header: 'Call Server CLLI',
        sort: true,
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        colWidth: 145
      },
      {
        field: 'cm_line_state',
        header: 'Call Server Line State',
        sort: true,
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText
      },
      {
        field: 'endpoint_state',
        header: 'Endpoint State Communication Error',
        sort: true,
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText
      },
      {
        field: 'profile',
        header: 'Gateway Profile',
        sort: true,
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText
      },
      {
        field: 'time',
        header: 'Time',
        sort: true,
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        colWidth: 85
      },
      {
        field: FieldName.Action,
        header: 'Action',
        sort: false,
        colsEnable: true
      }
    ];
  }

  initBulkActions() {
    this.bulkActions = [
      {
        label: 'Properties',
        value: 'PROPERTIES',
        description: this.translateResults.HOME.ACTION_TITLE.PROPERTIES,
        type: ACTION_TYPES.PROPERTIES_TYPE
      },
      {
        label: 'BSY',
        value: 'BSY',
        description: this.translateResults.HOME.ACTION_TITLE.MOVE_TO_BUSY_STATE,
        type: ACTION_TYPES.MAINTENANCE_TYPE
      },
      {
        label: 'RTS',
        value: 'RTS',
        description: this.translateResults.HOME.ACTION_TITLE.RETURN_TO_SERVICE,
        type: ACTION_TYPES.MAINTENANCE_TYPE
      },
      {
        label: 'FRLS',
        value: 'FRLS',
        description: this.translateResults.HOME.ACTION_TITLE.FORCE_RELEASE,
        type: ACTION_TYPES.MAINTENANCE_TYPE
      },
      {
        label: 'INB',
        value: 'INB',
        description: this.translateResults.HOME.ACTION_TITLE.INSTALLATION_BUSY,
        type: ACTION_TYPES.MAINTENANCE_TYPE
      },
      {
        label: 'QDN',
        value: 'QDN',
        description: this.translateResults.HOME.ACTION_TITLE.QUERY_DN,
        type: ACTION_TYPES.QDN_TYPE
      },
      {
        label: 'QSIP',
        value: 'QSIP',
        description: this.translateResults.HOME.ACTION_TITLE.QUERY_SIP,
        type: ACTION_TYPES.QSIP_TYPE
      },
      {
        label: 'Clear',
        value: 'CLEAR',
        description:
          this.translateResults.HOME.ACTION_TITLE.CLEAR_SELECTED_ROWS,
        type: ACTION_TYPES.CLEAR
      }
    ];
  }

  initActionColumn() {
    this.actions = [
      {
        icon: 'fas fa-refresh',
        label: 'refresh',
        tooltip: this.translateResults.HOME.ACTION_TITLE.REFRESH,
        onClick: (row: IDirectoryTable, index: number) => {
          const emitData: IRefreshDNEmit = {
            data: [row],
            refreshType: REFRESH_TYPE.ROW
          };
          this.refreshDN.emit(emitData);
        }
      },
      {
        icon: 'fas fa-times',
        label: 'clear',
        tooltip: this.translateResults.HOME.ACTION_TITLE.CLEAR,
        onClick: (row: IDirectoryTable, index: number) => {
          this.clearRows([row]);
        }
      },
      {
        label: 'Properties',
        tooltip: this.translateResults.HOME.ACTION_TITLE.PROPERTIES,
        onClick: (row: IDirectoryTable, index: number) => {
          this.actionProperties([row]);
        }
      },
      {
        label: 'BSY',
        tooltip: this.translateResults.HOME.ACTION_TITLE.MOVE_TO_BUSY_STATE,
        onClick: (row: IDirectoryTable, index: number) => {
          this.actionMaintencance('bsy', [row]);
        }
      },
      {
        label: 'RTS',
        tooltip: this.translateResults.HOME.ACTION_TITLE.RETURN_TO_SERVICE,
        onClick: (row: IDirectoryTable, index: number) => {
          this.actionMaintencance('rts', [row]);
        }
      },
      {
        label: 'FRLS',
        tooltip: this.translateResults.HOME.ACTION_TITLE.FORCE_RELEASE,
        onClick: (row: IDirectoryTable, index: number) => {
          this.warningDialog('FRLS', [row]);
        }
      },
      {
        label: 'INB',
        tooltip: this.translateResults.HOME.ACTION_TITLE.INSTALLATION_BUSY,
        onClick: (row: IDirectoryTable, index: number) => {
          this.actionMaintencance('inb', [row]);
        }
      },
      {
        label: 'QDN',
        tooltip: this.translateResults.HOME.ACTION_TITLE.QUERY_DN,
        onClick: (row: IDirectoryTable, index: number) => {
          this.actionQdn([row]);
        }
      },
      {
        label: 'QSIP',
        tooltip: this.translateResults.HOME.ACTION_TITLE.QUERY_SIP,
        onClick: (row: IDirectoryTable, index: number) => {
          this.actionQsip([row]);
        }
      }
    ];
    this.tableConfig.actionColumnConfig = {
      actions: this.actions,
      quantityDisplayed: 2
    };
  }
  // #endregion

  callAction(event: IBulkActionsDirectory) {
    // Added type for ease of use, as some actions use the same endpoints.
    // This kind of structure is needed to pull the type from the object array.
    if (this.selectedRows.length <= LINE_LIMIT.LIMIT) {
      switch (event.type) {
        case ACTION_TYPES.MAINTENANCE_TYPE:
          // BSY - RTS - FRLS - INB uses same endpoint methods
          if (event.value.toLowerCase() === 'frls') {
            this.warningDialog('FRLS', this.selectedRows);
          } else {
            this.actionMaintencance(event.value, this.selectedRows);
          }
          break;
        case ACTION_TYPES.QDN_TYPE:
          // QDN endpoint method
          this.actionQdn(this.selectedRows);
          break;
        case ACTION_TYPES.QSIP_TYPE:
          // QSIP endpoint method
          this.actionQsip(this.selectedRows);
          break;
        case ACTION_TYPES.PROPERTIES_TYPE:
          // Properties endpoint method
          this.actionProperties(this.selectedRows);
          break;
        case ACTION_TYPES.CLEAR:
          this.clearRows(this.selectedRows);
          break;
        default:
          break;
      }
    } else {
      this.commonService.showErrorMessage(
        this.translateResults.HOME.MAX_LINE_LIMIT?.replace(
          '{{LIMIT}}',
          LINE_LIMIT.LIMIT
        )
      );
      this.clearSelectedOption();
    }
  }

  actionMaintencance(value: string, directoryData: IDirectoryTable[]) {
    let directoryInprocess = directoryData.length;
    for (let i = 0; i < directoryData.length; i++) {
      const item = directoryData[i];
      const actionData = this.directoryService.formatLineRequest(item);
      this.isInprocess = true;
      this.homeService.getMaintenance(value, actionData).subscribe({
        next: (response) => {
          directoryInprocess--;
          this.selectedRows = this.selectedRows.filter(
            (itemRow) => itemRow.cm_dn !== item.cm_dn
          );
          if (directoryInprocess === 0) {
            this.isInprocess = false;
          }
          if (response && response.hasOwnProperty('mtc_rc')) {
            switch (response.mtc_rc) {
              case '0':
                {
                  if (directoryData.length === 1) {
                    this.commonService.showSuccessMessage(
                      `${value} DN ${item.cm_dn} success`
                    );
                  }
                  this.homeService
                    .getLinePostInformation(actionData)
                    .subscribe({
                      next: (resLinePostInformation) => {
                        // update cm_line_state
                        const indexDN =
                          this.directoryService.dataTable.findIndex(
                            (n) => n.cm_dn === resLinePostInformation.cm_dn
                          );
                        if (indexDN !== -1) {
                          this.directoryService.dataTable[
                            indexDN
                          ].cm_line_state =
                            resLinePostInformation.cm_line_state;
                        }
                        this.homeService
                          .getEndpointStateInformation(
                            item.cm_gwc_address,
                            item.cm_tid
                          )
                          .subscribe({
                            next: (endpoint) => {
                              // update endpoint_state
                              if (indexDN !== -1) {
                                this.directoryService.dataTable[
                                  indexDN
                                ].endpoint_state =
                                  this.directoryService.formatEndpointStateValue(
                                    endpoint
                                  );
                              }
                            },
                            error: (err) => {
                              this.commonService.showAPIError(err);
                            }
                          });
                      },
                      error: (err) => {
                        this.commonService.showAPIError(err);
                      }
                    });
                }
                break;
              case '8':
                {
                  let message =
                    this.translateResults.HOME.MTC_RC_ERRORS[response.mtc_rc];
                  message = message.replace('{{CLLI}}', item.clli);
                  this.commonService.showWarnMessage(
                    message,
                    `WARNING: ${value} DN ${item.cm_dn}`
                  );
                  this.showActionStatusLogs(value, item.cm_dn, message);
                }
                break;
              case '2':
                {
                  this.commonService.showErrorMessage(
                    `${this.translateResults.HOME.CM_RC_ERRORS[2]} ${item.cm_dn}`
                  );
                }
                break;
              default:
                {
                  if (
                    this.translateResults.HOME.MTC_RC_ERRORS.hasOwnProperty(
                      response.mtc_rc
                    )
                  ) {
                    let message =
                      this.translateResults.HOME.MTC_RC_ERRORS[response.mtc_rc];
                    message = message.replace('{{CLLI}}', item.clli);
                    this.commonService.showErrorMessage(
                      message,
                      `ERROR: ${value} DN ${item.cm_dn}`
                    );
                    this.showActionStatusLogs(value, item.cm_dn, message);
                  } else {
                    this.commonService.showErrorMessage(
                      `mtc_rc = ${response.mtc_rc}`,
                      `ERROR: ${value} DN ${item.cm_dn}`
                    );
                  }
                }
                break;
            }
          }
        },
        error: (err) => {
          directoryInprocess--;
          if (directoryInprocess === 0) {
            this.isInprocess = false;
            this.selectedRows = [];
          }
          this.commonService.showAPIError(err);
        }
      });
    }
    this.clearSelectedOption();
  }

  actionQdn(directoryData: IDirectoryTable[]) {
    this.qdnActionList = [];
    let completedRequests = 0;

    const handleAllRequestsComplete = () => {
      if (completedRequests === directoryData.length) {
        // All requests completed
        this.navigateDetailsPage(
          this.qdnActionList.length,
          directoryData.length,
          this.qdnActionList,
          ACTION_TYPES.QDN_TYPE
        );
        this.clearSelectedOption();
      }
    };

    for (let i = 0; i < directoryData.length; i++) {
      const item = directoryData[i];
      this.homeService
        .getLineInformationByDNAndCLLI(item.cm_dn, item.clli)
        .subscribe({
          next: (response: ILineValidateResponseInfo) => {
            if (response.cm_rc === '0') {
              // If cm_rc is '0', get QDN
              this.homeService.getQdn(response.cm_dn).subscribe({
                next: (res) => {
                  this.qdnActionList.push({
                    cm_dn: response.cm_dn,
                    data: res
                  });
                  completedRequests++;
                  handleAllRequestsComplete();
                },
                error: (err) => {
                  // Handle error
                  this.commonService.showAPIError(err);
                  completedRequests++;
                  handleAllRequestsComplete();
                }
              });
            } else {
              // If cm_rc is not '0', show error message and handle completion
              this.commonService.showErrorMessage(
                `${this.translateResults.HOME.CM_RC_ERRORS[response.cm_rc]} ${item.cm_dn}` ||
                `${this.translateResults.HOME.QDN_COMMAND_FAILED} ${item.cm_dn}`
              );
              completedRequests++;
              handleAllRequestsComplete();
            }
          },
          error: (err) => {
            // Handle error
            this.commonService.showAPIError(err);
            completedRequests++;
            handleAllRequestsComplete();
          }
        });
    }
  }

  actionQsip(directoryData: IDirectoryTable[]) {
    // check qsip is available or not.
    if (directoryData[0]?.profile === 'SIPVOICE') {
      for (let i = 0; i < directoryData.length; i++) {
        const item = directoryData[i];
        this.homeService
          .getLineInformationByDNAndCLLI(item.cm_dn, item.clli)
          .subscribe({
            next: (response: ILineValidateResponseInfo) => {
              if (response.cm_rc === '0') {
                this.homeService.getQsip(response.cm_dn).subscribe({
                  next: (res) => {
                    this.qsipActionList.push({
                      cm_dn: response.cm_dn,
                      data: res
                    });
                    this.navigateDetailsPage(
                      this.qsipActionList.length,
                      directoryData.length,
                      this.qsipActionList,
                      ACTION_TYPES.QSIP_TYPE
                    );
                  },
                  error: (err) => {
                    this.commonService.showAPIError(err);
                  }
                });
              } else if (response.cm_rc === '2') {
                this.commonService.showErrorMessage(
                  `${this.translateResults.HOME.CM_RC_ERRORS[2]} ${item.cm_dn}`
                );
              } else {
                this.commonService.showErrorMessage(
                  this.translateResults.HOME.QSIP_COMMAND_FAILED
                );
              }
            },
            error: (err) => {
              this.commonService.showAPIError(err);
            }
          });
      }
    } else {
      this.displayDialogInfomation({
        title: `${this.translateResults.HOME.QSIP_DN}: ${directoryData[0]?.cm_dn}`,
        content: this.translateResults.HOME.DN_IS_NOT_SIP_LINE
      });
    }
    this.clearSelectedOption();
  }

  displayDialogInfomation(information: IInformationData) {
    this.infoDialogData.title =
      information.title ||
      `${this.translateResults.COMMON.ERROR} ${this.translateResults.HOME.QSIP_DN}`;
    this.infoDialogData.content = information.content;
    this.displayInfoDialog = true;
  }

  actionProperties(directoryData: IDirectoryTable[]) {
    let itemsProcessed = 0;
    for (let i = 0; i < directoryData.length; i++) {
      const item = directoryData[i];
      this.homeService
        .getLineInformationByDNAndCLLI(item.cm_dn, item.clli)
        .subscribe({
          next: (response: ILineValidateResponseInfo) => {
            if (response.cm_rc === '0') {
              if (response.cm_gwc_address !== GWC_ADDRESS.ZERO) {
                this.homeService
                  .getGateway(response.cm_gwc_address, response.gw_name)
                  .subscribe({
                    next: (res: IGateway) => {
                      // Will Set Values Here
                      const pieces = response.cm_tid.split(/[\s.]+/);
                      this.propertyActionList.push({
                        cm_dn: response.cm_dn,
                        clli: item.clli,
                        cl_len: response.cm_len,
                        cm_lcc: response.cm_lcc,
                        ground_start: response.cm_clli,
                        cm_nn: pieces[0],
                        cm_tn: pieces[pieces.length - 1],
                        cm_gwc_name: response.cm_gwc_name.replace(
                          /\s+(\d+)/,
                          '-$1'
                        ),
                        cm_gwc_address: response.cm_gwc_address,
                        gw_name: response.gw_name,
                        gw_address: response.gw_address,
                        middle_box:
                          res.middleBoxName !== SET_TYPE.NOT_SET
                            ? res.middleBoxName
                            : SET_TYPE.NONE,
                        alg_name:
                          res.algName !== SET_TYPE.NOT_SET
                            ? res.algName
                            : SET_TYPE.NONE,
                        endpoint_name: response.endpoint_name
                      });
                      itemsProcessed++;
                      if (itemsProcessed === directoryData.length) {
                        this.navigateDetailsPage(
                          this.propertyActionList.length,
                          directoryData.length,
                          this.propertyActionList,
                          ACTION_TYPES.PROPERTIES_TYPE
                        );
                      }

                      if (
                        res.pepServerName !== SET_TYPE.NOT_SET ||
                        res.middleBoxName !== SET_TYPE.NOT_SET ||
                        res.algName !== SET_TYPE.NOT_SET
                      ) {
                        const middleBoxName =
                          res.middleBoxName !== SET_TYPE.NOT_SET
                            ? res.middleBoxName
                            : res.pepServerName !== SET_TYPE.NOT_SET
                              ? res.pepServerName
                              : res.algName;
                        this.homeService
                          .getMiddleBoxIp(middleBoxName)
                          .subscribe({
                            next: () => {
                              // Ask What to do??
                              this.homeService
                                .getGateWayIp(item.gw_address, item.gw_name)
                                .subscribe({
                                  next: () => {
                                    // Ask What to do??
                                  },
                                  error: (err) => {
                                    this.commonService.showAPIError(err);
                                  }
                                });
                            },
                            error: (err) => {
                              this.commonService.showAPIError(err);
                            }
                          });
                      }
                    },
                    error: (err) => {
                      this.commonService.showAPIError(err);
                    }
                  });
              } else {
                const pieces = response.cm_tid.split(/[\s.]+/);
                this.propertyActionList.push({
                  cm_dn: response.cm_dn,
                  clli: item.clli,
                  cl_len: response.cm_len,
                  cm_lcc: response.cm_lcc,
                  ground_start: response.cm_clli,
                  cm_nn: pieces[0],
                  cm_tn: pieces[pieces.length - 1],
                  cm_gwc_name: SET_TYPE.NONE,
                  cm_gwc_address: SET_TYPE.NONE,
                  gw_name: SET_TYPE.NONE,
                  gw_address: SET_TYPE.NONE,
                  middle_box: SET_TYPE.NONE,
                  alg_name: SET_TYPE.NONE,
                  endpoint_name: SET_TYPE.NONE
                });
                itemsProcessed++;
                if (itemsProcessed === directoryData.length) {
                  this.navigateDetailsPage(
                    this.propertyActionList.length,
                    directoryData.length,
                    this.propertyActionList,
                    ACTION_TYPES.PROPERTIES_TYPE
                  );
                }
              }
            } else if (response.cm_rc === '2') {
              this.commonService.showErrorMessage(
                `${this.translateResults.HOME.CM_RC_ERRORS[response.cm_rc]} ${item.cm_dn}`
              );
            } else {
              this.commonService.showErrorMessage(
                this.translateResults.HOME.PROPERTIES_COMMAND_FAILED
              );
            }
          },
          error: (err) => {
            this.commonService.showAPIError(err);
          }
        });
    }
    this.clearSelectedOption();
  }

  navigateDetailsPage(
    responseCount: number,
    dataCount: number,
    data: IPropertyDetailInfo[] | IQdnQsipDetailInfo[],
    type: number
  ) {
    if (responseCount && responseCount === data.length) {
      this.router.navigate([PREFIX_URL + '/home/bulk/details'], {
        state: { data: data, type: type }
      });
    }
  }

  warningDialog(action: string, directorydata: IDirectoryTable[]) {
    if (directorydata.length === 1) {
      this.warningDialogData.title = `${action} DN ${directorydata[0].cm_dn}`;
    } else {
      this.warningDialogData.title = `${action} ${directorydata.length} DN`;
    }
    this.warningDialogData.content = this.translateResults.HOME.FRLS_WARNING;
    this.warningDialogData.data = directorydata;
    this.displayWarningDialog = true;
  }

  continueProcess(event: any) {
    if (event) {
      if (this.warningDialogData.data) {
        this.actionMaintencance('frls', this.warningDialogData.data);
      }
    } else {
      this.clearSelectedOption();
    }
    this.warningDialogData.data = undefined;
    this.displayWarningDialog = false;
  }

  ngAfterViewInit(): void {
    if (this.data.length > 0) {
      this.rbnTableDirectory.loadDataStorageToTable();
    }
    const newConfig = { ...this.tableConfig };
    newConfig.extensibleHeaderTemplate = this.elBulkActions;
    this.tableConfig = newConfig;
    this.handleDisabledRefreshButton();
    this.handleAutoRefresh();
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  handleAutoRefresh() {
    this.preferencesService.startAutoRefresh(false);
    this.autoRefreshSubscription =
      this.preferencesService.autoRefreshEmit$.subscribe((isRefresh) => {
        if (isRefresh) {
          const emitData: IRefreshDNEmit = {
            data: this.getRowsForAutoRefresh(),
            refreshType: REFRESH_TYPE.AUTO
          };
          if (emitData.data.length > 0) {
            this.refreshDN.emit(emitData);
          }
        }
      });
  }

  handleDisabledRefreshButton() {
    this.runAutoRefreshSubscription =
      this.preferencesService.runAutoRefresh$.subscribe((isRunning) => {
        const tableOptions = { ...this.tableConfig.tableOptions };
        tableOptions.disabledRefreshButton = isRunning;
        this.tableConfig.tableOptions = tableOptions;
        // Disable Refresh action icon
        this.actions[0].disabled = isRunning;
      });
  }

  handleLinkClickDirectory(data: any) {
    if (data && data.fieldName === this.cols[1].field) {
      this.actionProperties([data.rowData]);
    }
  }

  onCheckboxChange(event: any) {
    if (event) {
      this.selectedRows = event.selectedRows;
      if (this.selectedRows.length === 0) {
        this.selectedAction = null;
      }
    }
  }

  dataTableChange(dataEvent: any[]) {
    if (dataEvent) {
      this.directoryService.dataTable = dataEvent;
    }
  }

  refreshTable() {
    const emitData: IRefreshDNEmit = {
      data: this.directoryService.dataTable,
      refreshType: REFRESH_TYPE.TABLE
    };
    this.refreshDN.emit(emitData);
  }

  clearSelectedOption() {
    setTimeout(() => {
      this.selectedAction = null;
    }, 100);
  }

  showActionStatusLogs(action: string, cm_dn: string, message: string) {
    this.statusLogService.pushLogs(
      `CRT: ${action.toUpperCase()} command failed : ${cm_dn}`
    );
    this.statusLogService.pushLogs(`VRB: ${message}`);
  }

  clearRows(rows: IDirectoryTable[]) {
    const DNSelectedRowstemp: string[] = [];
    rows.forEach((item: IDirectoryTable) => {
      const index = this.directoryService.getRowIndexByCMDN(item.cm_dn);
      if (this.directoryService.dataTable.length && index >= 0) {
        this.directoryService.dataTable.splice(index, 1);
      }
      const indexSelectedRows = this.selectedRows.findIndex(
        (n) => n.cm_dn === item.cm_dn
      );
      if (indexSelectedRows >= 0) {
        DNSelectedRowstemp.push(this.selectedRows[indexSelectedRows].cm_dn);
      }
    });
    this.directoryService.dataTable = [...this.directoryService.dataTable];
    this.selectedRows = this.selectedRows.filter((n) => {
      if (DNSelectedRowstemp.length === 0) {
        return false;
      }
      return !DNSelectedRowstemp.includes(n.cm_dn);
    });
    this.clearSelectedOption();
  }

  handlePageChangeClient() {
    this.refreshTable();
  }

  handleFilter() {
    this.setCurrentOriginData();
  }

  handleSortClient() {
    this.setCurrentOriginData();
  }

  setCurrentOriginData() {
    if (this.rbnTableDirectory) {
      const filteredValue = this.rbnTableDirectory.dataTable.filteredValue;
      if (!filteredValue) {
        const valueDirectory = this.rbnTableDirectory.dataTable.value;
        this.originDataCurrentPage =
          this.rbnTableDirectory.dataTable.dataToRender(valueDirectory);
      }
    }
  }

  getRowsForAutoRefresh() {
    const filteredValue = this.rbnTableDirectory.dataTable.filteredValue || [];
    const originFilteredValueCurrentPage =
      this.rbnTableDirectory.dataTable.dataToRender(
        filteredValue
      ) as IDirectoryTable[];
    const tempDataRefesh = [...originFilteredValueCurrentPage];
    this.originDataCurrentPage.map((item) => {
      if (
        tempDataRefesh.findIndex((n) => n.cm_dn === item.cm_dn) === -1 &&
        this.data.findIndex((n) => n.cm_dn === item.cm_dn) !== -1
      ) {
        tempDataRefesh.push(item);
      }
    });
    return tempDataRefesh;
  }

  ngOnDestroy(): void {
    this.preferencesService.stopAutoRefresh();
    if (this.storageService.sessionId) {
      this.directoryService.storeDataTableStorage(this.data);
    }

    this.autoRefreshSubscription?.unsubscribe();
    this.runAutoRefreshSubscription?.unsubscribe();
    this.dataTableSubscription?.unsubscribe();
  }
}
