import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'rbn-common-lib';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  headerData: IPageHeader;

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: 'Lmm Maintenance'
    };
  }
}
