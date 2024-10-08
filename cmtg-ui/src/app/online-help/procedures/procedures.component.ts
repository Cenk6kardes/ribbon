import { IPageHeader } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.scss']
})
export class ProceduresComponent implements OnInit {
  translateResults: any;
  headerData: IPageHeader;
  constructor() {
  }

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: 'Procedures'
    };
  }
}
