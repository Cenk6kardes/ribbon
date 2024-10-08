import { IPageHeader } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  headerData: IPageHeader;
  isInprocess: false;
  translateResults: any;
  constructor(private translateInternalService: TranslateInternalService) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.INTERFACE_BROWSER.MAINTENANCE.TITLE
    };
  }
}
