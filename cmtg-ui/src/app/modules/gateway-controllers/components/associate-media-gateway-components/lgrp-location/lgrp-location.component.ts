import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { AssociateFormService } from '../../../services/associate-form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lgrp-location',
  templateUrl: './lgrp-location.component.html',
  styleUrls: ['./lgrp-location.component.scss']
})
export class LgrpLocationComponent implements OnChanges, OnDestroy {
  @Input() endpointNumber: number;
  form: FormGroup;
  isRequired=true;
  constructor(
    private formService: AssociateFormService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm() {
    const lgrpLocation = this.fb.group({
      frameNumber: [null, [Validators.required, Validators.min(0), Validators.max(2047)]],
      unitNumber: [null, [Validators.required, Validators.min(0), Validators.max(9)]],
      frameType: [''],
      unitPosition: [''],
      floorPosition: [''],
      rowPosition: [''],
      framePosition: ['']
    });
    this.formService.mainFormGroup.addControl('lgrpLocation', lgrpLocation);
    this.form = this.formService.mainFormGroup.get('lgrpLocation') as FormGroup;
    this.formService.mainFormGroup.updateValueAndValidity();
  }

  get getFrameNumber(){
    return this.form.get('frameNumber');
  }

  get getUnitNumber(){
    return this.form.get('unitNumber');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['endpointNumber'] && this.endpointNumber) {
      if (this.endpointNumber !== 8) {
        this.isRequired=false;
        this.form.reset();
        this.form.get('frameNumber')?.disable();
        this.form.get('unitNumber')?.disable();
        this.form.updateValueAndValidity();
      } else{
        this.isRequired=true;
        this.form.reset();
        this.form.get('frameNumber')?.enable();
        this.form.get('unitNumber')?.enable();
        this.form.updateValueAndValidity();
      }
    }
  }

  ngOnDestroy(): void {
    this.formService.mainFormGroup.removeControl('lgrpLocation');
  }
}
