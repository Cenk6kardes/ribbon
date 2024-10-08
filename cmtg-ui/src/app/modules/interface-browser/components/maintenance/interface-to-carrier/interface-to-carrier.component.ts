import { ITableConfig, Icols, FilterTypes, ColumnHidingMode } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { tableConfigCommon } from 'src/app/types/const';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IlinkMapTable } from '../../../models/interface-browser';

@Component({
  selector: 'app-interface-to-carrier',
  templateUrl: './interface-to-carrier.component.html',
  styleUrls: ['./interface-to-carrier.component.scss']
})
export class InterfaceToCarrierComponent implements OnInit {
  tableConfig: ITableConfig;
  form: FormGroup;
  cols: Icols[] = [];
  data: { linkId: string; epGrp: string }[] = [];
  translateResults: any;
  isInprocess = false;
  interfaceIds$ = this.interfaceBrowserService
    .getInterfaceBrowserTemplateID()
    .pipe(map((res) => res.responseData.___key_list));

  get interfaceId() {
    return this.form.get('interfaceId')?.value;
  }
  constructor(
    private translateService: TranslateInternalService,
    private commonService: CommonService,
    private interfaceBrowserService: InterfaceBrowserService
  ) {
    this.translateResults = this.translateService.translateResults;
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
      tableName: 'InterfaceToCarrier'
    };
    this.form = new FormGroup({
      interfaceId: new FormControl<string>('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.initCols();
  }

  handleEvent(event: boolean) {
    if (event) {
      this.getTableData();
    } else {
      this.data = [];
    }
  }

  getTableData() {
    this.data = [];
    this.isInprocess = true;
    this.interfaceBrowserService
      .getInterfaceBrowserTemplate(this.interfaceId)
      .pipe(
        map((res) => {
          if (res.rc.__value !== 0) {
            this.commonService.showErrorMessage(res.responseMsg);
          }
          return res.responseData.___v52Interface.linkMapTable;
        })
      )
      .subscribe({
        next: (res) => {
          this.isInprocess = false;
          this.data = res.map((linkTable: IlinkMapTable) => {
            const linkId = linkTable.linkId;
            const epGrp = linkTable.epGrp;
            return {
              linkId,
              epGrp
            };
          });
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          this.isInprocess = false;
        }
      });
  }

  initCols() {
    this.cols = [
      {
        data: [],
        field: 'linkId',
        header: 'Interface',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText
      },
      {
        data: [],
        field: 'epGrp',
        header: 'Carrier',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText
      }
    ];
  }
}
