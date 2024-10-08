import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-provisioning',
  templateUrl: './provisioning.component.html',
  styleUrls: ['./provisioning.component.scss']
})
export class ProvisioningComponent {
  @Input() gwControllerName!: string;
  constructor() {
  }

}
