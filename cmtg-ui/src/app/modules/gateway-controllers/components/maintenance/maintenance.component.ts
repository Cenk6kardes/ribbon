import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { GatewayControllersService } from '../../services/gateway-controllers.service';
import { IStatusDataResponse, EMaintenanceState, EOverallStatus } from '../../models/gwControllers';
import { CommonService } from 'src/app/services/common.service';
import { Subject, Subscription, forkJoin, interval } from 'rxjs';
import { MaintenanceTriggerService } from '../../services/maintenance-trigger.service';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit, OnChanges, OnDestroy {
  @Input() gwControllerName!: string;
  @Output() gwcNotFound = new EventEmitter<void>();

  refreshGwcSubscription: Subscription;
  private destroy$ = new Subject<void>();

  terminateRefreshSubscription = ['401', '404']; // error codes
  unit0ID: string;
  unit1ID: string;
  unit1IPAddr: string;
  unit0IPAddr: string;
  overallStatus: string;
  statusDataResponse: IStatusDataResponse[] = [];
  active: string;
  inactive: string;
  ipPanelUnit0: string;
  ipPanelUnit1: string;
  elementManagerIp: string;
  loadNameUnit0: string;
  loadNameUnit1: string;
  trap: string;
  isLoading = false;
  loadNameVersion0: string;
  loadNameVersion1: string;
  activeUnit: string;
  haState0: string;
  haState1: string;
  EOverallStatus = EOverallStatus;


  constructor(
    private gwcService: GatewayControllersService,
    private commonService: CommonService,
    private triggerService: MaintenanceTriggerService
  ) {
    this.refreshGwcSubscription = interval(10000).subscribe((x) => {
      this.refreshGwcStatus()?.subscribe({
        next: (results) => {
          this.isLoading = false;

          if (results.haState0.haState === EMaintenanceState.UNKNOWN_STATE) {
            this.loadNameUnit0 = EMaintenanceState.UNKNOWN_STATE;
          } else {
            this.gwcService
              .getLoadNameVersion(this.unit0IPAddr, true)
              .subscribe({
                next: (resLoadNameV0) => {
                  this.loadNameVersion0 = resLoadNameV0;
                  this.gwcService
                    .getGWCLoadName2(this.unit0IPAddr, true)
                    .subscribe({
                      next: (resUnit0) => {
                        this.loadNameUnit0 = `${resUnit0} (${this.loadNameVersion0})`;
                      },
                      error: (er) => {
                        this.isLoading = false;
                        this.commonService.showAPIError(er);
                      }
                    });
                },
                error: (er) => {
                  this.isLoading = false;
                  this.commonService.showAPIError(er);
                }
              });
          }

          if (results.haState1.haState === EMaintenanceState.UNKNOWN_STATE) {
            this.loadNameUnit1 = EMaintenanceState.UNKNOWN_STATE;
          } else {
            this.gwcService
              .getLoadNameVersion(this.unit1IPAddr, true)
              .subscribe({
                next: (resLoadNameV1) => {
                  this.loadNameVersion1 = resLoadNameV1;
                  this.gwcService
                    .getGWCLoadName2(this.unit1IPAddr, true)
                    .subscribe({
                      next: (resUnit1) => {
                        this.loadNameUnit1 = `${resUnit1} (${this.loadNameVersion1})`;
                      },
                      error: (er) => {
                        this.isLoading = false;
                        this.commonService.showAPIError(er);
                      }
                    });
                },
                error: (er) => {
                  this.isLoading = false;
                  this.commonService.showAPIError(er);
                }
              });
          }

          const res = results.gwcNodes;
          this.active = res.nodeList[0].serviceConfiguration.activeIpAddress;
          this.inactive =
            res.nodeList[0].serviceConfiguration.inactiveIpAddress;
          this.ipPanelUnit0 =
            res.nodeList[0].serviceConfiguration.unit0IpAddress;
          this.ipPanelUnit1 =
            res.nodeList[0].serviceConfiguration.unit1IpAddress;

          this.elementManagerIp =
            results.gwcNodeByName.elementManager.ipAddress;
          this.trap = results.gwcNodeByName.elementManager.trapPort;
        },
        error: (er) => {
          this.isLoading = false;

          const isGwcNotFoundError = er?.error?.message?.includes(EMaintenanceState.GWC_NOT_FOUND);
          if (!isGwcNotFoundError) {
            this.commonService.showAPIError(er);
          }

          if (
            this.terminateRefreshSubscription.includes(er?.error?.errorCode) ||
            this.terminateRefreshSubscription.includes(String(er?.status))
          ) {
            if (this.refreshGwcSubscription) {
              this.refreshGwcSubscription.unsubscribe();
            }
          }

          if (isGwcNotFoundError) {
            this.refreshGwcSubscription.unsubscribe();
            this.gwcNotFound.emit();
          }
        }
      });
    });
  }

  ngOnInit() {
    this.triggerService.getMaintenanceTrigger().pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.ngOnChanges();
    });
  }

  ngOnChanges() {
    if (this.gwControllerName) {
      this.isLoading = true;
      this.gwcService
        .getUnitStatus(this.gwControllerName)
        .pipe(
          switchMap((res) => {
            this.unit0ID = res.unit0ID;
            this.unit1ID = res.unit1ID;
            this.unit0IPAddr = res.unit0IPAddr;
            this.unit1IPAddr = res.unit1IPAddr;
            this.handleOverallStatus(this.unit0ID, this.unit1ID);

            return forkJoin({
              haState0: this.gwcService.getStatusData_e(this.unit0ID),
              haState1: this.gwcService.getStatusData_e(this.unit1ID),
              gwcNodes: this.gwcService.getGWCNodesByFilter_v1(
                this.gwControllerName
              ),
              gwcNodeByName: this.gwcService.getGWCNodeByName_v1(
                this.gwControllerName
              )
            });
          })
        )
        .subscribe({
          next: (results) => {
            this.isLoading = false;

            if (results.haState0.haState === EMaintenanceState.UNKNOWN_STATE) {
              this.loadNameUnit0 = EMaintenanceState.UNKNOWN_STATE;
            } else {
              this.gwcService
                .getLoadNameVersion(this.unit0IPAddr, true)
                .subscribe({
                  next: (resLoadNameV0) => {
                    this.loadNameVersion0 = resLoadNameV0;
                    this.gwcService
                      .getGWCLoadName2(this.unit0IPAddr, true)
                      .subscribe({
                        next: (resUnit0) => {
                          this.loadNameUnit0 = `${resUnit0} (${this.loadNameVersion0})`;
                        },
                        error: (er) => {
                          this.isLoading = false;
                          this.commonService.showAPIError(er);
                        }
                      });
                  },
                  error: (er) => {
                    this.isLoading = false;
                    this.commonService.showAPIError(er);
                  }
                });
            }

            if (results.haState1.haState === EMaintenanceState.UNKNOWN_STATE) {
              this.loadNameUnit1 = EMaintenanceState.UNKNOWN_STATE;
            } else {
              this.gwcService
                .getLoadNameVersion(this.unit1IPAddr, true)
                .subscribe({
                  next: (resLoadNameV1) => {
                    this.loadNameVersion1 = resLoadNameV1;
                    this.gwcService
                      .getGWCLoadName2(this.unit1IPAddr, true)
                      .subscribe({
                        next: (resUnit1) => {
                          this.loadNameUnit1 = `${resUnit1} (${this.loadNameVersion1})`;
                        },
                        error: (er) => {
                          this.isLoading = false;
                          this.commonService.showAPIError(er);
                        }
                      });
                  },
                  error: (er) => {
                    this.isLoading = false;
                    this.commonService.showAPIError(er);
                  }
                });
            }

            const res = results.gwcNodes;
            this.active = res.nodeList[0].serviceConfiguration.activeIpAddress;
            this.inactive =
              res.nodeList[0].serviceConfiguration.inactiveIpAddress;
            this.ipPanelUnit0 =
              res.nodeList[0].serviceConfiguration.unit0IpAddress;
            this.ipPanelUnit1 =
              res.nodeList[0].serviceConfiguration.unit1IpAddress;

            this.elementManagerIp =
              results.gwcNodeByName.elementManager.ipAddress;
            this.trap = results.gwcNodeByName.elementManager.trapPort;
          },
          error: (er) => {
            this.isLoading = false;
            this.commonService.showAPIError(er);
            if (
              this.terminateRefreshSubscription.includes(er?.error?.errorCode) ||
                this.terminateRefreshSubscription.includes(String(er?.status))
            ) {
              if (this.refreshGwcSubscription) {
                this.refreshGwcSubscription.unsubscribe();
              }
            }
            if (er?.error?.message?.includes(EMaintenanceState.GWC_NOT_FOUND)) {
              this.refreshGwcSubscription.unsubscribe();
              this.gwcNotFound.emit();
            }
          }
        });
    }
  }

  refreshGwcStatus() {
    if (!this.gwControllerName) {
      if (this.refreshGwcSubscription) {
        this.refreshGwcSubscription.unsubscribe();
      }
      return; // Exit function if gwControllerName is not set
    }
    return this.gwcService.getUnitStatus(this.gwControllerName).pipe(
      switchMap((res) => {
        this.unit0ID = res.unit0ID;
        this.unit1ID = res.unit1ID;
        this.unit0IPAddr = res.unit0IPAddr;
        this.unit1IPAddr = res.unit1IPAddr;
        this.handleOverallStatus(this.unit0ID, this.unit1ID);

        return forkJoin({
          haState0: this.gwcService.getStatusData_e(this.unit0ID),
          haState1: this.gwcService.getStatusData_e(this.unit1ID),
          gwcNodes: this.gwcService.getGWCNodesByFilter_v1(
            this.gwControllerName
          ),
          gwcNodeByName: this.gwcService.getGWCNodeByName_v1(
            this.gwControllerName
          )
        });
      })
    );
  }

  handleOverallStatus(unit0ID: string, unit1ID: string) {
    this.statusDataResponse = [];
    this.activeUnit = '';

    if (unit0ID && unit1ID) {
      // unit0ID
      this.gwcService.getStatusData_e(unit0ID).subscribe({
        next: (res0: IStatusDataResponse) => {
          // unit1ID
          this.gwcService.getStatusData_e(unit1ID).subscribe({
            next: (res1: IStatusDataResponse) => {
              const readyState0 = res0.readyState;
              const readyState1 = res1.readyState;

              if (res0 && res1) {
                // Overall Status
                if (
                  readyState0 === EMaintenanceState.IN_SERVICE &&
                  readyState1 === EMaintenanceState.IN_SERVICE
                ) {
                  this.overallStatus = EOverallStatus.InService;
                } else if (
                  readyState0 === EMaintenanceState.OUT_OF_SERVICE &&
                  readyState1 === EMaintenanceState.OUT_OF_SERVICE
                ) {
                  this.overallStatus = EOverallStatus.OutOfService;
                } else if (
                  readyState0 === EMaintenanceState.IN_SERVICE ||
                  readyState1 === EMaintenanceState.IN_SERVICE
                ) {
                  this.overallStatus = EOverallStatus.Degraded;
                } else {
                  this.overallStatus = EOverallStatus.Unknown;
                }

                this.statusDataResponse.push({
                  adminState: res0.adminState,
                  usageState: res0.usageState,
                  operState: res0.operState,
                  standbyState: res0.standbyState,
                  activityState: res0.activityState,
                  swactState: res0.swactState,
                  isolationState: res0.isolationState,
                  alarmState: res0.alarmState,
                  availState: res0.availState,
                  faultState: res0.faultState,
                  readyState: readyState0,
                  haState: res0.haState
                });
                this.statusDataResponse.push({
                  adminState: res1.adminState,
                  usageState: res1.usageState,
                  operState: res1.operState,
                  standbyState: res1.standbyState,
                  activityState: res1.activityState,
                  swactState: res1.swactState,
                  isolationState: res1.isolationState,
                  alarmState: res1.alarmState,
                  availState: res1.availState,
                  faultState: res1.faultState,
                  readyState: readyState1,
                  haState: res1.haState
                });
                if (res0.haState === EMaintenanceState.ACTIVE_UNIT) {
                  this.activeUnit = 'Unit 0';
                } else if (res1.haState === EMaintenanceState.ACTIVE_UNIT) {
                  this.activeUnit = 'Unit 1';
                } else {
                  this.activeUnit = EMaintenanceState.UNKNOWN_STATE;
                }
              }
            },
            error: (er) => {
              this.commonService.showAPIError(er);
            }
          });
        },
        error: (er) => {
          this.commonService.showAPIError(er);
        }
      });
    }
  }

  ngOnDestroy() {
    this.refreshGwcSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
