import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';

import { ITableConfig, Icols, FilterTypes, FieldName } from 'rbn-common-lib';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { IQOSCollectors } from '../models/qos-collectors';
import { tableConfigCommon } from 'src/app/types/const';

@Component({
  selector: 'app-qos-collectors',
  templateUrl: './qos-collectors.component.html',
  styleUrls: ['./qos-collectors.component.scss']
})
export class QosCollectorsComponent implements OnInit {

  addQosCollectorFormGroup: FormGroup;
  tableConfig: ITableConfig;
  cols: Icols[] = [];
  data: IQOSCollectors[] = [];
  translateResults: any;
  isLoading = false;
  showAddDialog = false;
  showDeleteDialog = false;
  showErrorDialog = false;
  deleteSelectedData: IQOSCollectors = {
    qosName: '',
    ipAddress: '',
    port: ''
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

  constructor(
    private translateService: TranslateInternalService,
    private networkConfigurationService: NetworkConfigurationService,
    private commonService: CommonService) {
    this.translateResults = this.translateService.translateResults;
    this.tableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        ...tableConfigCommon.tableOptions,
        dataKey: 'qosName'
      },
      tableName: 'QOSCollectorsTbl',
      actionColumnConfig: {
        actions: [
          {
            icon: 'fas fa-trash',
            label: 'Delete',
            tooltip: 'Delete',
            onClick: (event: IQOSCollectors) => {
              console.log('delete selected data');
              this.deleteSelectedData = {
                'qosName': event.qosName,
                'ipAddress': event.ipAddress,
                'port': event.port
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
    this.getQOSCollectorsData();
  }

  initCols() {
    this.cols = [
      {
        data: [], field: 'qosName', header: this.translateResults.NETWORK.QOS_COLLECTORS_DETAIL.QOS_COLLECTOR_NAME,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'ipAddress', header: this.translateResults.NETWORK.QOS_COLLECTORS_DETAIL.IP_ADDRESS,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'port', header: this.translateResults.NETWORK.QOS_COLLECTORS_DETAIL.PORT, colsEnable: true, sort: false,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: FieldName.Action, header: this.translateResults.NETWORK.ACTION,
        colsEnable: true, sort: false, autoSetWidth: true
      }
    ];
  }

  initForm() {
    this.addQosCollectorFormGroup = new FormGroup({
      qosName: new FormControl<string | null>(null, Validators.required),
      ipAddress: new FormControl<string | null>(null, [Validators.required,
        Validators.pattern('(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')]),
      port: new FormControl<string | null>(null, [Validators.required,
        Validators.min(20000), Validators.max(20004), Validators.pattern('[0-9]{5}')])
    });
  }

  get getIpAddress() {
    return this.addQosCollectorFormGroup.get('ipAddress');
  }
  get getPort() {
    return this.addQosCollectorFormGroup.get('port');
  }

  // get Collectors Data
  getQOSCollectorsData() {
    this.isLoading = true;
    this.networkConfigurationService.getQoSCollectors().subscribe({
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
    this.getQOSCollectorsData();
  }

  // add Collector
  addQosCollector(data: IQOSCollectors) {
    this.isLoading = true;
    this.networkConfigurationService.addQoSCollector(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.commonService.showSuccessMessage(this.translateResults.NETWORK.QOS_COLLECTORS.QOS_ADDED_SUCCESSFULLY);
        this.closeAddDialogAndDeleteFormValue();
        this.refreshTable();
      }, error: (error) => {
        this.isLoading = false;
        this.errorData = error?.error || error;
        const messageAndDetails = JSON.stringify(this.errorData?.message);
        const parsedData = messageAndDetails.split('details = ');
        this.messageText = parsedData[0].split('"message = ')[1].replace(this.reg, '<br>');
        this.detailsText = parsedData[1].split('"')[0].replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' );
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

  addNewQoSCollectorBtn() {
    this.showAddDialog = true;
  }

  addQosCollectorFormFooterHandler(event: boolean) {
    if (event) {
      this.addQosCollectorFormGroup.valid ?
        this.addQosCollector(this.addQosCollectorFormGroup.value) :
        this.commonService.showErrorMessage(this.translateResults.COMMON.FORM_NOT_VALID);
    } else {
      this.closeAddDialogAndDeleteFormValue();
    }
  }

  closeAddDialogAndDeleteFormValue() {
    this.addQosCollectorFormGroup.reset();
    this.addQosCollectorFormGroup.setValue(
      {
        qosName: null,
        ipAddress: null,
        port: null
      });
    this.showAddDialog = false;
  }

  // Delete Collector
  deleteQoscollector() {
    this.isLoading = true;
    this.networkConfigurationService.deleteQosCollector(true, this.deleteSelectedData).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeDeleteDialogAndDeleteSelectedData();
        this.refreshTable();
      }, error: (error) => {
        this.isLoading = false;
        this.closeDeleteDialogAndDeleteSelectedData();
        this.errorData = error?.error || error;
        const messageAndDetails = JSON.stringify(this.errorData?.message);
        const isErrorGWCException = messageAndDetails?.includes('"message =');
        if(isErrorGWCException) {
          const parsedData = messageAndDetails.split('details = ');
          this.detailsText = parsedData[0].split('"message = ')[1].replace(this.reg, '<br>');
          this.messageText = this.translateResults.NETWORK.QOS_COLLECTORS.DELETE.ERROR_MESSAGE;
          this.showErrorDialog = true;
        } else {
          this.commonService.showAPIError(error);
        }
      }
    });
  }

  deleteDialogFooterHandler(event: boolean) {
    if (event) {
      this.deleteQoscollector();
    } else {
      this.closeDeleteDialogAndDeleteSelectedData();
    }
  }

  closeDeleteDialogAndDeleteSelectedData() {
    this.showDeleteDialog = false;
    this.deleteSelectedData = {
      qosName: '',
      ipAddress: '',
      port: ''
    };
  }
}
