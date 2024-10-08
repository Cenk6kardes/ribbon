import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { tableConfigCommon } from 'src/app/types/const';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import {
  IProvisioningGWCInfoRes,
  IProvisioningLinesRes,
  IProvisioningLinesResponseData,
  IProvisioningLinesTableData,
  mapEndpointTNType } from '../../../models/lines';
import { Icols, ITableConfig, FilterTypes } from 'rbn-common-lib';
import { SelectItem } from 'primeng/api';
import { retry, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss']
})
export class LinesComponent implements OnInit, OnChanges {
  @Input() gwControllerName!: string;

  translateResults: any;
  isLoading = false;

  // Lines Table
  linesTableConfig: ITableConfig;
  linesTableCols: Icols[] = [];
  linesTableData: IProvisioningLinesTableData[] = [];

  retrieveForm: FormGroup;
  retrivalCriteriaOptions: SelectItem[];
  limitResultOptions: SelectItem[];
  searchLinesHistory: { label: string; value: string }[] = [];
  gwcIp: string;

  currentGwcName: string;

  showRetrieveHandleErrorDialog = false;
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

  constructor(
    private fb: FormBuilder,
    private gwcService: GatewayControllersService,
    private commonService: CommonService,
    private translateService: TranslateInternalService
  ) {
    this.translateResults = this.translateService.translateResults;
    this.linesTableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        ...tableConfigCommon.tableOptions,
        dataKey: 'endpointName'
      },
      tableName: 'ProvisioningLinesTbl',
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

  ngOnInit(): void {
    this.initCols();
    const storedHistory = sessionStorage.getItem('searchLinesHistory');
    if (storedHistory) {
      this.searchLinesHistory = JSON.parse(storedHistory);
    }
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
      this.linesTableData = [];
    }
    this.currentGwcName = this.gwControllerName;
  }

  initCols() {
    this.linesTableCols = [
      {
        data: [],
        field: 'endpointName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.TABLE.COLS.NAME,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'gatewayName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.TABLE.COLS.GATEWAY,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'gwDefaultDomain',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.TABLE.COLS.GATEWAY_DOMAIN,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'extNodeNumber',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.TABLE.COLS.NODE_NUMBER,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'extTerminalNumber',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.TABLE.COLS.TERMINAL_NUMBER,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'endpointTNType',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.TABLE.COLS.ENDPOINT_TYPE,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      }
    ];
  }

  onRetrieveHandle(event: boolean) {
    // reset - false
    // retrieve - true
    const inputValue = this.retrieveForm.get('retrivalCriteria')?.value?.trim();
    if (inputValue !== undefined && (inputValue !== '' && !this.isValueSearchedBefore(inputValue))) {
      const newItem = { label: inputValue, value: inputValue };
      this.searchLinesHistory.push(newItem);
      // Save searchLinesHistory to sessionStorage
      sessionStorage.setItem('searchLinesHistory', JSON.stringify(this.searchLinesHistory));
    }
    if (event) {
      const searchString = this.retrieveForm.get('retrivalCriteria')?.value;
      const limitResult = this.retrieveForm.get('limitResult')?.value;
      const maxReturnRows =  limitResult < 0 ? '3000' : limitResult;
      if (isNaN(maxReturnRows) || !maxReturnRows || maxReturnRows >= 2147483647) {
        this.commonService.showErrorMessage(this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.ERROR.NUMERIC);
        return;
      }
      this.isLoading = true;
      this.gwcService.getLinesDataRetrive(this.gwcIp, searchString, maxReturnRows)
        .pipe(take(1),retry(1),
          tap((res: IProvisioningLinesRes) => {
            this.isLoading = false;
            const tableDataBackup = this.linesTableData;
            this.linesTableData = [];
            const transformedData = res.epData.map(
              (item: IProvisioningLinesResponseData) => ({
                endpointName: item.endpointName,
                gatewayName: item.gatewayName,
                gwDefaultDomain: item.gwDefaultDomain === 'NOT_SET' ? '' : item.gwDefaultDomain,
                extNodeNumber: item.extNodeNumber,
                extTerminalNumber: item.extTerminalNumber,
                endpointTNType: mapEndpointTNType[item.endpointTNType] ? mapEndpointTNType[item.endpointTNType] : 'unknown'
              })
            );

            this.linesTableData = [
              ...(this.retrieveForm.get('radioButton')?.value === 'appendToList' ? tableDataBackup : []),
              ...transformedData
            ];
          })
        )
        .subscribe({
          error: (error) => {
            this.isLoading = false;
            this.titleText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.ERROR.TITLE;
            this.errorData = error?.error || error;
            const messageAndDetails = JSON.stringify(this.errorData?.message);
            const parsedData = messageAndDetails?.split('details = ');
            this.detailsText = parsedData[0]?.split('message = ')[1]?.replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' ) || '';
            this.messageText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.ERROR.MESSAGE;
            this.showRetrieveHandleErrorDialog = true;
          }
        });

    } else {
      this.setDefaultValues();
    }
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  closeRetrieveHandleErrorDialog() {
    this.showRetrieveHandleErrorDialog = false;
    this.showDetailsBtn = true;
    this.titleText = '';
    this.messageText = '';
    this.detailsText = '';
  }

  onRetriveAllHandle() {
    this.isLoading = true;
    this.gwcService
      .getLinesDataRetriveAll(this.gwcIp)
      .pipe(take(1), retry(1))
      .subscribe({
        next: (res: IProvisioningLinesRes) => {
          this.isLoading = false;
          this.linesTableData = [];
          this.linesTableData = res.epData.map(
            (item: IProvisioningLinesResponseData) => ({
              endpointName: item.endpointName,
              gatewayName: item.gatewayName,
              gwDefaultDomain: item.gwDefaultDomain === 'NOT_SET' ? '' : item.gwDefaultDomain,
              extNodeNumber: item.extNodeNumber,
              extTerminalNumber: item.extTerminalNumber,
              endpointTNType:  mapEndpointTNType[item.endpointTNType] ? mapEndpointTNType[item.endpointTNType] : 'unknown'
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
    return this.searchLinesHistory.some((item) => item.value === value);
  }

  refreshLinesTable() {
    if (this.retrieveForm.controls['retrivalCriteria'].value) {
      this.onRetrieveHandle(true);
    } else {
      this.onRetriveAllHandle();
    }
  }
}
