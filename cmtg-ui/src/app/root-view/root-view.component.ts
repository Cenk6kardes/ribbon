import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';

import { SideBar } from 'rbn-common-lib/lib/models/sidebar';
import { AuthenticationService } from '../auth/services/authentication.service';
import { TranslateInternalService } from '../services/translate-internal.service';
import { SidebarData, AuditChildrenItem, InterfaceBrowserItem } from '../types/sidebar';
import { StorageService } from '../services/storage.service';
import { CommonService } from '../services/common.service';
import { PREFIX_URL } from '../types/const';
import { EDataIntegrity } from '../modules/audit/models/audit';
import { AuditUtilitiesService } from '../modules/audit/services/audit-utilities.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root-view',
  templateUrl: './root-view.component.html',
  styleUrls: ['./root-view.component.scss']
})
export class RootViewComponent implements OnInit,OnDestroy {

  autoLogoutObservable: Subscription;
  translateResults: any;
  menuItemsSidebar: SideBar[] = [];;

  sidebarConfig = {
    usePathForActiveItem: true,
    useSearch: false,
    useFavorites: false
  };

  // 10 minutes before the expiration time of the session
  timeBeforeSessionExpire = 10 * 60;
  isUserActivity = true;
  isLoading = false;

  constructor(
    private translateService: TranslateInternalService,
    private router: Router,
    private authService: AuthenticationService,
    private storageService: StorageService,
    private commonService: CommonService,
    private idle: Idle,
    private route: ActivatedRoute,
    private auditUtilitiesService: AuditUtilitiesService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.menuItemsSidebar = SidebarData;
    this.autoLogoutObservable=this.authService.autoLogoutSubject$.asObservable().subscribe((flag: boolean) => {
      if (flag) {
        this.checkValidSession();
      }
    });
    this.checkValidSession();
    const snapshotData = this.route.snapshot.data;
    if (snapshotData && snapshotData['data']) {
      const auditSidebarData =
        snapshotData['data'] as { registeredAuditData: any, isV52SupportedData: any, timeZoneName: string };
      const indexPathAudit = this.menuItemsSidebar.findIndex(n => n.path === (PREFIX_URL + '/' + 'audit'));
      // set time zone name
      this.auditUtilitiesService.timeZoneName = auditSidebarData.timeZoneName;
      // end
      if (indexPathAudit !== -1 && auditSidebarData) {
        this.setDynamicItemSidebarAudit(auditSidebarData, indexPathAudit);
      }
      if(snapshotData['data'].isV52SupportedData){
        this.menuItemsSidebar.push(InterfaceBrowserItem);
      }
    }
  }

  menuItemClicked(routeData: any) {
    if (routeData?.path) {
      this.router.navigateByUrl(routeData.path);
    }
  }

  // #region Logout/Auto Logout
  checkValidSession() {
    this.authService.validateSession().subscribe({
      next: (res) => {
        this.setIdleTime();
      },
      error: (error) => {
        this.commonService.showAPIError(error);
        this.navigateToLoginPage();
      }
    });
  }

  setIdleTime() {
    this.authService.getTimeoutValue().subscribe(expiredTime => {
      const inactiveTimeout = Number(expiredTime?.substring(0, expiredTime.indexOf(';')) || 0);
      if (inactiveTimeout <= 0) {
        this.logout();
      } else {
        // how long can they be inactive before considered idle, in seconds
        this.setIdleParameters(inactiveTimeout);
        this.refreshSessionBeforeExpiredTime();
      }
    }, (error) => {
      this.commonService.showAPIError(error);
    });
  }

  refreshSessionBeforeExpiredTime() {
    const time = this.idle.getIdle() - this.timeBeforeSessionExpire;
    if (time > 0) {
      setTimeout(() => {
        if (this.isUserActivity) {
          this.refreshSession();
        }
      }, time * 1000);
    }
  }

  setIdleParameters(time: number) {
    if (!time) {
      this.logout();
      return;
    }
    this.idle.setIdle(time);
    // provide sources that will "interrupt" aka provide events indicating the user is active
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    // logout when the user becomes idle
    this.idle.onIdleStart.subscribe(() => {
      this.logout();
    });
    this.idle.watch();
  }

  refreshSession() {
    this.authService.refreshUserSession().subscribe({
      next: (res) => {
        this.authService.validateSession().subscribe({
          next: () => {
            this.refreshSessionBeforeExpiredTime();
          },
          error: (error) => {
            this.commonService.showAPIError(error);
            this.navigateToLoginPage();
          }
        });
      },
      error: (err) => {
        this.commonService.showAPIError(err);
        this.navigateToLoginPage();
      }
    });
  }

  confirmLogout() {
    this.logout();
  }

  logout() {
    this.idle.stop();
    this.isUserActivity = false;
    this.isLoading = true;
    this.authService.logOut().subscribe(rs => {
      this.navigateToLoginPage();
      this.isLoading = false;
    }, (err) => {
      this.commonService.showAPIError(err);
      this.navigateToLoginPage();
      this.isLoading = false;
    });
  }

  navigateToLoginPage() {
    this.storageService.removeStorageData();
    this.router.navigate(['login']);
  }
  // #region

  setDynamicItemSidebarAudit(auditSidebar: { registeredAuditData: string[], isV52SupportedData: any }, indexPathAudit: number) {
    const childItemAudit: SideBar[] = [];
    let auditItems: string[] = [];
    if (auditSidebar.registeredAuditData !== undefined) {
      auditItems = auditItems.concat(auditSidebar.registeredAuditData);
      auditItems = auditSidebar.registeredAuditData.filter(n => n.indexOf('Audit') > -1 && n !== EDataIntegrity.V52_DATA_INTEGRITY_AUDIT);
    }
    if (auditSidebar.isV52SupportedData !== undefined) {
      const isV52SupportedDataTemp = auditSidebar.isV52SupportedData;
      if (isV52SupportedDataTemp === 'true' || isV52SupportedDataTemp === true) {
        auditItems.push(EDataIntegrity.V52_DATA_INTEGRITY_AUDIT);
      }
    }
    const registeredAuditTemp = auditItems.sort();
    for (let i = 0; i < registeredAuditTemp.length; i++) {
      switch (registeredAuditTemp[i]) {
        case EDataIntegrity.C20_DATA_INTEGRITY_AUDIT: {
          childItemAudit.push(AuditChildrenItem[0]);
        }
          break;
        case EDataIntegrity.LINE_DATA_INTEGRITY_AUDIT: {
          childItemAudit.push(AuditChildrenItem[1]);
        }
          break;
        case EDataIntegrity.TRUNK_DATA_INTEGRITY_AUDIT: {
          childItemAudit.push(AuditChildrenItem[2]);
        }
          break;
        case EDataIntegrity.V52_DATA_INTEGRITY_AUDIT: {
          childItemAudit.push(AuditChildrenItem[5]);
        }
          break;
        case EDataIntegrity.SMALL_LINE_DATA_INTEGRITY_AUDIT: {
          childItemAudit.push(AuditChildrenItem[6]);
        }
          break;
        default:
          break;
      }
    }
    childItemAudit.push(AuditChildrenItem[3]);
    childItemAudit.push(AuditChildrenItem[4]);
    this.menuItemsSidebar[indexPathAudit].children = childItemAudit;
    this.auditUtilitiesService.registeredAudits = auditItems;
    this.auditUtilitiesService.itemsSideBarAudit = childItemAudit;
    this.menuItemsSidebar = [...this.menuItemsSidebar];
  }

  ngOnDestroy(): void {
    this.autoLogoutObservable.unsubscribe();
  }
}
