import { FilterTypes, FieldName, ITableConfig, Icols, ItemDropdown } from 'rbn-common-lib';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { tableConfigCommon } from 'src/app/types/const';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IGRGWs } from '../models/gr-gateways';

@Component({
  selector: 'app-gr-gateways',
  templateUrl: './gr-gateways.component.html',
  styleUrls: ['./gr-gateways.component.scss']
})
export class GrGatewaysComponent implements OnInit {

  grGWFormGroup: FormGroup;
  tableConfig: ITableConfig;
  cols: Icols[] = [];
  data: IGRGWs[] = [];
  translateResults: any;
  isLoading = false;
  showAddDialog = false;
  showDeleteDialog = false;
  showDeleteErrorDialog = false;
  showErrorDialog = false;
  deleteSelectedData: IGRGWs = {
    'g6Name': '',
    'type': '',
    'ipAddress': '',
    'port': null,
    'userName': '',
    'passWd': ''
  };
  dropDownDataItems: ItemDropdown[];
  errorData: {
    errorCode: string,
    message: string
  };
  messageText: string;
  messageTextDetail: string;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showDetailsBtn = true;
  showEditDialog = false;
  selectedData: IGRGWs;
  isDataChanged = false;

  constructor(
    private translateService: TranslateInternalService,
    private networkConfigurationService: NetworkConfigurationService,
    private commonService: CommonService) {
    this.translateResults = this.translateService.translateResults;
    this.tableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        ...tableConfigCommon.tableOptions,
        dataKey: 'g6Name'
      },
      tableName: 'GRGatewaysTbl',
      actionColumnConfig: {
        actions: [
          {
            icon: 'fa fa-pencil-square-o',
            label: 'edit action',
            tooltip: 'edit',
            onClick: (data: IGRGWs, index: any) => {
              console.log('table action 1');
              this.showEditDialog = true;
              this.dropDownDataItems = [{ label: data.type, value: data.type }];
              this.selectedData = {
                'g6Name': data.g6Name,
                'type': data.type,
                'ipAddress': data.ipAddress,
                'port': data.port,
                'userName': data.userName,
                'passWd': data.passWd
              };
              this.grGWFormGroup.setValue(this.selectedData);
            }
          },
          {
            icon: 'fas fa-trash',
            label: 'Delete',
            tooltip: 'Delete',
            onClick: (event: IGRGWs) => {
              console.log('delete selected data');
              this.deleteSelectedData = {
                'g6Name': event.g6Name,
                'type': event.type,
                'ipAddress': event.ipAddress,
                'port': event.port,
                'userName': event.userName,
                'passWd': event.passWd
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
    this.getGRGWsData();
    this.grGWFormGroup.valueChanges.subscribe(changes => {
      this.isDataChanged = (
        this.selectedData?.ipAddress !== changes?.ipAddress ||
        this.selectedData?.port !== Number(changes?.port) ||
        this.selectedData?.userName !== changes?.userName ||
        this.selectedData?.passWd !== changes?.passWd );
    });
  }

  initCols() {
    this.cols = [
      {
        data: [], field: 'g6Name', header: this.translateResults.NETWORK.GR_GATEWAYS.TABLE_TITLE.GR_NAME,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'type', header: this.translateResults.NETWORK.GR_GATEWAYS.TABLE_TITLE.TYPE,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'ipAddress', header: this.translateResults.NETWORK.GR_GATEWAYS.TABLE_TITLE.IP_ADDRESS,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'port', header: this.translateResults.NETWORK.GR_GATEWAYS.TABLE_TITLE.PORT,
        colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'userName', header: this.translateResults.NETWORK.GR_GATEWAYS.TABLE_TITLE.USER,
        colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: FieldName.Action, header: this.translateResults.NETWORK.ACTION,
        colsEnable: true, sort: false, autoSetWidth: true
      }
    ];
  }

  initForm() {
    this.grGWFormGroup = new FormGroup({
      g6Name: new FormControl<string | null>(null, Validators.required),
      type: new FormControl<string | null>(null, Validators.required),
      ipAddress: new FormControl<string | null>(null, [Validators.required,
        Validators.pattern('(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')]),
      port: new FormControl<number | null>(null, [Validators.required,
        Validators.min(0), Validators.max(65535), Validators.pattern(/^[0-9]{1,5}$/)]),
      userName: new FormControl<string | null>(null, Validators.required),
      passWd: new FormControl<string | null>(null, Validators.required)
    });
  }

  get getIpAddress(){
    return this.grGWFormGroup.get('ipAddress');
  }

  get getPort(){
    return this.grGWFormGroup.get('port');
  }

  // get GR-834 GWs Data
  getGRGWsData() {
    this.isLoading = true;
    this.networkConfigurationService.getGRGWs().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.data = res.list;
      }, error: (error) => {
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
  }

  refreshTable() {
    this.getGRGWsData();
  }

  // add GR-834 GW
  addGRGW(data: IGRGWs) {
    this.isLoading = true;
    this.networkConfigurationService.addGRGW(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.commonService.showSuccessMessage(this.translateResults.NETWORK.GR_GATEWAYS.ADD_GR.GRGW_ADDED_SUCCESSFULLY);
        this.closeAddDialogAndDeleteFormValue();
        this.refreshTable();
      }, error: (error) => {
        this.isLoading = false;
        this.errorData = error?.error || error;
        const messageAndDetails = JSON.stringify(this.errorData?.message);
        const parsedData = messageAndDetails.split('details = ');
        this.detailsText = parsedData[1].replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;');
        this.messageTextDetail = parsedData[0].split('"message = ')[1].replace(this.reg, '<br>');
        this.messageText = this.translateResults.NETWORK.GR_GATEWAYS.ADD_GR.FAILED_MESSAGE
          .replace(/{{g6Name}}/, `"${data.g6Name}"`);
        this.showErrorDialog = true;
      }
    });
  };

  addNewGRBtn() {
    this.isLoading = true;
    this.networkConfigurationService.getGWType().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.dropDownDataItems = res.map((item: string) => ({ label: item, value: item }));
        if (this.dropDownDataItems.length > 0) {
          this.grGWFormGroup.controls['type'].setValue(
            this.dropDownDataItems[0].value
          );
        }
        this.showAddDialog = true;
      }, error: (error) => {
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
  }

  addGRGWFormFooterHandler(event: boolean) {
    event ? this.addGRGW(this.grGWFormGroup.value) : this.closeAddDialogAndDeleteFormValue();
  }

  closeAddDialogAndDeleteFormValue() {
    this.grGWFormGroup.reset();
    this.setFormValueToDefault();
    this.showAddDialog = false;
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
    this.showDetailsBtn = true;
  }

  // Delete GRGW
  deleteGRGW() {
    this.isLoading = true;
    this.networkConfigurationService.isGRGWUsed(this.deleteSelectedData.g6Name).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (!res) {
          this.isLoading = true;
          this.networkConfigurationService.deleteGRGW(true, this.deleteSelectedData).subscribe({
            next: () => {
              this.isLoading = false;
              this.closeDeleteDialogAndDeleteSelectedData();
              this.refreshTable();
            }, error: (err) => {
              this.showDeleteErrorPopup(err);
            }
          });
        } else {
          const errorMessage = this.translateResults.NETWORK.GR_GATEWAYS.DELETE_GRGW.ERROR_MESSAGE
            .replace(/{{g6Name}}/, `"${this.deleteSelectedData.g6Name}"`);
          this.closeDeleteDialogAndDeleteSelectedData();
          this.commonService.showErrorMessage( errorMessage,
            this.translateResults.NETWORK.GR_GATEWAYS.DELETE_GRGW.DELETE_ERROR_SUMMARY);
        }
      }, error: (err) => {
        this.showDeleteErrorPopup(err);
      }
    });
  }

  showDeleteErrorPopup(err: any) {
    this.closeDeleteDialogAndDeleteSelectedData();
    this.isLoading = false;
    this.errorData = err?.error || err;
    const messageAndDetails = JSON.stringify(this.errorData.message);
    const isErrorGWCException = messageAndDetails?.includes('"message =');
    if(isErrorGWCException) {
      const parsedData = messageAndDetails.split('details = ');
      this.detailsText = parsedData[0].split('"message = ')[1].replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' );
      this.messageText = this.translateResults.NETWORK.GR_GATEWAYS.DELETE_GRGW.DELETE_ERROR_SUMMARY;
      this.showDeleteErrorDialog = true;
    } else {
      this.commonService.showAPIError(err);
    }
  }

  deleteDialogFooterHandler(event: boolean) {
    event ? this.deleteGRGW() : this.closeDeleteDialogAndDeleteSelectedData();
  }

  closeDeleteDialogAndDeleteSelectedData() {
    this.showDeleteDialog = false;
    this.deleteSelectedData = {
      'g6Name': '',
      'type': '',
      'ipAddress': '',
      'port': null,
      'userName': '',
      'passWd': ''
    };
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  closeDeleteErrorDialog() {
    this.showDeleteErrorDialog = false;
    this.showDetailsBtn = true;
  }

  // Edit GR-834 Gateway
  editGRGW(data: IGRGWs) {
    this.isLoading = true;
    this.networkConfigurationService.editGRGW(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.commonService.showSuccessMessage(this.translateResults.NETWORK.GR_GATEWAYS.EDIT_GR.GR_EDITED_SUCCESSFULLY);
        this.closeEditDialogAndDeleteFormValue();
        this.refreshTable();
      }, error: (error) => {
        this.isLoading = false;
        this.errorData = error?.error || error;
        const messageAndDetails = JSON.stringify(this.errorData?.message);
        const parsedData = messageAndDetails.split('details = ');
        this.detailsText = parsedData[0].split('"message = ')[1].replace(this.reg, '<br>');
        this.messageText = this.translateResults.NETWORK.GR_GATEWAYS.EDIT_GR.FAILED_MESSAGE
          .replace(/{{g6Name}}/, `"${data.g6Name}"`);

        this.showErrorDialog = true;
      }
    });
  }

  isDataChangedValue() {
    this.isDataChanged = this.selectedData !== this.grGWFormGroup.value;
  }

  closeEditDialogAndDeleteFormValue() {
    this.showEditDialog = false;
    this.setFormValueToDefault();
  }

  editGRGWFormFooterHandler(event: any) {
    event ? this.editGRGW(this.grGWFormGroup.value) : this.closeEditDialogAndDeleteFormValue();
  }

  setFormValueToDefault() {
    this.grGWFormGroup.setValue({
      g6Name: '',
      type: '',
      ipAddress: '',
      port: null,
      userName: '',
      passWd: ''
    });
  }
}
