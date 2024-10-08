import { IPageHeader } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent  implements OnInit {
  headerData: IPageHeader;
  constructor() {}

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: 'Controller'
    };
  }
}
