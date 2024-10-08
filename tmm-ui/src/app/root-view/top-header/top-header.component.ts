import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { IPageTop } from 'rbn-common-lib';

import { PROJECT_NAME, TMM_HELP_URL } from 'src/app/types/const';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss']
})
export class TopHeaderComponent implements OnInit {

  @Output() confirmAgreeLogout = new EventEmitter();

  translateResults: any;
  isShowPreferences = false;

  pageTop: IPageTop;
  showLogout = false;

  constructor(
    private translateService: TranslateInternalService
  ) {
    this.translateResults = this.translateService.translateResults.PROFILE;
  }

  ngOnInit(): void {
    this.initTopbar();
  }

  initTopbar() {
    this.pageTop = {
      logo: {
        productName: PROJECT_NAME,
        noneUppercase: true
      },
      productInfo: {
        productTitle: ''
      },
      profiles: this.generateProfiles()
    };
  }

  generateProfiles(): MenuItem[] {
    return [
      {
        label: 'Admin',
        icon: 'fa fa-user-circle',
        expanded: true,
        items: [
          {
            label: this.translateResults.PREFERENCES,
            icon: 'pi pi-cog',
            command: () => {
              this.isShowPreferences = true;
            }
          },
          {
            label: this.translateResults.LOGOUT,
            icon: 'pi pi-sign-out',
            command: () => {
              this.showLogout = true;
            }
          }
        ]
      },
      {
        label: this.translateResults.HELP_CENTER,
        icon: 'fa fa-question-circle',
        expanded: true,
        items: [
          {
            label: this.translateResults.HELP,
            icon: 'pi pi-file',
            url: '#/help'
          }
        ]
      }
    ];
  }

  onHidePreferences() {
    this.isShowPreferences = false;
  }

  confirmLogout($event: boolean) {
    if ($event) {
      this.confirmAgreeLogout.emit();
    } else {
      this.showLogout = false;
    }
  }
}
