/* eslint no-bitwise: ["error", { "allow": ["<<",">>"] }] */
import { ItemDropdown } from 'rbn-common-lib';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { IDQoSConfData, IDQoSTableData, mapDsFieldToName, mapDsFieldToNumber } from '../models/dqos-configuration';

@Component({
  selector: 'app-dqos-configuration',
  templateUrl: './dqos-configuration.component.html',
  styleUrls: ['./dqos-configuration.component.scss']
})
export class DqosConfigurationComponent implements OnInit {

  translateResults: any;
  isLoading = false;
  formGroup: FormGroup;
  dsFieldDataItems: ItemDropdown[];
  showValidationInfoDialog = false;
  data: IDQoSTableData;
  title = '';
  content = '';

  empty_policy = false;
  undefinedDsField = '';

  showEditErrorDialog = false;
  errorData: {
    errorCode: string,
    message: string
  };
  messageText: string;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showDetailsBtn = true;

  constructor(
    private translateService: TranslateInternalService,
    private networkConfigurationService: NetworkConfigurationService,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.content = this.translateResults.CODEC_PROFILE.DQOS_CONF.INFO;
    this.initForm();
    this.setDropDownItem();
    this.getDQoSConf();
  }

  initForm() {
    this.formGroup = new FormGroup({
      dsField: new FormControl<string | null>(null),
      t1Value: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(65535),
        Validators.pattern(/^[0-9]{1,5}$/)]),
      keepAliveTimer: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(65535),
        Validators.pattern(/^[0-9]{1,5}$/)]),
      t7Value: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(65535),
        Validators.pattern(/^[0-9]{1,5}$/)]),
      t8Value: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(65535),
        Validators.pattern(/^[0-9]{1,5}$/)])
    });
  }

  setDropDownItem() {
    const dsFieldRateData = [
      'Default (Best Effort) Forwarding - CS0 and DE (000 000)',
      'Class of Service - CS1 (001000)',
      'Assured Forwarding - AF11 (001010)',
      'Assured Forwarding - AF12 (001100)',
      'Assured Forwarding - AF13 (001110)',
      'Class of Service - CS2 (010000)',
      'Assured Forwarding - AF21 (010010)',
      'Assured Forwarding - AF22 (010100)',
      'Assured Forwarding - AF23 (010110)',
      'Class of Service - CS3 (011000)',
      'Assured Forwarding - AF31 (011010)',
      'Assured Forwarding - AF32 (011100)',
      'Assured Forwarding - AF33 (011110)',
      'Class of Service - CS4 (100000)',
      'Assured Forwarding - AF41 (100010)',
      'Assured Forwarding - AF42 (100100)',
      'Assured Forwarding - AF43 (100110)',
      'Class of Service - CS5 (101000)',
      'Expedited Forwarding - EF (101110)',
      'Class of Service - CS6 (110000)',
      'Class of Service - CS7 (111000)'
    ];
    this.dsFieldDataItems = this.mapDataForDropDown(dsFieldRateData, 'dsField');
  }

  mapDataForDropDown(data: string[], formName: string) {
    const dropdownDataItems = data.map((item: string) => ({
      label: item,
      value: item
    }));
    return dropdownDataItems;
  }

  closeValidationInfoDialog() {
    this.showValidationInfoDialog = false;
  }


  onFormSubmit(event: any) {
    if (event) {//
      const t1ValueControl = this.formGroup.get('t1Value');
      const keepAliveTimerControl = this.formGroup.get('keepAliveTimer');
      const t7ValueControl = this.formGroup.get('t7Value');
      const t8ValueControl = this.formGroup.get('t8Value');

      if (t1ValueControl?.invalid || keepAliveTimerControl?.invalid || t7ValueControl?.invalid || t8ValueControl?.invalid) {
        this.showValidationInfoDialog = true;
      } else {
        this.saveDQoSConf();
      }
    } else {
      this.getDQoSConf();
    }
  }

  // get DQoS Configuration
  getDQoSConf() {
    this.isLoading = true;
    this.networkConfigurationService.getDQoSConf().subscribe({
      next: (res: IDQoSConfData) => {
        this.isLoading = false;
        this.data = this.setDataForUI(res);
        this.formGroup.setValue({
          dsField: this.data.dsField,
          t1Value: this.data.t1Value,
          keepAliveTimer: this.data.keepAliveTimer,
          t7Value: this.data.t7Value,
          t8Value: this.data.t8Value
        });
      },
      error: (error: any) => {
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
  }

  // Change DQoS Configuration
  saveDQoSConf() {
    const data = this.setDataForApi();

    this.isLoading = true;
    this.networkConfigurationService.saveDQoSConf(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.getDQoSConf();
      }, error: (error: any) => {
        this.isLoading = false;
        const checkExceptionText = this.translateResults.CODEC_PROFILE.DQOS_CONF.EDIT.CHECK_EXCEPTION_TEXT;
        const resErrorCode = error?.errorCode || error?.error?.errorCode;
        this.errorData = error?.error || error;

        const messageAndDetails = JSON.stringify(this.errorData?.message);
        const parsedData = messageAndDetails.split('details = ');

        this.detailsText = parsedData[1].split('"')[0].replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' );
        if(this.detailsText.includes(checkExceptionText)) {
          if (resErrorCode === '13') {
            this.messageText = this.translateResults.CODEC_PROFILE.DQOS_CONF.EDIT.EDIT_ERROR_MESSAGE_CODE_13;
            const parsedMessageData = parsedData[0].split('message = ');
            this.detailsText = parsedMessageData[1].replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' );
          } else {
            this.messageText = this.translateResults.CODEC_PROFILE.DQOS_CONF.EDIT.EDIT_ERROR_MESSAGE_CODE_FAIL;
          }
        } else if (resErrorCode === '500') {
          this.messageText = this.translateResults.CODEC_PROFILE.DQOS_CONF.EDIT.EDIT_ERROR_MESSAGE_CODE_500;
        } else {
          this.messageText = this.translateResults.CODEC_PROFILE.DQOS_CONF.EDIT.EDIT_ERROR_MESSAGE_CODE_FAIL;
          const parsedMessageData = parsedData[0]?.split('message = ');
          this.detailsText = (!this.detailsText || this.detailsText === '') ?
            parsedMessageData[1]?.replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' ) : this.detailsText;
        }
        this.showEditErrorDialog = true;

        this.getDQoSConf();
      }
    });
  }

  closeEditErrorDialog() {
    this.showEditErrorDialog = false;
    this.showDetailsBtn = true;
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  setDataForApi() {
    const formDsFieldValue = this.formGroup.controls['dsField'].value;
    if (this.isBinary(formDsFieldValue)) {
      // need to convert decimal number if dsField comes binary
      this.formGroup.controls['dsField'].setValue(parseInt(formDsFieldValue, 2));
    }

    const setDsFieldToNumber = mapDsFieldToNumber[this.formGroup.controls['dsField'].value];
    const newDsField = (setDsFieldToNumber ? setDsFieldToNumber : this.formGroup.controls['dsField'].value) << 2;
    this.formGroup.controls['dsField'].setValue(newDsField);
    const data: IDQoSConfData = {
      dsField: this.formGroup.get('dsField')?.value,
      t1Value: parseInt(this.formGroup.get('t1Value')?.value, 10),
      t2Value: 0,
      keepAliveTimer: parseInt(this.formGroup.get('keepAliveTimer')?.value, 10),
      t7Value: parseInt(this.formGroup.get('t7Value')?.value, 10),
      t8Value: parseInt(this.formGroup.get('t8Value')?.value, 10)
    };
    return data;
  }

  setDataForUI(res: IDQoSConfData) {
    if (this.isBinary(res.dsField)) {
      // need to convert decimal number if dsField comes binary
      res.dsField = parseInt((res.dsField).toString(), 2);
    }
    if((res.dsField >> 2) === 0 && res.keepAliveTimer === 0) {
      this.empty_policy = true;
    }
    const data = {
      dsField: this.empty_policy ? null : (mapDsFieldToName[res.dsField >> 2] || this.setDsField(res)),
      t1Value: this.empty_policy ? null : res.t1Value,
      keepAliveTimer: this.empty_policy ? null : res.keepAliveTimer,
      t7Value: this.empty_policy ? null : res.t7Value,
      t8Value: this.empty_policy ? null : res.t8Value
    };
    return data;
  }

  private setDsField(res: IDQoSConfData): string {
    this.undefinedDsField = (res.dsField >> 2).toString(2);
    return this.undefinedDsField;
  }

  private isBinary(str: any): boolean {
    return /^[01]+$/.test(str.toString());
  }
}
