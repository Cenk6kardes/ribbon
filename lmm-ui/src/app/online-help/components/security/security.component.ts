import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'rbn-common-lib';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  headerData: IPageHeader;

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: 'Security Login'
    };
  }

}
