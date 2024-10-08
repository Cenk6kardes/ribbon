import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IPageHeader } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { ILineValidateResponseInfo } from 'src/app/shared/models/line-maintenance-manager';
import { PREFIX_URL } from 'src/app/types/const';
import { ACTION_TYPES } from '../../models/home';

@Component({
  selector: 'app-bulk-details',
  templateUrl: './bulk-details.component.html',
  styleUrls: ['./bulk-details.component.scss']
})
export class BulkDetailsComponent implements OnInit {

  headerData: IPageHeader;
  translateResults: any;
  bulkItems: ILineValidateResponseInfo[];
  type: number;
  closedCards: number[] = [];

  constructor(
    private translateService: TranslateInternalService,
    private router: Router
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    if (history.state.data) {
      this.bulkItems = history.state.data;
      this.type = history.state.type;
      let header = this.translateResults.HOME.HOME;
      switch (this.type) {
        case ACTION_TYPES.PROPERTIES_TYPE:
          header = this.translateResults.HOME.ACTION_TITLE.PROPERTIES;
          break;
        case ACTION_TYPES.QDN_TYPE:
          header = this.translateResults.HOME.ACTION_TITLE.QUERY_DN;
          break;
        case ACTION_TYPES.QSIP_TYPE:
          header = this.translateResults.HOME.ACTION_TITLE.QUERY_SIP;
          break;
      }

      this.headerData = {
        title: history.state.data.length > 1 ? header : history.state.data[0].cm_dn,
        breadcrumb: [{
          label: this.translateResults.HOME.HOME,
          command: () => {
            this.onBack();
          }
        },
        { label: header }
        ]
      };
    } else {
      this.onBack();
    }
  }

  onBack() {
    this.router.navigate([PREFIX_URL + '/home']);
  }

  returnZero() {
    return 0;
  }

  closeCardsOrRoute(i: number) {
    this.closedCards.push(i);
    if (this.closedCards.length === history.state.data.length) {
      this.router.navigate([PREFIX_URL + '/home']);
    }
  }
}
