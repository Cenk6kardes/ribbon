import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { IPageTop, IStatusIndicators } from 'rbn-common-lib';
import { CMTG_HELP_URL, PROJECT_NAME } from 'src/app/types/const';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { TopHeaderService } from 'src/app/services/top-header.service';
import { MaintenanceTriggerService } from 'src/app/modules/gateway-controllers/services/maintenance-trigger.service';

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
  statusIndicators: IStatusIndicators[] = [];
  showLogout = false;

  showSwInfoDialog = false;
  swInfoText1: string;
  swInfoText2: string;
  isLoading = false;

  constructor(
    private translateService: TranslateInternalService,
    private titleService: Title,
    private topHeaderService: TopHeaderService,
    private commonService: CommonService,
    private triggerService: MaintenanceTriggerService
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
            label: this.translateResults.SOFTWARE_INFORMATION,
            icon: 'pi pi-info-circle',
            command: () => {
              this.getSoftwareInfo();
            }
          },
          {
            label: this.translateResults.REFRESH_GWC_STATUS,
            icon: 'fa fa-refresh',
            command: () => {
              this.triggerMaintenanceUpdate();
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
            url: `#/${CMTG_HELP_URL}`
          }
        ]
      }
    ];
  }

  getSoftwareInfo() {
    this.isLoading = true;
    this.topHeaderService.getSoftwareInfo().subscribe({
      next: (res: any) => {
        const versionLines = res.split('\n');
        this.swInfoText1 = versionLines[0];
        this.swInfoText2 = versionLines[1];
      },
      error: (err) => {
        this.isLoading = false;
        this.commonService.showAPIError(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
    this.showSwInfoDialog = true;
  }

  closeSwInfoDialog() {
    this.showSwInfoDialog = false;
  }

  triggerMaintenanceUpdate() {
    this.triggerService.triggerMaintenanceUpdate();
  }

  updateProductTitle(clliName?: string) {
    const productInfo = {
      productTitle: clliName ? ('| ' + clliName) : ''
    };
    this.changeTitle(clliName);
    this.pageTop.productInfo = productInfo;
  }

  changeTitle(title?: string): void {
    if (title) {
      this.titleService.setTitle('C20 Management Tools | ' + title);
    } else {
      this.titleService.setTitle('C20 Management Tools');
    }
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
