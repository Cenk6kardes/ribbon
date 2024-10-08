import { ITableConfig, Icols, FilterTypes, FieldName } from 'rbn-common-lib';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { tableConfigCommon } from 'src/app/types/const';
import { IALGs, IEditSelectedALG } from '../models/algs';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-algs',
  templateUrl: './algs.component.html',
  styleUrls: ['./algs.component.scss']
})
export class AlgsComponent implements OnInit {

  tableConfig: ITableConfig;
  cols: Icols[] = [];
  data: IALGs[] = [];
  changedDataForRequest: IALGs;
  translateResults: any;
  isLoading = false;
  addAlgFormGroup: FormGroup;
  showAddDialog = false;
  showDeleteDialog = false;
  showEditDialog = false;
  showInfoAboutNoOptionDialog = false;
  showErrorDialog = false;
  deleteSelectedData: IALGs = {
    name: '',
    ipAddress: '',
    port: 2427,
    protocol: null
  };
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

  constructor(private translateService: TranslateInternalService,
    private networkConfigurationService: NetworkConfigurationService,
    private commonService: CommonService) {
    this.translateResults = this.translateService.translateResults;
    this.tableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        ...tableConfigCommon.tableOptions,
        dataKey: 'name'
      },
      tableName: 'AlgsTbl',
      actionColumnConfig: {
        actions: [
          {
            icon: 'fa fa-pencil-square-o',
            label: 'edit action',
            tooltip: 'edit',
            onClick: (data: any, index: any) => {
              console.log('table action 1');
              this.showEditDialog = true;
              this.addAlgFormGroup.setValue({
                name: data.name,
                ipAddress: data.ipAddress,
                port: data.port,
                protocol: data.protocol
              });
            }
          },
          {
            icon: 'fas fa-trash',
            label: 'Delete',
            tooltip: 'Delete',
            onClick: (event: IALGs) => {
              console.log('click onClick Delete');
              this.deleteSelectedData = {
                'name': event.name,
                'ipAddress': event.ipAddress,
                'port': event.port,
                'protocol': event.protocol
              };
              this.showDeleteDialog = true;
            }
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    this.initCols();
    this.initForm();
    this.getAlgsData();
  }

  initCols() {
    this.cols = [
      {
        data: [], field: 'name', header: this.translateResults.NETWORK.ALGS.TABLE_TITLE.NAME,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'ipAddress', header: this.translateResults.NETWORK.ALGS.TABLE_TITLE.IP_ADDRESS,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'protocol', header: this.translateResults.NETWORK.ALGS.TABLE_TITLE.PROTOCOL,
        colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'port', header: this.translateResults.NETWORK.ALGS.TABLE_TITLE.PORT,
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
    this.addAlgFormGroup = new FormGroup({
      name: new FormControl<string | null>(null, Validators.required),
      ipAddress: new FormControl<string | null>(null, [Validators.required,
        Validators.pattern('(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')]),
      port: new FormControl<number | null>(2427, [Validators.pattern(/^-?\d{1,10}$/), Validators.min(-32768), Validators.max(32767)]),
      protocol: new FormControl<number | null>(1)
    });
  }

  get getIpAddress(){
    return this.addAlgFormGroup.get('ipAddress');
  }
  get getPort(){
    return this.addAlgFormGroup.get('port');
  }

  // get all Algs Data
  getAlgsData() {
    this.isLoading = true;
    this.networkConfigurationService.getAlgs().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.data = this.changeProtocolToNCSForUI(res.list);
      }, error: (error) => {
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
  }

  changeProtocolToNCSForUI(res: IALGs[]) {
    res.map((item: IALGs) => {
      item.protocol = this.translateResults.NETWORK.ALGS.ADD_ALG.NCS;
    });
    return res;
  }

  refreshTable() {
    this.getAlgsData();
  }

  // add ALG
  addAlg(data: IALGs) {
    this.isLoading = true;
    this.networkConfigurationService.addAlg(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.commonService.showSuccessMessage(this.translateResults.NETWORK.ALGS.ADD_ALG.ALG_ADDED_SUCCESSFULLY);
        this.closeAddDialogAndDeleteFormValue();
        this.refreshTable();
      }, error: (error) => {
        this.isLoading = false;
        this.errorData = error?.error || error;
        const messageAndDetails = JSON.stringify(this.errorData?.message);
        const parsedData = messageAndDetails.split('details = ');
        this.detailsText = parsedData[0].split('"message = ')[1].replace(this.reg, '<br>');
        this.messageText = this.translateResults.NETWORK.ALGS.ADD_ALG.FAILED_MESSAGE
          .replace(/{{algName}}/, `"${data.name}"`);
        this.showErrorDialog = true;
      }
    });
  };

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
    this.showDetailsBtn = true;
  }

  addNewAlgBtn() {
    this.showAddDialog = true;
    this.setFormValueToDefault();
  }

  closeAddDialogAndDeleteFormValue() {
    this.addAlgFormGroup.reset();
    this.setFormValueToDefault();
    this.showAddDialog = false;
  }

  addAlgFormFooterHandler(event: boolean) {
    if (event) {
      this.changedDataForRequest = {
        name: this.addAlgFormGroup.get('name')?.value,
        ipAddress: this.addAlgFormGroup.get('ipAddress')?.value,
        port: this.addAlgFormGroup.get('port')?.value,
        protocol: 1 // set protocol 1 for request to backend
      };
      /**
       * The code blocks below were closed due to adding Validators.min(-32768), Validators.max(32767) values,
       * the error message is not needed since the add button is disabled.
       * These code blocks were added to ABH-2819 and edited on ABH-3213.
       * The codes were commented out so that they can be directly added when necessary later.
       *
       if ( -2147483648 > this.addAlgFormGroup.get('port')?.value || this.addAlgFormGroup.get('port')?.value > 2147483647 ) {
        this.commonService.showErrorMessage( `${this.translateResults.NETWORK.ALGS.COMMON.NUMERIC_VALUE} (${
            this.addAlgFormGroup.get('port')?.value
          }) ${this.translateResults.NETWORK.ALGS.COMMON.OUT_OF_RANGE}`
        );
      } else {
        if ( -32768 <= this.addAlgFormGroup.get('port')?.value && this.addAlgFormGroup.get('port')?.value <= 32767 ) {
          this.addAlg(this.changedDataForRequest);
        }
      }
      **/
      this.addAlg(this.changedDataForRequest);
    } else {
      this.closeAddDialogAndDeleteFormValue();
    }
  }

  // Delete ALG
  deleteALG() {
    this.isLoading = true;
    this.networkConfigurationService.deleteAlg(this.deleteSelectedData.name).subscribe({
      next: () => {
        this.isLoading = false;
        this.commonService.showSuccessMessage(this.translateResults.NETWORK.ALGS.DELETE_ALG.ALG_DELETED_SUCCESSFULLY);
        this.closeDeleteDialogAndDeleteSelectedData();
        this.refreshTable();
      }, error: (error) => {
        this.isLoading = false;
        this.errorData = error?.error || error;
        const messageAndDetails = JSON.stringify(this.errorData.message);
        const parsedData = messageAndDetails.split('details = ');
        this.detailsText = parsedData[0].split('"message = ')[1].replace(this.reg, '<br>');
        this.messageText = this.translateResults.NETWORK.ALGS.DELETE_ALG.FAILED_MESSAGE
          .replace(/{{algName}}/, `"${this.deleteSelectedData.name}"`);
        this.showErrorDialog = true;
        this.closeDeleteDialogAndDeleteSelectedData();
      }
    });
  }

  deleteDialogFooterHandler(event: boolean) {
    if (event) {
      this.deleteALG();
    } else {
      this.closeDeleteDialogAndDeleteSelectedData();
      this.showInfoAboutNoOptionDialog = true;
    }
  }

  closeInfoAboutNoOptionDialog() {
    this.showInfoAboutNoOptionDialog = false;
  }

  closeDeleteDialogAndDeleteSelectedData() {
    this.showDeleteDialog = false;
    this.deleteSelectedData = {
      name: '',
      ipAddress: '',
      port: 2427,
      protocol: null
    };
  }

  // Edit Alg
  editAlg(data: IALGs) {
    const body: IEditSelectedALG = {
      ipAddress: data.ipAddress,
      port: data.port,
      protocol: data.protocol
    };
    this.isLoading = true;
    this.networkConfigurationService.editAlg(body, data.name).subscribe({
      next: () => {
        this.isLoading = false;
        this.commonService.showSuccessMessage(this.translateResults.NETWORK.ALGS.EDIT_ALG.ALG_EDITED_SUCCESSFULLY);
        this.closeEditDialogAndDeleteFormValue();
        this.refreshTable();
      }, error: (error) => {
        this.isLoading = false;
        this.errorData = error?.error || error;
        const messageAndDetails = JSON.stringify(this.errorData?.message);
        const parsedData = messageAndDetails.split('details = ');
        this.detailsText = parsedData[0].split('"message = ')[1].replace(this.reg, '<br>');
        this.messageText = this.translateResults.NETWORK.ALGS.EDIT_ALG.FAILED_MESSAGE
          .replace(/{{algName}}/, `"${data.name}"`);
        this.showErrorDialog = true;
      }
    });
  }

  editAlgFormFooterHandler(event: any) {
    if (event) {
      this.changedDataForRequest = {
        name: this.addAlgFormGroup.get('name')?.value,
        ipAddress: this.addAlgFormGroup.get('ipAddress')?.value,
        port: this.addAlgFormGroup.get('port')?.value,
        protocol: 1
      };
      if (-2147483648 > this.addAlgFormGroup.get('port')?.value) {
        this.commonService.showErrorMessage(`${this.translateResults.NETWORK.ALGS.COMMON.NUMERIC_VALUE} (${this
          .addAlgFormGroup.get('port')?.value}) ${this.translateResults.NETWORK.ALGS.COMMON.OUT_OF_RANGE}`);
      } else if (this.addAlgFormGroup.get('port')?.value > 2147483647) {
        this.commonService.showErrorMessage(`${this.translateResults.NETWORK.ALGS.COMMON.NUMERIC_VALUE} (${this
          .addAlgFormGroup.get('port')?.value}) ${this.translateResults.NETWORK.ALGS.COMMON.OUT_OF_RANGE}`);
      } else {
        this.editAlg(this.changedDataForRequest);
      }
      console.log(this.changedDataForRequest);
    } else {
      this.closeEditDialogAndDeleteFormValue();
    }
  }

  closeEditDialogAndDeleteFormValue() {
    this.showEditDialog = false;
    this.setFormValueToDefault();
  }

  setFormValueToDefault() {
    this.addAlgFormGroup.setValue({
      name: null,
      ipAddress: null,
      port: 2427,
      protocol: null
    });
  }
}
