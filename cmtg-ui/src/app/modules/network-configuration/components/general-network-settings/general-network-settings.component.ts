import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-general-network-settings',
  templateUrl: './general-network-settings.component.html',
  styleUrls: ['./general-network-settings.component.scss']
})
export class GeneralNetworkSettingsComponent implements OnInit {

  @Input() showGeneralNetworkSettings = false;
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  translateResults: any;
  isLoading = false;
  generalNetworkSettingsFormGroup: FormGroup;
  ipAddressZero = 'not configured';
  ipAddressOne = 'not configured';
  toggleStatus = 'Disabled';
  isSaveBtnEnable = false;
  hasInputValueChanged = false;
  previousValue = false;
  previousInputNameValue: string;
  messageText: string;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showErrorDialog = false;
  showDetailsBtn = true;
  btnLabel = 'Show Details';
  showConfirmPopup = false;

  constructor(
    private translateService: TranslateInternalService,
    private networkConfigurationService: NetworkConfigurationService,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initForm();
    this.getCallAgentIPs();
    this.getGWCDomainName();
    this.generalNetworkSettingsFormGroup.get('gwcDomainNameToggleBtn')?.valueChanges.subscribe((isEnable) => {
      if (this.previousValue !== isEnable && isEnable !== null) {
        this.previousValue = isEnable;
        this.checkAndSetStatus(isEnable);
      }
    });
    this.generalNetworkSettingsFormGroup.get('inputName')?.valueChanges.subscribe((inputNameValue) => {
      (this.previousInputNameValue !== inputNameValue && inputNameValue !== null) ?
        this.hasInputValueChanged = true : this.hasInputValueChanged = false;
    });
  }

  initForm() {
    this.generalNetworkSettingsFormGroup = new FormGroup({
      gwcDomainNameToggleBtn: new FormControl<boolean>(false),
      inputName: new FormControl<string | null>({ value: null, disabled: true }, Validators.required)
    });
  }

  checkAndSetStatus(data: any) {
    if (data) {
      this.toggleStatus = this.translateResults.COMMON.ENABLED;
      this.isSaveBtnEnable = true;
      this.generalNetworkSettingsFormGroup.controls['inputName'].setValue( this.previousInputNameValue );
      this.generalNetworkSettingsFormGroup.controls['inputName'].enable();
    } else {
      this.toggleStatus = this.translateResults.COMMON.DISABLED;
      this.isSaveBtnEnable = false;
      this.generalNetworkSettingsFormGroup.controls['inputName'].setValue('');
      this.generalNetworkSettingsFormGroup.controls['inputName'].disable();
    }
  }

  closeGeneralNetworkSettings() {
    this.showGeneralNetworkSettings = false;
    this.closeDialog.emit();
  }

  generalNetworkSettingsFormFooterHandler(event: any) {
    event ? this.showConfirmPopup = true : this.showGeneralNetworkSettings = false;
  }

  showConfirmPopupFooterHandler(event: any) {
    event ? this.updateGWCDomainName() : (this.showConfirmPopup = false);
  }

  closeConfirmPopup() {
    this.showConfirmPopup = false;
  }

  getGWCDomainName() {
    this.isLoading = true;
    this.networkConfigurationService.getGWCDomainName().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.generalNetworkSettingsFormGroup.controls[ 'gwcDomainNameToggleBtn' ].setValue(res ? true : false);
        this.generalNetworkSettingsFormGroup.controls['inputName'].setValue(res);
        this.previousInputNameValue = res;
        this.checkAndSetStatus(res);
      },
      error: (err) => {
        this.isLoading = false;
        this.commonService.showAPIError(err);
      }
    });
  }

  updateGWCDomainName() {
    /*
     * this.isSaveBtnEnable = false and
     * If the user wants to save the input while toggle button is disabled,
     * we must request the backend, input name as an empty string.
     */
    const domainName = this.isSaveBtnEnable ? this.generalNetworkSettingsFormGroup.controls['inputName'].value : '';
    this.isLoading = true;
    this.networkConfigurationService.updateGWCDomainName(domainName).subscribe({
      next: () => {
        this.isLoading = false;
        this.showConfirmPopup = false;
        this.showGeneralNetworkSettings = false;
        this.getGWCDomainName();
      },
      error: (err: any) => {
        this.isLoading = false;
        /*
         * updateGWCDomainName function correctly update inputName, but backend returns error, same with the old gui
         * so, we handle the logic as same as old gui.
         */
        this.showConfirmPopup = false;
        const messageAndDetails = JSON.stringify(err.error.message);
        const parsedData = messageAndDetails.split('details = ');
        this.messageText = parsedData[0].split('"message = ')[1]
          .replace(this.reg, '<br>');
        this.detailsText = parsedData[1].split('"')[0].replace(this.reg, '<br>')
          .replace(this.tabReg, ' &emsp;');
        this.showErrorDialog = true;
      }
    });
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
    this.showDetailsBtn = true;
    this.showGeneralNetworkSettings = false;
  }

  getCallAgentIPs() {
    this.isLoading = true;
    this.networkConfigurationService.getCallAgentIP().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.ipAddressZero = res[0] ? res[0] : 'not configured';
        this.ipAddressOne = res[1] ? res[1] : 'not configured';
      },
      error: (err) => {
        this.isLoading = false;
        this.commonService.showAPIError(err);
      }
    });
  }
}
