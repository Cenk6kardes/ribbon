import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SideBar } from 'rbn-common-lib/lib/models/sidebar';
import { AuthenticationService } from '../auth/services/authentication.service';

import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';

import { TranslateInternalService } from '../services/translate-internal.service';
import { SidebarData } from '../types/sidebar';
import { StatusLogService } from '../services/status-log.service';
import { StorageService } from '../services/storage.service';
import { CommonService } from '../services/common.service';
@Component({
  selector: 'app-root-view',
  templateUrl: './root-view.component.html',
  styleUrls: ['./root-view.component.scss']
})
export class RootViewComponent implements OnInit {

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
    private statusLogService: StatusLogService,
    private commonService: CommonService,
    private idle: Idle
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.menuItemsSidebar = SidebarData;
    this.checkValidSession();
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
    this.statusLogService.clearAllLogs();
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
}
