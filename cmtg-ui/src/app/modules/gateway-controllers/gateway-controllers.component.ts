import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IPageHeader } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { GatewayControllersService } from './services/gateway-controllers.service';
import { SelectItem } from 'primeng/api';
import {
  GWCNode,
  IConfirm,
  IDisassociateDeleteNodeResponse,
  IGwUnitsInfo
} from './models/gwControllers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take, retry, tap, switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { DisassociateDialogService } from './services/disassociate-dialog.service';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';

@Component({
  selector: 'app-gateway-controllers',
  templateUrl: './gateway-controllers.component.html',
  styleUrls: ['./gateway-controllers.component.scss']
})
export class GatewayControllersComponent implements OnInit, AfterViewInit {
  @ViewChild(MaintenanceComponent) maintenanceComponent: MaintenanceComponent;

  headerData: IPageHeader;
  isInprocess = false;
  showAssociateDialog = false;
  isShowNewGWCNodeDialog = false;
  showDisassociateDialog = false;

  showDeleteNodeDialog = false;
  showGwcErrorDialog = false;
  showGwcDetailsBtn = true;
  messageTextGwc: string;
  detailsTextGwc: string;

  translateResults: any;
  gwControllersOptions: SelectItem[];
  currentGwControllerName = '';
  unit0: string;
  unit1: string;

  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showDetailsBtn = true;
  showErrorDialog = false;

  disassociateForm: FormGroup;
  confirmDisassociate: IConfirm = {
    title: '',
    content: '',
    isShowConfirmDialog: false,
    titleAccept: '',
    titleReject: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleAccept: (isAccept: boolean) => {}
  };

  deleteGwcNodeForm: FormGroup;
  confirmDeleteGwcNode: IConfirm = {
    title: '',
    content: '',
    isShowConfirmDialog: false,
    titleAccept: '',
    titleReject: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleAccept: (isAccept: boolean) => {}
  };
  gwNameOptions: SelectItem[];
  clli: string;

  constructor(
    private translateService: TranslateInternalService,
    private gwcService: GatewayControllersService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private nvService: NetworkViewService,
    private authService: AuthenticationService,
    private disassociateDialogService: DisassociateDialogService
  ) {
    this.translateResults = this.translateService.translateResults;
    this.disassociateForm = this.fb.group({
      gwName: ['']
    });
    this.deleteGwcNodeForm = this.fb.group({
      gwcName: ['']
    });
    this.disassociateDialogService.data$.subscribe((data) => {
      if (data) {
        this.disassociateForm.get('gwName')?.setValue(data);
      }
    });
  }

  ngOnInit(): void {
    this.initPageHeader();
    this.initGatewayControllers();
    this.authService.getCLLI().subscribe((res) => {
      this.clli = res;
    });
    this.getAllGwc(true);
    this.disassociateDialogService.showDialog$.subscribe((showDialog) => {
      this.showDisassociateDialog = showDialog;
    });
  }

  ngAfterViewInit() {
    if (this.maintenanceComponent) {
      this.maintenanceComponent.gwcNotFound.subscribe(() => this.handleGwcNotFound());
    }
  }

  handleGwcNotFound() {
    this.initGatewayControllers();
    if (this.gwControllersOptions && this.gwControllersOptions.length > 0) {
      this.handleChangeGwcem(this.gwControllersOptions[0].value);
    }
  }

  getAllGwc(callOnNgOnInit: boolean){
    this.nvService.getAllGwc().subscribe({
      next: (res: string) => {
        this.isInprocess = false;
        const tempGwNameOptions = [];
        if (res) {
          for (let i = 0; i < res.length; i++) {
            tempGwNameOptions.push({
              label: res[i],
              value: res[i]
            });
          }
        }
        tempGwNameOptions.sort((a, b) => {
          // eslint-disable-next-line
          const numA = parseInt(a.label.split('-')[1]);
          // eslint-disable-next-line
          const numB = parseInt(b.label.split('-')[1]);

          return numA - numB;
        });
        this.gwNameOptions = tempGwNameOptions;
        if(callOnNgOnInit){
          this.handleChangeGwcem(tempGwNameOptions[0].value);
        }
      },
      error: (err) => {
        this.isInprocess = false;
        this.commonService.showAPIError(err);
      }
    });
  }

  initGatewayControllers() {
    this.isInprocess = true;
    this.gwcService.getGwcList().subscribe({
      next: (res: any) => {
        this.isInprocess = false;
        const tempGwControllersOptions = [];
        if (res) {
          for (let i = 0; i < res.length; i++) {
            tempGwControllersOptions.push({
              label: res[i].devEquipmentName,
              value: res[i].devEquipmentName
            });
          }
        }
        const filteredGwControllersOptions = tempGwControllersOptions.filter(
          (item: any) => {
            const label = item.label.toUpperCase();
            return (
              !label.includes('-INACTIVE') &&
              !label.includes('-ACTIVE') &&
              !label.includes('UNIT')
            );
          }
        );
        this.gwControllersOptions = filteredGwControllersOptions;
      },
      error: (err) => {
        this.isInprocess = false;
        this.commonService.showAPIError(err);
      }
    });
  }

  handleSelectedMenuItem(event: any) {
    if (event.title === 'disassociateGW') {
      this.disassociateDialogService.openDialog();
    } else if (event.title === 'deleteGwcNode') {
      this.getAllGwc(false);
      this.showDeleteNodeDialog = true;
    }
  }

  onDisassociateFormSubmit(event: boolean) {
    // cancel - false
    // save - true
    if (event) {
      const gwName = this.disassociateForm.get('gwName')?.value;
      this.confirmDisassociate.title =
        this.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_TITLE;
      this.confirmDisassociate.titleAccept = this.translateResults.COMMON.YES;
      this.confirmDisassociate.titleReject = this.translateResults.COMMON.NO;
      this.confirmDisassociate.content =
        this.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_CONTENT.replace(
          /{{gwName}}/,
          gwName
        ).replace(/{{gwName}}/, gwName);
      this.confirmDisassociate.isShowConfirmDialog = true;
      this.confirmDisassociate.handleAccept = (isAccept: boolean) => {
        if (isAccept) {
          this.isInprocess = true;
          this.gwcService
            .deleteDisAssocMGsync(gwName)
            .pipe(
              take(1),
              retry(1),
              tap((res: IDisassociateDeleteNodeResponse) => {
                this.isInprocess = false;
                const responseMsg = res.responseMsg;
                switch (res.rc.__value) {
                  case 0:
                    this.commonService.showSuccessMessage(
                      this.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE
                        .CONFIRM_MSG.CODE_0
                    );
                    break;
                  default:
                    if (responseMsg.length > 0) {
                      this.detailsText = responseMsg;
                    } else {
                      this.detailsText =
                        this.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_MSG.CODE_UNKNOWN;
                    }
                    this.showErrorDialog = true;
                    break;
                }
              })
            )
            .subscribe({
              complete: () => {
                this.isInprocess = false;
                this.disassociateDialogService.closeDialog();
                this.disassociateForm.reset();
                this.disassociateDialogService.triggerTableRefresh(true);
              },
              error: (err) => {
                this.isInprocess = false;
                this.commonService.showAPIError(err);
              }
            });
          this.confirmDisassociate.isShowConfirmDialog = false;
        } else {
          this.confirmDisassociate.isShowConfirmDialog = false;
        }
      };
    } else {
      this.disassociateDialogService.closeDialog();
      this.disassociateForm.reset();
    }
    this.disassociateDialogService.triggerTableRefresh(false);
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
    this.showDetailsBtn = true;
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  onDeleteGwcNodeFormSubmit(event: boolean) {
    // cancel - false
    // save - true
    if (event) {
      const selectedGw = this.deleteGwcNodeForm.get('gwcName')?.value;
      this.confirmDeleteGwcNode.title =
        this.translateResults.GATEWAY_CONTROLLERS.DELETE_GWC_NODE.CONFIRM_TITLE;
      this.confirmDeleteGwcNode.titleAccept = this.translateResults.COMMON.YES;
      this.confirmDeleteGwcNode.titleReject = this.translateResults.COMMON.NO;
      this.confirmDeleteGwcNode.content =
        this.translateResults.GATEWAY_CONTROLLERS.DELETE_GWC_NODE.CONFIRM_CONTENT.replace(
          /{{gwName}}/,
          selectedGw
        );
      this.confirmDeleteGwcNode.isShowConfirmDialog = true;
      this.confirmDeleteGwcNode.handleAccept = (isAccept: boolean) => {
        if (isAccept) {
          this.isInprocess = true;
          this.gwcService
            .getGWCNodeByName_v1(selectedGw)
            .pipe(
              switchMap((res: GWCNode) =>
                this.getFlowthroughStatus(
                  res.serviceConfiguration.gwcProfileName
                )
              ),
              tap((status) => {
                if (status) {
                  this.gwcService
                    .deleteGWCfrmCSsync_v2(selectedGw, this.clli)
                    .pipe(
                      tap((res: IDisassociateDeleteNodeResponse) => {
                        this.isInprocess = false;
                        if (res.rc.__value === 0) {
                          this.commonService.showSuccessMessage(
                            res.responseMsg
                          );
                          this.handleChangeGwcem(this.gwControllersOptions[0].value);
                        } else {
                          this.messageTextGwc =
                            this.translateResults.GATEWAY_CONTROLLERS.DELETE_GWC_NODE.FAILED_MESSAGE;
                          this.detailsTextGwc = res.responseMsg;
                          this.showGwcErrorDialog = true;
                        }
                      })
                    )
                    .subscribe({
                      error: (error) => {
                        // Handle the error, show an error message
                        this.isInprocess = false;
                        this.commonService.showAPIError(error);
                      },
                      complete: () => {
                        this.isInprocess = false;
                        this.initGatewayControllers();
                        this.confirmDeleteGwcNode.isShowConfirmDialog = false;
                        this.showDeleteNodeDialog = false;
                        this.deleteGwcNodeForm.reset();
                      }
                    });
                } else {
                  this.gwcService
                    .deleteGWCfrmCSsync(selectedGw, this.clli)
                    .pipe(
                      tap((res: IDisassociateDeleteNodeResponse) => {
                        if (res.rc.__value === 0) {
                          this.commonService.showSuccessMessage(
                            res.responseMsg
                          );
                          this.handleChangeGwcem(this.gwControllersOptions[0].value);
                        } else {
                          this.messageTextGwc =
                            this.translateResults.GATEWAY_CONTROLLERS.DELETE_GWC_NODE.FAILED_MESSAGE;
                          this.detailsTextGwc = res.responseMsg;
                          this.showGwcErrorDialog = true;
                        }
                      })
                    )
                    .subscribe({
                      error: (error) => {
                        // Handle the error, show an error message
                        this.isInprocess = false;
                        this.commonService.showAPIError(error);
                      },
                      complete: () => {
                        this.isInprocess = false;
                        this.initGatewayControllers();
                        this.confirmDeleteGwcNode.isShowConfirmDialog = false;
                        this.showDeleteNodeDialog = false;
                        this.deleteGwcNodeForm.reset();
                      }
                    });
                }
              })
            )
            .subscribe({
              error: (error) => {
                // Handle the error, show an error message
                this.isInprocess = false;
                this.commonService.showAPIError(error);
              }
            });
        } else {
          this.confirmDeleteGwcNode.isShowConfirmDialog = false;
        }
      };
    } else {
      this.showDeleteNodeDialog = false;
      this.deleteGwcNodeForm.reset();
    }
  }

  getFlowthroughStatus(profileName: string): Observable<any> {
    return this.gwcService.getFlowthroughStatus(profileName);
  }

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.GATEWAY_CONTROLLERS.TITLE,
      overlayButton: {
        menuItem: [
          {
            label:
              this.translateResults.GATEWAY_CONTROLLERS.OVERLAY_BUTTONS
                .DISASSOCIATE_GW,
            title: 'disassociateGW'
          },
          {
            label:
              this.translateResults.GATEWAY_CONTROLLERS.OVERLAY_BUTTONS
                .DELETE_GWC_NODE,
            title: 'deleteGwcNode'
          }
        ],
        isDisplay: true
      },
      topButton: [
        {
          title:
            this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL
              .ASSOCIATE_MEDIA_GATEWAY,
          icon: 'fa fa-plus',
          isDisplay: true,
          label:
            this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL
              .ASSOCIATE_MEDIA_GATEWAY,
          disabled: false,
          iconPos: 'left',
          onClick: () => {
            this.onShowDialog('');
          }
        },
        {
          title: this.translateResults.GATEWAY_CONTROLLERS.ADD_GWC_NODE.TITLE,
          icon: 'fa fa-plus',
          isDisplay: true,
          label: this.translateResults.GATEWAY_CONTROLLERS.ADD_GWC_NODE.TITLE,
          disabled: false,
          iconPos: 'left',
          onClick: () => {
            this.onShowAddGwcNode();
          }
        }
      ]
    };
  }

  closeDialog(): void {
    this.deleteGwcNodeForm.reset();
    this.showAssociateDialog = false;
  }

  onShowDialog($event: any): void {
    this.showAssociateDialog = true;
  }

  onShowAddGwcNode() {
    this.isShowNewGWCNodeDialog = true;
  }

  handleChangeGwcem(item: string) {
    this.currentGwControllerName = item;
    this.isInprocess = true;
    this.gwcService.getUnitStatus(item).subscribe({
      next: (res: IGwUnitsInfo) => {
        this.isInprocess = false;
        this.unit0 = res.unit0IPAddr;
        this.unit1 = res.unit1IPAddr;
      },
      error: (err) => {
        this.isInprocess = false;
        this.commonService.showAPIError(err);
      }
    });
  }

  closeNewGWCNodeDialog() {
    this.isShowNewGWCNodeDialog = false;
    this.initGatewayControllers();
    this.handleChangeGwcem(this.gwControllersOptions[0].value);
  }

  closeAssociateDialog() {
    this.showAssociateDialog = false;
  }

  showOrHideGwcButtonClick() {
    this.showGwcDetailsBtn = !this.showGwcDetailsBtn;
  }

  closeGwcErrorDialog() {
    this.messageTextGwc = '';
    this.detailsTextGwc = '';
    this.showGwcErrorDialog = false;
    this.showGwcDetailsBtn = true;
  }
}
