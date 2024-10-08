import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Title } from '@angular/platform-browser';

import { IPageTop, IStatusIndicators, Status } from 'rbn-common-lib';

import { PROJECT_NAME, LMM_HELP_URL } from 'src/app/types/const';
import { LineMaintenanceManagerService } from 'src/app/services/api/line-maintenance-manager.service';
import { StorageService } from 'src/app/services/storage.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { StatusLogService } from 'src/app/services/status-log.service';
import { StatusIndicatorsService } from 'src/app/modules/home/services/status-indicators.service';

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

  constructor(
    private translateService: TranslateInternalService,
    private storageService: StorageService,
    private lmmService: LineMaintenanceManagerService,
    private titleService: Title,
    private commonService: CommonService,
    private statusLogService: StatusLogService,
    private statusIndicatorsService: StatusIndicatorsService
  ) {
    this.translateResults = this.translateService.translateResults.PROFILE;
  }

  ngOnInit(): void {
    this.statusIndicators = this.statusIndicatorsService.statusIndicators;
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
    this.updateTopbarData();
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
        label: this.translateResults.SYSTEM_INFORMATION,
        icon: 'fa fa-exclamation-circle',
        expanded: true,
        items: [
          {
            label: 'CBMg IP: ' + this.storageService.cBMgIP
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

  updateTopbarData() {
    this.lmmService.getCBMgIP().subscribe(
      (cBMgIP) => {
        this.storageService.cBMgIP = cBMgIP;
        this.statusIndicatorsService.updateStatus(0, Status.SUCCESS);

        this.pageTop.profiles = this.generateProfiles();

        this.statusLogService.pushLogs(
          'VRB: Connected to LMM Server instance'
        );
        this.statusLogService.pushLogs('VRB: LMM Server OK');
        this.statusLogService.pushLogs(
          'VRB: LMM Client: connecting to GWC-EM proxy'
        );
        this.statusLogService.pushLogs(
          'VRB: LMM Client: connecting to NV proxy'
        );
        this.statusLogService.pushLogs(
          'VRB: Querying LMM Server for the default CBMg IP...'
        );
        this.statusLogService.pushLogs(
          `VRB: LMM Server response: default CBMg IP = ${cBMgIP}`
        );
        this.lmmService.getCLLI(cBMgIP).subscribe(
          (clli) => {
            this.storageService.clli = clli;
            this.statusIndicators.forEach((_, index) => {
              this.statusIndicatorsService.updateStatus(index, Status.SUCCESS);
            });

            this.updateProductTitle(clli);

            this.statusLogService.pushLogs('OSS Comms OK');
            this.statusLogService.pushLogs('DMA OK');
            this.statusLogService.pushLogs('BMU OK');
            this.statusLogService.pushLogs(
              `VRB: Communication to ${cBMgIP}: SUCCESSFUL`
            );
          },
          (err) => {
            this.storageService.clli = '';
            this.updateProductTitle();
            this.commonService.showAPIError(err);
          }
        );
      },
      (err) => {
        this.storageService.cBMgIP = '';
        this.statusIndicatorsService.updateStatus(0, Status.FAULT);
        this.pageTop.profiles = this.generateProfiles();
        this.commonService.showAPIError(err);
      }
    );
  }

  updateProductTitle(clliName?: string) {
    const productInfo = {
      productTitle: clliName ? '| ' + clliName : ''
    };
    this.changeTitle(clliName);
    this.pageTop.productInfo = productInfo;
  }

  changeTitle(title?: string): void {
    if (title) {
      this.titleService.setTitle('LMM | ' + title);
    } else {
      this.titleService.setTitle('Line Maintenance Manager');
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
