import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssociateFormService } from '../../../services/associate-form.service';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-gr-gateway-info',
  templateUrl: './gr-gateway-info.component.html',
  styleUrls: ['./gr-gateway-info.component.scss']
})
export class GrGatewayInfoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  showDialog = false;
  options: string[] = [];
  constructor(
    private formService: AssociateFormService,
    private gwcService: GatewayControllersService,
    private commonService: CommonService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getOptions();
  }

  initForm() {
    const gr = this.fb.group({
      gatewayName: ['', { nonNullable: true }]
    });
    this.formService.mainFormGroup.addControl('gr', gr);
    this.form = this.formService.mainFormGroup.get('gr') as FormGroup;
    this.formService.mainFormGroup.updateValueAndValidity();
  }

  handleGatewayNameChange(option: string) {
    if (option === 'button') {
      this.form.reset();
      this.showDialog = true;
    }
  }

  getOptions() {
    this.gwcService
      .getGrGwTypeByProfile(
        this.formService.gatewayInformation.get('profileName')?.value
      )
      .subscribe({
        next: (GrType) => {
          this.gwcService.getGrGwNamesByType(GrType).subscribe({
            next: (res) => {
              this.options = [...res, 'button'];
            },
            error: (err) => {
              this.commonService.showAPIError(err);
            }
          });
        },
        error: (err) => {
          this.commonService.showAPIError(err);
        }
      });
  }

  isButton(item: string) {
    return item === 'button';
  }

  closeDialog() {
    this.showDialog=false;
    this.getOptions();
  }

  ngOnDestroy(): void {
    this.formService.mainFormGroup.removeControl('gr');
    this.formService.mainFormGroup.updateValueAndValidity();
  }
}
