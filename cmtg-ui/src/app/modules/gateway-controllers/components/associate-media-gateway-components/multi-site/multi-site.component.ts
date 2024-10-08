import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output
} from '@angular/core';
import { IMultiSiteSelection } from '../../../models/gwControllers';
import { AssociateFormService } from '../../../services/associate-form.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-multi-site',
  templateUrl: './multi-site.component.html',
  styleUrls: ['./multi-site.component.scss']
})
export class MultiSiteComponent implements OnChanges, OnDestroy {
  @Input() siteName: string[] = [];
  @Input() maxEndpoints = 0;
  @Output() siteNames = new EventEmitter();
  selectedSiteNames: IMultiSiteSelection[] = [];
  allSiteNames: IMultiSiteSelection[] = [];

  constructor(
    private formService: AssociateFormService,
    private commonService: CommonService
  ) {}

  ngOnDestroy(): void {
    this.formService.gatewayInformation
      .get('reservedTerminations')
      ?.setValue(null);
  }

  ngOnChanges(): void {
    this.allSiteNames = this.siteName.map((item: string) => ({
      name: item
    }));
  }

  calculateMaxEndpoints() {
    const selectedSiteNamesValue = this.selectedSiteNames.length * 1023;
    if (selectedSiteNamesValue >= this.maxEndpoints) {
      const maxSelectableItem = this.maxEndpoints / 1023;
      this.commonService.showErrorMessage(
        `Can not select more than ${maxSelectableItem} site names`
      );
    }
    const siteNames = this.selectedSiteNames.map((siteName) => siteName.name);
    this.siteNames.emit({
      timeout: this.selectedSiteNames.length * 4,
      selectedSiteNames: siteNames
    });
    this.formService.gatewayInformation
      .get('reservedTerminations')
      ?.setValue(selectedSiteNamesValue);
  }
}
