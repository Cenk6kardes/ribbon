import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { ECommandKey } from '../../../maint-gateways-carrier/models/maint-gateways-carrier';
import { MaintGatewaysCarrierService } from '../../../maint-gateways-carrier/services/maint-gateways-carrier.service';
import { CommonService } from 'src/app/services/common.service';
import { EErrorKey, ERunType, ISupCotTest } from '../../models/maint-trunk-clli';
import { StorageService } from 'src/app/services/storage.service';
import { MaintTrunkClliService } from '../../services/maint-trunk-clli.service';
import {
  FieldName,
  Icols,
  FilterTypes
} from 'rbn-common-lib';

@Component({
  selector: 'app-isup-cot-test',
  templateUrl: './isup-cot-test.component.html',
  styleUrls: ['./isup-cot-test.component.scss']
})
export class IsupCotTestComponent implements OnInit {
  translateResults: any;
  formGroup: FormGroup;
  trunkMemberValue = '0';
  title = '';
  content = '';

  isInprocess = false;
  colsISupCotTest: Icols[] = [];

  @Input() trunkClliName: string;

  constructor(
    private translateService: TranslateInternalService,
    private maintGatewaysCarrierService: MaintGatewaysCarrierService,
    private maintTrunkClliService: MaintTrunkClliService,
    private commonService: CommonService,
    private storageService: StorageService
  ) {
    this.translateResults = this.translateService.translateResults;
  }


  ngOnInit(): void {
    this.content = this.translateResults.TRUNK_CLLI.ISUP_COT_NOTE;
    this.initForm();
    this.initCols();
    this.formGroup.get('trunkMember')?.valueChanges.subscribe(trunkMemberV => {
      this.trunkMemberValue = trunkMemberV;
    });
  }

  initForm() {
    this.formGroup = new FormGroup({
      trunkMember: new FormControl<string | null>('0', [Validators.pattern(/^[0-9]+$/)])
    });
  }

  handleRun() {
    if (this.formGroup.controls['trunkMember'].valid) {
      if (this.trunkClliName) {
        this.runIsupCotTest(this.trunkClliName, this.trunkMemberValue);
        this.formGroup.reset();
      } else {
        this.commonService.showErrorMessage('Invalid Value for Trunk CLLI Field');
      }
    } else {
      this.commonService.showErrorMessage(`${this.trunkMemberValue} is not a decimal`);
    }
  }

  handleCancel() {
    this.formGroup.reset();
  }

  initCols() {
    this.colsISupCotTest = [
      {
        field: FieldName.Checkbox,
        header: '',
        data: [],
        colsEnable: true
      },
      {
        field: 'TrunkMember',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['TrunkMember'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
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
        field: 'ContinuityCondition',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['ContinuityCondition'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'AdditionalInfo',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['AdditionalInfo'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'CallID',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['CallID'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'TestResult',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['TestResult'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: FieldName.Action,
        header: this.translateResults.COMMON.ACTION,
        colsEnable: true,
        colWidth: 30
      }
    ];
  }

  runIsupCotTest(trunkClliValue: string, trunkMemberValue: string) {
    const key = ECommandKey.IcotTest;
    const requestBody = [
      {
        key: ECommandKey.TrunkCLLI,
        value: trunkClliValue
      },
      {
        key: ECommandKey.TrunkMember,
        value: trunkMemberValue ?? '0'
      }
    ];
    this.isInprocess = true;
    const securityInfoParam = `UserID=${this.storageService.userID}`;
    this.maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying(key, requestBody, securityInfoParam).subscribe({
      next: (rs: ISupCotTest) => {
        this.isInprocess = false;
        if(rs[key]?.Error?.Number === EErrorKey.NOT_VALID) {
          this.commonService.showErrorMessage(rs[key]?.Error?.Message);
        } else if (rs[key]?.Members?.Member?.TrunkMember || rs[key]?.Members?.Member?.TrunkMember === 0) {
          this.maintTrunkClliService.summaryDetails.next(rs[key]?.Header);
          this.maintTrunkClliService.handleTableData(rs[key]?.Members?.Member, ERunType.QUERIES, this.colsISupCotTest);
        }
      },
      error: (err: any) => {
        this.isInprocess = false;
        this.commonService.showAPIError(err);
        this.maintTrunkClliService.resetSummaryAndTable();
      }
    });
  }

  onFormSubmit(event: boolean) {
    if (event) {
      this.handleRun();
    } else {
      this.handleCancel();
    }
  }
}
