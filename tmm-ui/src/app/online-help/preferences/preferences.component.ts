import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'rbn-common-lib';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  headerData: IPageHeader;

  ngOnInit(): void {
    this.initPageHeader();
  }

  initPageHeader() {
    this.headerData = {
      title: 'Setting the TMM Auto Refresh value'
    };
  }

}
