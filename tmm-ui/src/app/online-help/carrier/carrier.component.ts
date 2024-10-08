import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'rbn-common-lib';

@Component({
  selector: 'app-carrier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./carrier.component.scss']
})
export class CarrierComponent implements OnInit {

  headerData: IPageHeader;

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: 'Maintenance By Carrier'
    };
  }

}
