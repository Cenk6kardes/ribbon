import { IPageHeader } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  translateResults: any;
  headerData: IPageHeader;
  constructor(private translateInternalService: TranslateInternalService) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.HELP.OVERVIEW.TITLE
    };
  }
}
