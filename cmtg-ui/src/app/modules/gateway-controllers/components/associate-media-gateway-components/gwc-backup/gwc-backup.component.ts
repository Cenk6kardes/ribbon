import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssociateFormService } from '../../../services/associate-form.service';

@Component({
  selector: 'app-gwc-backup',
  templateUrl: './gwc-backup.component.html',
  styleUrls: ['./gwc-backup.component.scss']
})
export class GwcBackupComponent implements OnInit {
  form: FormGroup;
  constructor(
    private formService: AssociateFormService
  ) {}

  ngOnInit(): void {
    this.form = this.formService.gwcBackup;
    this.formService.gwcBackup.controls['mgcsecipAddress'].disable();
    this.formService.gwcBackup.controls['secipAddress'].disable();
    this.formService.gwcBackup.controls['cac'].disable();
  }

  handleLblCheckBox(event: any) {
    if (event) {
      this.formService.gwcBackup.controls['secipAddress'].addValidators(
        Validators.required
      );
      this.formService.gwcBackup.controls['mgcsecipAddress'].enable();
      this.formService.gwcBackup.controls['secipAddress'].enable();
      this.formService.gwcBackup.controls['cac'].enable();
    } else {
      this.formService.gwcBackup.controls['secipAddress'].removeValidators(
        Validators.required
      );
      this.formService.gwcBackup.controls['mgcsecipAddress'].disable();
      this.formService.gwcBackup.controls['secipAddress'].disable();
      this.formService.gwcBackup.controls['cac'].disable();
    }
    this.formService.gwcBackup.updateValueAndValidity();
  }

  keyPreventFn(event: any) {
    const forbiddenKeyCodes = ['+', 'e', 'E', ',', '-', '.']; // plus, e, comma, minus, dot
    if (forbiddenKeyCodes.includes(event.key)) {
      event.preventDefault();
    }
  }
}
