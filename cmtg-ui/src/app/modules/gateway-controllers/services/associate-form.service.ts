import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AssociateFormService {
  mainFormGroup: FormGroup;
  constructor(private fb: FormBuilder) {
    this.mainFormGroup = this.fb.group({
      gatewayInformation: this.fb.group({
        name: ['',Validators.required],
        ipAddress: [null, [Validators.pattern(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)]],
        controllerName: ['', { nonNullable: true }],
        profileName: [
          '',
          { nonNullable: true, validators: Validators.required }
        ],
        reservedTerminations: [null],
        pep_alg: [''],
        isNodeSharing:[false, { nonNullable: true }]
      }),
      signalProtocol: this.fb.group({
        protocolType: ['', Validators.required],
        protocolPort: [
          null,
          [Validators.required, Validators.min(0), Validators.max(65535)]
        ],
        protocolVersion: [{ value: '', disabled: true }, Validators.required]
      }),
      gwcBackup: this.fb.group({
        lbl: [false],
        mgcsecipAddress: ['',[Validators.pattern(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)]],
        secipAddress: ['',[Validators.pattern(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)]],
        cac: ['',[Validators.min(0), Validators.max(9)]]
      })
    });
  }

  get gatewayInformation(): FormGroup {
    return this.mainFormGroup.get('gatewayInformation') as FormGroup;
  }

  get signalProtocol(): FormGroup {
    return this.mainFormGroup.get('signalProtocol') as FormGroup;
  }

  get gwcBackup(): FormGroup {
    return this.mainFormGroup.get('gwcBackup') as FormGroup;
  }
}
