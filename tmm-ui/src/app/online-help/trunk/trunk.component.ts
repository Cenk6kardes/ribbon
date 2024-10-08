import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'rbn-common-lib';

@Component({
  selector: 'app-trunk',
  templateUrl: './trunk.component.html',
  styleUrls: ['./trunk.component.scss']
})
export class TrunkComponent implements OnInit {

  headerData: IPageHeader;

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: ' Maintenance By Trunk CLLI'
    };
  }

}
