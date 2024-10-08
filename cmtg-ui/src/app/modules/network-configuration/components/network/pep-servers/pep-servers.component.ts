import { FilterTypes, FieldName, ITableConfig, Icols, ItemDropdown } from 'rbn-common-lib';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { tableConfigCommon } from 'src/app/types/const';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IEditPepServer, IPepServer } from '../models/pep-servers';

@Component({
  selector: 'app-pep-servers',
  templateUrl: './pep-servers.component.html',
  styleUrls: ['./pep-servers.component.scss']
})
export class PepServersComponent implements OnInit {

  pepServerFormGroup: FormGroup;
  tableConfig: ITableConfig;
  cols: Icols[] = [];
  data: IPepServer[] = [];
  translateResults: any;
  isLoading = false;
  showAddDialog = false;
  showDeleteDialog = false;
  showDeleteErrorDialog = false;
  showErrorDialog = false;
  deleteSelectedData: IPepServer = {
    name: '',
    ipAddress: '',
    boxType: 5,
    maxConnections: null,
    protocol: 9,
    protVersion: ''
  };
  dropDownDataItems: ItemDropdown[];
  errorData: {
    errorCode: string;
    message: string;
  };
  messageText: string;
  messageTextDetail: string;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showDetailsBtn = true;
  showEditDialog = false;
  selectedData: IPepServer;
  isDataChanged = false;

  constructor(
    private translateService: TranslateInternalService,
    private networkConfigurationService: NetworkConfigurationService,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
    this.tableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        ...tableConfigCommon.tableOptions,
        dataKey: 'name'
      },
      tableName: 'PepServersTbl',
      actionColumnConfig: {
        actions: [
          {
            icon: 'fa fa-pencil-square-o',
            label: 'edit action',
            tooltip: 'edit',
            onClick: (data: IPepServer, index: any) => {
              console.log('table action 1');
              this.showEditDialog = true;
              this.dropDownDataItems = [
                { label: data.protVersion, value: data.protVersion }
              ];
              this.selectedData = {
                name: data.name,
                ipAddress: data.ipAddress,
                boxType: data.boxType,
                maxConnections: data.maxConnections,
                protocol: data.protocol,
                protVersion: data.protVersion
              };
              const protVersionData = ['DQOS I03', 'DQOS I04'];
              this.dropDownDataItems = protVersionData.map((item: string) => ({
                label: item,
                value: item
              }));
              this.pepServerFormGroup.setValue(this.selectedData);
            }
          },
          {
            icon: 'fas fa-trash',
            label: 'Delete',
            tooltip: 'Delete',
            onClick: (event: IPepServer) => {
              console.log('delete selected data');
              this.deleteSelectedData = {
                name: event.name,
                ipAddress: event.ipAddress,
                boxType: event.boxType,
                maxConnections: event.maxConnections,
                protocol: event.protocol,
                protVersion: event.protVersion
              };
              this.showDeleteDialog = true;
            }
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    this.initForm();
    this.initCols();
    this.getPepServersData();
    this.pepServerFormGroup.valueChanges.subscribe((changes) => {
      this.isDataChanged =
        this.selectedData?.ipAddress !== changes?.ipAddress ||
        this.selectedData?.boxType !== Number(changes?.boxType) ||
        this.selectedData?.maxConnections !== Number(changes?.maxConnections) ||
        this.selectedData?.protVersion !== changes?.protVersion;
    });
  }

  initCols() {
    this.cols = [
      {
        data: [],
        field: 'name',
        header:
          this.translateResults.NETWORK.PEP_SERVERS.TABLE_TITLE
            .PEP_SERVERS_NAME,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'boxType',
        header: this.translateResults.NETWORK.PEP_SERVERS.TABLE_TITLE.TYPE,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'ipAddress',
        header:
          this.translateResults.NETWORK.PEP_SERVERS.TABLE_TITLE.IP_ADDRESS,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'maxConnections',
        header:
          this.translateResults.NETWORK.PEP_SERVERS.TABLE_TITLE.MAX_CONNECTION,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'protVersion',
        header:
          this.translateResults.NETWORK.PEP_SERVERS.TABLE_TITLE
            .PROTOCOL_VERSION,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: FieldName.Action,
        header: this.translateResults.NETWORK.ACTION,
        colsEnable: true,
        sort: false,
        autoSetWidth: true
      }
    ];
  }

  initForm() {
    this.pepServerFormGroup = new FormGroup({
      name: new FormControl<string | null>(null, Validators.required),
      ipAddress: new FormControl<string | null>(null, [
        Validators.required,
        Validators.pattern(
          '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)'
        )
      ]),
      boxType: new FormControl<number | null>(5, Validators.required),
      maxConnections: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(65535),
        Validators.pattern(/^[0-9]{1,5}$/)
      ]),
      protocol: new FormControl<number | null>(9, Validators.required),
      protVersion: new FormControl<string | null>(null, Validators.required)
    });
  }

  get getIpAddress(){
    return this.pepServerFormGroup.get('ipAddress');
  }

  get getMaxConnections(){
    return this.pepServerFormGroup.get('maxConnections');
  }

  // get Pep Servers Data
  getPepServersData() {
    this.isLoading = true;
    this.networkConfigurationService.getPepServers().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.data = this.changeTypeAndProtVersionForUi(res.list);
      },
      error: (error) => {
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
  }

  refreshTable() {
    this.getPepServersData();
  }

  // add Pep Server Data
  addPepServer(data: IPepServer) {
    this.isLoading = true;
    this.networkConfigurationService
      .addPepServer(this.changeTypeAndProtVersionForBackend(data))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.commonService.showSuccessMessage(
            this.translateResults.NETWORK.PEP_SERVERS.ADD_PEP_SERVER
              .PEP_SERVER_ADDED_SUCCESSFULLY
          );
          this.closeAddDialogAndDeleteFormValue();
          this.refreshTable();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorData = error?.error || error;
          const messageAndDetails = JSON.stringify(this.errorData?.message);
          const parsedData = messageAndDetails.split('details = ');
          this.detailsText = parsedData[0]
            .split('"message = ')[1]
            .replace(this.reg, '<br>')
            .replace(this.tabReg, ' &emsp;');
          this.messageText = this.translateResults.NETWORK.PEP_SERVERS.ADD_PEP_SERVER.FAILED_MESSAGE
            .replace(/{{pepName}}/, `"${data.name}"`);

          this.showErrorDialog = true;
        }
      });
  }

  addNewPepServerBtn() {
    this.pepServerFormGroup.setValue({
      name: '',
      ipAddress: '',
      boxType: 'dqosmb',
      maxConnections: 10,
      protocol: 9,
      protVersion: 'DQOS I04'
    });
    this.setDropDownItemForProtVersion();
    this.showAddDialog = true;
  }

  setDropDownItemForProtVersion() {
    const protVersionData = ['DQOS I03', 'DQOS I04'];
    this.dropDownDataItems = protVersionData.map((item: string) => ({
      label: item,
      value: item
    }));
    if (this.dropDownDataItems.length > 0) {
      this.pepServerFormGroup.controls['protVersion'].setValue(
        this.dropDownDataItems[1].value
      );
    }
  }

  addPepServerFormFooterHandler(event: boolean) {
    event
      ? this.addPepServer(this.pepServerFormGroup.value)
      : this.closeAddDialogAndDeleteFormValue();
  }

  closeAddDialogAndDeleteFormValue() {
    this.pepServerFormGroup.reset();
    this.formGroupReset();
    this.showAddDialog = false;
  }


  formGroupReset() {
    this.pepServerFormGroup.setValue({
      name: null,
      ipAddress: null,
      boxType: 5,
      maxConnections: null,
      protocol: 9,
      protVersion: null
    });
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
    this.showDetailsBtn = true;
  }

  // Delete Pep Server
  deletePepServer() {
    this.isLoading = true;
    this.networkConfigurationService
      .deletePepServer(this.deleteSelectedData.name)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.closeDeleteDialogAndDeleteSelectedData();
          this.refreshTable();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorData = err.error;
          const messageAndDetails = JSON.stringify(this.errorData.message);
          const parsedData = messageAndDetails.split('details = ');
          this.detailsText = parsedData[0]
            .split('"message = ')[1]
            .replace(this.reg, '<br>');
          this.messageText =
            this.translateResults.NETWORK.PEP_SERVERS.DELETE_PEP_SERVER.DELETE_ERROR_SUMMARY;

          this.showDeleteErrorDialog = true;
        }
      });
  }

  deleteDialogFooterHandler(event: boolean) {
    event
      ? this.deletePepServer()
      : this.closeDeleteDialogAndDeleteSelectedData();
  }

  closeDeleteDialogAndDeleteSelectedData() {
    this.showDeleteDialog = false;
    this.deleteSelectedData = {
      name: '',
      ipAddress: '',
      boxType: 5,
      maxConnections: null,
      protocol: null,
      protVersion: ''
    };
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  closeDeleteErrorDialog() {
    this.showDeleteErrorDialog = false;
    this.showDetailsBtn = true;
  }

  // Edit Pep Server
  editPepServer(data: IPepServer) {
    this.isLoading = true;
    const changedDataForBackend = this.changeTypeAndProtVersionForBackend(data);
    const editDataBody: IEditPepServer = {
      ipAddress: changedDataForBackend.ipAddress,
      protVersion: changedDataForBackend.protVersion,
      maxConnections: changedDataForBackend.maxConnections
    };
    this.networkConfigurationService
      .editPepServer(editDataBody, data.name)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.commonService.showSuccessMessage(
            this.translateResults.NETWORK.PEP_SERVERS.EDIT_PEP_SERVER
              .PEP_SERVER_EDITED_SUCCESSFULLY
          );
          this.closeEditDialogAndDeleteFormValue();
          this.refreshTable();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorData = error?.error || error;
          const messageAndDetails = JSON.stringify(this.errorData?.message);
          const parsedData = messageAndDetails.split('details = ');
          this.detailsText = parsedData[0]
            .split('"message = ')[1]
            .replace(this.reg, '<br>');
          this.messageText = this.translateResults.NETWORK.PEP_SERVERS.EDIT_PEP_SERVER.FAILED_MESSAGE
            .replace(/{{pepName}}/, `"${data.name}"`);
          this.showErrorDialog = true;
        }
      });
  }

  isDataChangedValue() {
    this.isDataChanged = this.selectedData !== this.pepServerFormGroup.value;
  }

  closeEditDialogAndDeleteFormValue() {
    this.showEditDialog = false;
    this.formGroupReset();
  }

  editPepServerFormFooterHandler(event: any) {
    event
      ? this.editPepServer(this.pepServerFormGroup.value)
      : this.closeEditDialogAndDeleteFormValue();
  }

  changeTypeAndProtVersionForUi(data: IPepServer[]) {
    data.map((item) => {
      // type
      item.boxType = 'dqosmb';
      // protocol Version
      switch (item.protVersion) {
        case '0.3':
          item.protVersion = 'DQOS I03';
          break;
        case '0.4':
          item.protVersion = 'DQOS I04';
          break;
        default:
          break;
      }
    });
    return data;
  }

  changeTypeAndProtVersionForBackend(data: IPepServer) {
    // type
    data.boxType = 5;
    // protocol Version
    switch (data.protVersion) {
      case 'DQOS I03':
        data.protVersion = '0.3';
        break;
      case 'DQOS I04':
        data.protVersion = '0.4';
        break;
      default:
        break;
    }
    return data;
  }
}
