import { IPageHeader } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qos-collectors',
  templateUrl: './qos-collectors.component.html',
  styleUrls: ['./qos-collectors.component.scss']
})
export class QosCollectorsComponent implements OnInit {
  headerData: IPageHeader;
  constructor() {}
  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: 'Qos Collectors'
    };
  }
}
