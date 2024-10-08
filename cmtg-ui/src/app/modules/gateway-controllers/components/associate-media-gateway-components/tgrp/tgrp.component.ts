import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssociateFormService } from '../../../services/associate-form.service';
import { CommonService } from 'src/app/services/common.service';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';

@Component({
  selector: 'app-tgrp',
  templateUrl: './tgrp.component.html',
  styleUrls: ['./tgrp.component.scss']
})
export class TgrpComponent implements OnInit, OnDestroy {
  form: FormGroup;
  switchButton = 'COMMON.DISABLED';
  tgrpDisabled = true;
  tgrpOptions: string[] = [];
  constructor(
    private formService: AssociateFormService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private gwcService: GatewayControllersService
  ) {
    this.initForm();
  }

  initForm() {
    const tgrp = this.fb.group({
      tgrp: [false],
      tgrpName: [{ value: '', disabled: true }]
    });
    this.formService.mainFormGroup.addControl('tgrp', tgrp);
    this.form = this.formService.mainFormGroup.get('tgrp') as FormGroup;
    this.formService.mainFormGroup.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.getTGRPOptions();
  }

  getTGRPOptions() {
    const gwcName =
      this.formService.gatewayInformation.get('controllerName')?.value;
    this.gwcService.getTgrp(gwcName).subscribe({
      next: (res) => {
        this.tgrpOptions = res;
      },
      error: (err) => {
        this.commonService.showAPIError(err);
      }
    });
  }

  handleSwitch(value: boolean) {
    if (value) {
      this.switchButton = 'COMMON.ENABLED';
      this.form.get('tgrpName')?.enable();
    } else {
      this.switchButton = 'COMMON.DISABLED';
      this.form.get('tgrpName')?.disable();
      this.form.reset();
    }
    this.formService.mainFormGroup.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.formService.mainFormGroup.removeControl('tgrp');
  }
}
