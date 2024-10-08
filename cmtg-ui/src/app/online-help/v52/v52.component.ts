import { IPageHeader } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-v52',
  templateUrl: './v52.component.html',
  styleUrls: ['./v52.component.scss']
})
export class V52Component implements OnInit {

  headerData: IPageHeader;
  constructor() {}
  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: 'v5.2'
    };
  }

}
