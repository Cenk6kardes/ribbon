import {
  AttenOptionsData,
  ISigTemplate,
  LroaOptionsData,
  RngtypeOptionsData,
  SuppindOptionsData,
  TrueFalseOptions
} from './../../../models/interface-browser';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { SelectItem } from 'primeng/api';
import { InterfaceBrowserService } from 'src/app/modules/interface-browser/services/interface-browser.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-sig-options',
  templateUrl: './sig-options.component.html',
  styleUrls: ['./sig-options.component.scss']
})
export class SigOptionsComponent implements OnInit, OnChanges {
  @Input() isAddSig: boolean;
  @Input() identifiers: string[];
  @Output() closeDialogEmitter = new EventEmitter();
  translateResults: any;
  isButtonDisabled = false;
  primaryButton: string;

  isInprocess = false;
  attenOptions: SelectItem[];
  trueFalseOptions: SelectItem[];
  suppindOptions: SelectItem[];
  lroaOptions: SelectItem[];
  rngtypeOptions: SelectItem[];

  sigItems: ISigTemplate = {
    v5sigid: '',
    atten: 0,
    apa: false,
    plf: false,
    ds1flash: false,
    eoc: false,
    suppind: 0,
    plsdur: '',
    mtrpn: false,
    lroa: 0,
    lrosfd: false,
    rngtype: 0,
    ssonhook: false
  };

  constructor(
    private translateService: TranslateInternalService,
    private interfaceBrowserService: InterfaceBrowserService,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.sigItems = {
      v5sigid: '',
      atten: 0,
      apa: false,
      plf: false,
      ds1flash: false,
      eoc: false,
      suppind: 0,
      plsdur: '',
      mtrpn: false,
      lroa: 0,
      lrosfd: false,
      rngtype: 0,
      ssonhook: false
    };
    this.initOptions();
    this.primaryButton = this.isAddSig
      ? this.translateResults.COMMON.ADD
      : this.translateResults.COMMON.SAVE;
  }

  getSigTemplate(v5sigid: string) {
    this.isInprocess = true;
    this.interfaceBrowserService.getSigTemplate(v5sigid).subscribe({
      next: (response) => {
        if (response.rc.__value !== 0) {
          this.commonService.showErrorMessage(response.responseMsg);
          this.isInprocess = false;
          return;
        }
        const template = response.responseData.___v5Sig;
        this.sigItems = {
          ...template,
          atten: template.atten.__value,
          suppind: template.suppind.__value,
          lroa: template.lroa.__value,
          rngtype: template.rngtype.__value
        };
        this.isInprocess = false;
      },
      error: (err) => {
        this.commonService.showAPIError(err);
        this.isInprocess = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.identifiers && !this.isAddSig) {
      this.getSigTemplate(this.identifiers[0]);
      this.isButtonDisabled = true;
    }
  }

  handleChangeIdentifier(identifier: string) {
    if (!this.isAddSig) {
      this.getSigTemplate(identifier);
      this.isButtonDisabled = identifier === this.identifiers[0] ? true : false;
    }
  }

  initOptions() {
    this.attenOptions = [
      {
        label: AttenOptionsData.NONE.label,
        value: AttenOptionsData.NONE.value
      },
      {
        label: AttenOptionsData.DIGITAL.label,
        value: AttenOptionsData.DIGITAL.value
      },
      {
        label: AttenOptionsData.ANALOG.label,
        value: AttenOptionsData.ANALOG.value
      }
    ];
    this.trueFalseOptions = [
      {
        label: TrueFalseOptions.N.label,
        value: TrueFalseOptions.N.value
      },
      {
        label: TrueFalseOptions.Y.label,
        value: TrueFalseOptions.Y.value
      }
    ];
    this.suppindOptions = [
      {
        label: SuppindOptionsData.NO_SUPP.label,
        value: SuppindOptionsData.NO_SUPP.value
      },
      {
        label: SuppindOptionsData.LE_SUPP.label,
        value: SuppindOptionsData.LE_SUPP.value
      },
      {
        label: SuppindOptionsData.TE_SUPP.label,
        value: SuppindOptionsData.TE_SUPP.value
      },
      {
        label: SuppindOptionsData.LE_TE_SUPP.label,
        value: SuppindOptionsData.LE_TE_SUPP.value
      }
    ];
    this.rngtypeOptions = [
      {
        label: RngtypeOptionsData.C6F.label,
        value: RngtypeOptionsData.C6F.value
      },
      {
        label: RngtypeOptionsData.C3D.label,
        value: RngtypeOptionsData.C3D.value
      },
      {
        label: RngtypeOptionsData.C3C.label,
        value: RngtypeOptionsData.C3C.value
      }
    ];
    this.lroaOptions = [
      {
        label: LroaOptionsData.N.label,
        value: LroaOptionsData.N.value
      },
      {
        label: LroaOptionsData.Y.label,
        value: LroaOptionsData.Y.value
      },
      {
        label: LroaOptionsData.CHKLN.label,
        value: LroaOptionsData.CHKLN.value
      }
    ];
  }

  onFormSubmit(confirm: boolean) {
    if (!this.isAddSig) {
      this.modifySig(confirm);
    } else {
      if (confirm) {
        if (!this.sigItems.v5sigid) {
          this.commonService.showErrorMessage(
            this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.ERROR_MESSAGES
              .IDENTIFIER_REQUIRED
          );
          return;
        }
        this.addSig();
      } else {
        this.closeDialog(false);
      }
    }
  }

  addSig() {
    this.isInprocess = true;
    this.interfaceBrowserService.addNewSig(this.sigItems).subscribe({
      next: (response: any) => {
        this.isInprocess = false;
        if (response.rc.__value !== 0) {
          this.commonService.showErrorMessage(response.responseMsg);
          return;
        }
        const mssg = this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.FIELD_LABEL.SUCCESS.replace(/{{action}}/, 'added');
        this.commonService.showSuccessMessage(mssg);
        this.closeDialog(true);
      },
      error: (err) => {
        this.commonService.showAPIError(err);
        this.isInprocess = false;
      }
    });
  }

  modifySig(confirm: boolean) {
    if (confirm) {
      this.isInprocess = true;
      this.interfaceBrowserService.modifySig(this.sigItems).subscribe({
        next: (response) => {
          this.isInprocess = false;
          if (response.rc.__value !== 0) {
            this.commonService.showErrorMessage(response.responseMsg);
            return;
          }
          const mssg = this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.FIELD_LABEL.SUCCESS.replace(/{{action}}/, 'modified');
          this.commonService.showSuccessMessage(mssg);
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          this.isInprocess = false;
        }
      });
    }
    if (!confirm) {
      this.getSigTemplate(this.sigItems.v5sigid);
    }
  }

  closeDialog(isChanged: boolean) {
    this.closeDialogEmitter.emit(isChanged);
    this.sigItems = {
      v5sigid: '',
      atten: 0,
      apa: false,
      plf: false,
      ds1flash: false,
      eoc: false,
      suppind: 0,
      plsdur: '',
      mtrpn: false,
      lroa: 0,
      lrosfd: false,
      rngtype: 0,
      ssonhook: false
    };
  }
}
