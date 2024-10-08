import { tableConfigCommon } from './../../../../../types/const';
import { ITableConfig, Icols, FilterTypes, ColumnHidingMode } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-carrier-to-interface',
  templateUrl: './carrier-to-interface.component.html',
  styleUrls: ['./carrier-to-interface.component.scss']
})
export class CarrierToInterfaceComponent implements OnInit {
  tableConfig: ITableConfig;
  form: FormGroup;
  cols: Icols[] = [];
  data: { carrier: string; interfaceID: number }[] = [];
  translateResults: any;
  isInprocess = false;
  constructor(
    private translateService: TranslateInternalService,
    private commonService: CommonService,
    private interfaceBrowserService: InterfaceBrowserService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initCols();
    this.initForm();
    this.tableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        dataKey: '',
        hideTableButtons: false,
        hideCheckboxAll: true,
        hideColumnInLib: true,
        hideRefreshButton: true
      },
      enableFilter: false,
      columnHidingMode: ColumnHidingMode['None'],
      enableSearchGlobal: false,
      tableName: 'CarrierToInterface'
    };
  }

  get wildCard() {
    return this.form.get('wildCard');
  }
  get carrierName() {
    return this.form.get('carrierName');
  }
  get gatewayName() {
    return this.form.get('gatewayName');
  }

  initForm() {
    this.form = new FormGroup({
      wildCard: new FormControl<boolean>(false, Validators.required),
      gatewayName: new FormControl<string>('', Validators.required),
      carrierName: new FormControl<string>('', Validators.required)
    });

    this.wildCard?.valueChanges.subscribe((value) => {
      if (value) {
        this.carrierName?.setValue('');
        this.carrierName?.clearValidators();
        this.carrierName?.disable();
        this.carrierName?.updateValueAndValidity();
      } else {
        this.carrierName?.setValidators(Validators.required);
        this.carrierName?.enable();
        this.carrierName?.updateValueAndValidity();
      }
    });
  }

  initCols() {
    this.cols = [
      {
        data: [],
        field: 'carrier',
        header: 'Carrier Name',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'interfaceID',
        header: 'V5.2 Interface ID',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      }
    ];
  }

  handleMapping() {
    if (!this.form.valid) {
      if (this.gatewayName?.hasError('required')) {
        this.commonService.showErrorMessage(
          this.translateResults.INTERFACE_BROWSER.MAINTENANCE.ERROR_MESSAGES
            .GATEWAYNAME_REQUIRED
        );
      } else if (this.carrierName?.hasError('required')) {
        this.commonService.showErrorMessage(
          this.translateResults.INTERFACE_BROWSER.MAINTENANCE.ERROR_MESSAGES
            .CARRIERNAME_REQUIRED
        );
      }
    } else {
      this.getTableDatas();
    }
  }
  getTableDatas() {
    this.data = [];
    this.isInprocess = true;
    this.interfaceBrowserService
      .carrierInterfaceMapping(
        this.gatewayName?.value,
        this.carrierName?.value,
        this.wildCard?.value
      )
      .pipe(
        map((res) => {
          if (res.rc.__value !== 0) {
            this.commonService.showErrorMessage(res.responseMsg);
            return;
          }
          if (!res.responseData.___carrier_list.length) {
            this.commonService.showErrorMessage(
              this.translateResults.INTERFACE_BROWSER.MAINTENANCE.ERROR_MESSAGES
                .CARRIERLIST_EMPTY
            );
            return;
          }
          return res.responseData.___carrier_list;
        })
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.data = res.map(
              (carrierTable: { carrier: string; interfaceID: number }) => {
                const carrier = carrierTable.carrier;
                const interfaceID = carrierTable.interfaceID;
                return {
                  carrier,
                  interfaceID
                };
              }
            );
          }
          this.isInprocess = false;
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          this.isInprocess = false;
        }
      });
  }
  clearTable() {
    this.data = [];
  }
}
