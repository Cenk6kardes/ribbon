import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'rbn-common-lib';

@Component({
  selector: 'app-gateway-name',
  templateUrl: './gateway-name.component.html',
  styleUrls: ['./gateway-name.component.scss']
})
export class GatewayNameComponent implements OnInit {

  headerData: IPageHeader;

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: 'Maintenance By Gateway Name'
    };
  }

}
