import { IPageHeader } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  headerData: IPageHeader;
  constructor() {}

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: 'Maintenance'
    };
  }
}
