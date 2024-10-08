import { Component, OnInit } from '@angular/core';
import { ITrunkResponse } from '../../models/maint-trunk-clli';
import { MaintTrunkClliService } from '../../services/maint-trunk-clli.service';

@Component({
  selector: 'app-maint-trunk-summary',
  templateUrl: './maint-trunk-summary.component.html',
  styleUrls: ['./maint-trunk-summary.component.scss']
})
export class MaintTrunkSummaryComponent implements OnInit {
  summaryDetail: ITrunkResponse;

  constructor(private maintTrunkClliService: MaintTrunkClliService) { }

  ngOnInit(): void {
    this.maintTrunkClliService.summaryDetails.subscribe((summary) => {
      this.summaryDetail = summary;
    });
  }

}
