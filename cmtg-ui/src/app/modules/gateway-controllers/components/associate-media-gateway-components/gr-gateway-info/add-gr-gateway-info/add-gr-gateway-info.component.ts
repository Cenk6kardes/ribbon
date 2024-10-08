import { ItemDropdown } from 'rbn-common-lib';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NetworkConfigurationService } from 'src/app/modules/network-configuration/services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IGRGWs } from 'src/app/modules/network-configuration/components/network/models/gr-gateways';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-add-gr-gateway-info',
  templateUrl: './add-gr-gateway-info.component.html',
  styleUrls: ['./add-gr-gateway-info.component.scss']
})
export class AddGrGatewayInfoComponent implements OnInit {
  @Input() showAddDialog: boolean;
  @Output() closeDialogEmitter: EventEmitter<void> = new EventEmitter<void>();
  disableSave = true;
  isLoading = false;
  dropDownDataItems: ItemDropdown[];
  grGWFormGroup: FormGroup;
  translateResults: any;
  errorData: {
    errorCode: string;
    message: string;
  };
  showDetailsBtn = true;
  showErrorDialog = false;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  messageText: string;
  messageTextDetail: string;
  constructor(
    private networkConfigurationService: NetworkConfigurationService,
    private commonService: CommonService,
    private translateService: TranslateInternalService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  initForm() {
    this.grGWFormGroup = new FormGroup({
      g6Name: new FormControl<string | null>(null, Validators.required),
      type: new FormControl<string | null>(null, Validators.required),
      ipAddress: new FormControl<string | null>(null, [
        Validators.required,
        Validators.pattern(
          '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)'
        )
      ]),
      port: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(65535),
        Validators.pattern(/^[0-9]{1,5}$/)
      ]),
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

  ngOnInit(): void {
    this.initForm();
    this.addNewGRBtn();
  }

  closeAddDialogAndDeleteFormValue() {
    this.closeDialogEmitter.emit();
    this.setFormValueToDefault();
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

  addNewGRBtn() {
    this.isLoading = true;
    this.networkConfigurationService.getGWType().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.dropDownDataItems = res.map((item: string) => ({
          label: item,
          value: item
        }));
        if (this.dropDownDataItems.length > 0) {
          this.grGWFormGroup.controls['type'].setValue(
            this.dropDownDataItems[0].value
          );
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
  }
  addGRGWFormFooterHandler(event: boolean) {
    event
      ? this.addGRGW(this.grGWFormGroup.value)
      : this.closeAddDialogAndDeleteFormValue();
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
    this.showDetailsBtn = true;
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  addGRGW(data: IGRGWs) {
    this.isLoading = true;
    this.networkConfigurationService.addGRGW(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.commonService.showSuccessMessage(
          this.translateResults.NETWORK.GR_GATEWAYS.ADD_GR
            .GRGW_ADDED_SUCCESSFULLY
        );
        this.closeAddDialogAndDeleteFormValue();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorData = error?.error || error;
        const messageAndDetails = JSON.stringify(this.errorData?.message);
        const parsedData = messageAndDetails.split('details = ');
        this.detailsText = parsedData[1]
          .replace(this.reg, '<br>')
          .replace(this.tabReg, ' &emsp;');
        this.messageTextDetail = parsedData[0]
          .split('"message = ')[1]
          .replace(this.reg, '<br>');
        this.messageText = `${this.translateResults.NETWORK.GR_GATEWAYS.ADD_GR.GRGW_ADD_FAILED} 
        "${data.g6Name}" 
        ${this.translateResults.NETWORK.GR_GATEWAYS.ADD_GR.FAILED_MESSAGE}`;

        this.showErrorDialog = true;
      }
    });
  }
}
