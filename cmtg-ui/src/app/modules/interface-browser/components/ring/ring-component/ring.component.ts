import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';
import { CommonService } from 'src/app/services/common.service';
import { IRingTemplate } from '../../../models/interface-browser';

@Component({
  selector: 'app-ring',
  templateUrl: './ring.component.html',
  styleUrls: ['./ring.component.scss']
})
export class RingComponent implements OnInit, OnChanges {
  @Input() isAddRing: boolean;
  @Input() identifiers: string[];
  @Output() closeDialogEmitter = new EventEmitter();

  translateResults: any;
  isInprocess = false;
  formGroup: FormGroup;
  primaryButton: string;
  isButtonDisabled = false;
  ringTemplate: IRingTemplate;

  initialFormValues: any;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateInternalService,
    private interfaceBrowserService: InterfaceBrowserService,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initForm();
    this.formGroup.reset();
    this.formGroup.statusChanges.subscribe(status => this.updateButtonStatus());
    this.storeInitialFormValues();
    this.setupControlChangeSubscriptions();
    this.updateButtonStatus();
  }

  storeInitialFormValues() {
    this.initialFormValues = {
      std: this.formGroup.get('std')?.value,
      r: this.formGroup.get('r')?.value
    };
  }

  get r(): FormArray {
    return this.formGroup.get('r') as FormArray;
  }
  get identifier() {
    return this.formGroup.get('identifier');
  }

  get std() {
    return this.formGroup.get('std');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.identifiers && !this.isAddRing) {
      this.getRingTemplate(this.identifiers[0]);
      this.isButtonDisabled = true;
    }

    if (changes['isAddRing'] && changes['isAddRing'].currentValue) {
      this.updateButtonStatus();
    }
  }

  setupControlChangeSubscriptions() {
    this.formGroup.get('std')?.valueChanges.subscribe(() => this.updateButtonStatus());
    this.formGroup.get('r')?.valueChanges.subscribe(() => this.updateButtonStatus());
  }

  updateButtonStatus() {
    if (this.isAddRing) {
      this.isButtonDisabled = this.isAddRing && this.formGroup && this.formGroup.invalid;
    }

    if (!this.isAddRing) {
      this.isButtonDisabled = this.areFormValuesUnchanged();
    }
  }

  initForm() {
    this.formGroup = this.fb.group({
      identifier: ['', Validators.required],
      std: ['', Validators.required],
      r: this.fb.array([])
    });

    for (let i = 1; i < 16; i++) {
      this.r.push(this.fb.control('', Validators.required));
    }
    this.primaryButton = this.isAddRing
      ? this.translateResults.COMMON.ADD
      : this.translateResults.COMMON.SAVE;
  }

  areFormValuesUnchanged(): boolean {
    const currentValues = {
      std: this.formGroup.get('std')?.value,
      r: this.formGroup.get('r')?.value
    };
    return JSON.stringify(this.initialFormValues) === JSON.stringify(currentValues);
  }

  getRingTemplate(ringId: string) {
    this.isInprocess = true;
    this.interfaceBrowserService.getRingTemplate(ringId).subscribe({
      next: (template) => {
        this.isInprocess = false;
        if (template.rc.__value !== 0) {
          this.commonService.showErrorMessage(template.responseMsg);
          return;
        }
        const rings = template.responseData.___v5Ring;
        if (rings.v5ringid === 'DEFAULT') {
          this.std?.disable();
          this.r?.disable();
        } else {
          this.std?.enable();
          this.r?.enable();
        }
        this.r.patchValue([
          rings.r01,
          rings.r02,
          rings.r03,
          rings.r04,
          rings.r05,
          rings.r06,
          rings.r07,
          rings.r08,
          rings.r09,
          rings.r10,
          rings.r11,
          rings.r12,
          rings.r13,
          rings.r14,
          rings.r15
        ]);
        this.std?.patchValue(rings.std);
        this.identifier?.patchValue(rings.v5ringid);
        this.formGroup.markAsPristine();
        this.storeInitialFormValues();
        this.updateButtonStatus();
      },
      error: (err) => {
        this.commonService.showAPIError(err);
        this.isInprocess = false;
      }
    });
  }

  onFormSubmit(confirm: boolean) {
    const rings: any = {};
    for (let i = 0; i < this.r.length; i++) {
      if (i < 9) {
        rings['r0' + (i + 1)] = this.r.at(i).value;
      } else {
        rings['r' + (i + 1)] = this.r.at(i).value;
      }
    };
    if(this.std){
      this.ringTemplate = {
        v5ringid: this.identifier?.value,
        std: this.std.value,
        ...rings
      };
    };

    if (!this.isAddRing) {
      this.modifyRing(confirm);
    } else {
      if (confirm) {
        if (this.identifier?.invalid) {
          this.commonService.showErrorMessage(
            this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.ERROR_MESSAGES
              .IDENTIFIER_REQUIRED
          );
          return;
        }
        this.addRing();
      } else {
        this.closeDialog(false);
      }
    }

  }

  addRing() {
    this.isInprocess = true;
    this.interfaceBrowserService.addNewRing(this.ringTemplate).subscribe({
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

  modifyRing(confirm: boolean) {
    if (this.formGroup.dirty && confirm) {
      this.isInprocess = true;
      this.interfaceBrowserService.modifyRing(this.ringTemplate).subscribe({
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
    if (this.formGroup.dirty && !confirm) {
      this.getRingTemplate(this.identifier?.value);
    }
  }

  handleChangeIdentifier(identifier: string) {
    this.getRingTemplate(identifier);
    this.isButtonDisabled = true;
  }

  closeDialog(isChanged: boolean) {
    this.formGroup.reset();
    this.closeDialogEmitter.emit(isChanged);
  }
}
