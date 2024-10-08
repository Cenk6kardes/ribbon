import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssociateFormService } from '../../../services/associate-form.service';

@Component({
  selector: 'app-signalling-gateway',
  templateUrl: './signalling-gateway.component.html',
  styleUrls: ['./signalling-gateway.component.scss']
})
export class SignallingGatewayComponent implements OnInit, OnDestroy {
  form: FormGroup;
  switchButton = 'COMMON.DISABLED';
  constructor(
    private formService: AssociateFormService,
    private fb: FormBuilder
  ) {}

  initForm() {
    const signallingGateway = this.fb.group({
      enable_disable: [false],
      ip: [{ value: '', disabled: true }, { nonNullable: true }],
      port1: [{ value: null, disabled: true }, { nonNullable: true }],
      port2: [{ value: null, disabled: true }, { nonNullable: true }]
    });
    this.formService.mainFormGroup.addControl(
      'signallingGateway',
      signallingGateway
    );
    this.form = this.formService.mainFormGroup.get(
      'signallingGateway'
    ) as FormGroup;
    this.formService.mainFormGroup.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.initForm();
  }

  handleSwitch(value: boolean) {
    if (value) {
      this.switchButton = 'COMMON.ENABLED';
      this.form
        .get('ip')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^\S*$/),
          Validators.pattern(
            /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
          )
        ]);
      this.form
        .get('port1')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^\S*$/),
          Validators.min(1),
          Validators.max(65535)
        ]);
      this.form
        .get('port2')
        ?.setValidators([
          Validators.pattern(/^\S*$/),
          Validators.min(1),
          Validators.max(65535)
        ]);
      this.form.get('ip')?.enable();
      this.form.get('port1')?.enable();
      this.form.get('port2')?.enable();
    } else {
      this.form.reset();
      this.switchButton = 'COMMON.DISABLED';
      this.form.get('port1')?.removeValidators(Validators.required);
      this.form.get('ip')?.removeValidators(Validators.required);
      this.form.get('ip')?.disable();
      this.form.get('port1')?.disable();
      this.form.get('port2')?.disable();
    }
    this.form.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.formService.mainFormGroup.removeControl('signallingGateway');
  }
}
