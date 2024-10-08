import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'rbn-common-lib';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  headerData: IPageHeader;

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: 'Lmm Reports'
    };
  }
}
