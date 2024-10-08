import { Component, Input } from '@angular/core';
import { ISummaryData } from '../../models/maint-gateways-carrier';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  @Input() summaryData: ISummaryData;

  constructor() { }

}
