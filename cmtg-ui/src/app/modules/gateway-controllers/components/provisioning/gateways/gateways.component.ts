import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import { Icols, ITableConfig, FieldName, FilterTypes } from 'rbn-common-lib';
import {
  DetailDynamicDialog,
  EOperationName,
  GWCNode,
  GatewayDataSearchResponse,
  GatewayListResponse,
  IGwApplicationData,
  IGwCapacity,
  IGwCapacityList,
  IGwUnitsInfo,
  ILblProfileData,
  ILgrpType,
  IProvisioningGatewaysTable,
  defaultPostBody,
  resetDefaultPostBody
} from '../../../models/gwControllers';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { retry, take, tap } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';
import { tableConfigCommon } from 'src/app/types/const';
import { LINE_LIMIT } from '../../../../../../../../lmm-ui/src/app/modules/home/models/home';
import { DisassociateDialogService } from '../../../services/disassociate-dialog.service';
@Component({
  selector: 'app-gateways',
  templateUrl: './gateways.component.html',
  styleUrls: ['./gateways.component.scss']
})
export class GatewaysComponent
implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  @Input() gwControllerName!: string;
  @ViewChild('bulkAction', { static: false }) elBulkActions: any;
  postBulkBody: any[] = [];

  showAssociateDialog = false;
  showDetailDialog = false;
  showEditResultDialog = false;
  dynamicDialogContent: DetailDynamicDialog;
  signalingGwInfo: any;
  gwApplicationData: any;
  grGwName: any;
  showNoResDialog: boolean;
  showNoResDialogContent = '';
  editResultDialogContent = '';
  selectedAction = null;
  selectedRows: IProvisioningGatewaysTable[] = [];
  bulkActions: SelectItem[] = [];
  isBulkAction = false;
  isLoading = false;
  // Gateways Table
  gatewaysTableConfig: ITableConfig;
  gatewaysTableCols: Icols[] = [];
  gatewaysTableData: IProvisioningGatewaysTable[] = [];

  retrieveForm: FormGroup;
  limitResultOptions: SelectItem[];
  searchHistory: { label: string; value: string }[] = [];
  gwcIp: string;

  editOperationForm: FormGroup;
  showEditDialog: boolean;
  operationNameOptions: SelectItem[];
  bulkActionOptions: SelectItem[];
  algOptions: SelectItem[];
  pepServerOptions: SelectItem[];
  profileOptions: SelectItem[];
  lgrpTypeOptions: SelectItem[];
  grGwOptions: SelectItem[];
  multiSiteNamesSupported: string;
  lblCategory: number;
  lblProfileName: string | null;
  isLine: boolean | null;
  isSipline: boolean | null;
  inventoryType: string;
  selectedOperation: string;
  isNodeCheck: boolean;
  isNodeShare: string;
  currentRadioButtonSelection: string;
  currentGwcName: string;
  selectedRowValues: IProvisioningGatewaysTable;
  translateResults: any;
  // picklist
  provisionedLgrps: IGwCapacityList[];
  availableCapacityList: IGwCapacityList[];
  movedToSourceList: any[] = [];
  movedToTargetList: any[] = [];
  movedToTarget = false;
  movedToSource = false;
  addCount = 0;
  removeCount = 0;
  mgMultiSiteName = '';
  // info popup
  showInfoPopup = false;
  infoPopupTitle = '';
  infoPopupMessage = '';
  // warning popup
  showWarningPopupChangeGWCapacity = false;
  // show/hide error
  showRetrieveHandleErrorDialog = false;
  // confirm LGRP popup
  showWarningPopupChangeLGRP = false;
  errorData: {
    errorCode: string,
    message: string
  };
  titleText: string;
  messageText: string;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showDetailsBtn = true;
  btnLabel = 'Show Details';

  showChangeSignalingGWConfirmDialog = false;
  changeSignalingGWMessage = '';
  signalingBodyValue: any;

  ipReg = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  validatorFieldsRefs: AbstractControl[]= [];
  isLBLInfoDirty = false;
  backupFormData = {
    operationName: '',
    alg: '',
    pepServer: '',
    gwCapacity: '',
    profile: '',
    lgrpType: '',
    grGw: { label: '', value: '' },
    ip: '',
    port: '',
    sgIp: '',
    sgPort1: '',
    sgPort2: '',
    mgcsecipAddress: '',
    secipAddress: '',
    cac: '',
    nodeSharing: ''
  };

  constructor(
    private fb: FormBuilder,
    private gwcService: GatewayControllersService,
    private nvService: NetworkViewService,
    private commonService: CommonService,
    private translateService: TranslateInternalService,
    private cd: ChangeDetectorRef,
    private disassociateDialogService: DisassociateDialogService
  ) {
    this.translateResults = this.translateService.translateResults;
    this.gatewaysTableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        ...tableConfigCommon.tableOptions,
        dataKey: 'name'
      },
      tableName: 'ProvisioningGatewaysTbl',
      isScrollable: true,
      scrollX: true,
      emptyMessageContent:
        this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.COMMON
          .EMPTY_MSG,
      actionColumnConfig: {
        actions: [
          {
            icon: 'fa fa-pencil-square-o',
            label: 'edit action',
            tooltip:
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                .GATEWAYS.TABLE.EDIT,
            onClick: (data: any, index: any) => {
              this.selectedRowValues = data;
              this.onEditHandle(data);
            }
          },
          {
            icon: 'pi pi-search-plus',
            label: 'detail action',
            tooltip:
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                .GATEWAYS.TABLE.DETAILS,
            onClick: (data: IProvisioningGatewaysTable, index: number) => {
              this.onDetailHandle(data);
            }
          },
          {
            icon: 'fas fa-trash',
            label: 'Delete',
            tooltip: 'Delete',
            onClick: (data: IProvisioningGatewaysTable) => {
              this.disassociateDialogService.setData(data.name);
              this.disassociateDialogService.openDialog();
            }
          }
        ]
      }
    };
    this.retrieveForm = this.fb.group({
      limitResult: ['25', Validators.required],
      retrivalCriteria: ['', Validators.required],
      radioButton: ['replaceList', []]
    });
    this.editOperationForm = this.fb.group({
      operationName: [''],
      alg: [''],
      pepServer: [''],
      gwCapacity: [''],
      profile: [''],
      lgrpType: [''],
      grGw: [{ label: '', value: '' }],
      ip: [''],
      port: [''],
      sgIp: [''],
      sgPort1: [''],
      sgPort2: [''],
      mgcsecipAddress: [''],
      secipAddress: [''],
      cac: [''],
      nodeSharing: ['']
    });

    this.limitResultOptions = [
      { label: '25', value: '25' },
      { label: '50', value: '50' },
      { label: '100', value: '100' },
      { label: '250', value: '250' },
      { label: '500', value: '500' },
      { label: '1000', value: '1000' },
      { label: 'No Limit', value: '30000' }
    ];
    this.operationNameOptions = [];
    this.bulkActionOptions = [
      { label: EOperationName.PROFILE, value: EOperationName.PROFILE }
    ];
  }

  ngOnInit(): void {
    this.initCols();
    this.initBulkActions();
    this.retrieveForm
      .get('radioButton')
      ?.valueChanges.subscribe((selectedRadioButton) => {
        this.currentRadioButtonSelection = selectedRadioButton;
      });
    const storedHistory = sessionStorage.getItem('searchHistory');
    if (storedHistory) {
      this.searchHistory = JSON.parse(storedHistory);
    }
    this.editOperationForm
      .get('operationName')
      ?.valueChanges.subscribe((selectedValue) => {
        this.selectedOperation = selectedValue;
        this.handleOperationChange(this.selectedOperation, true);
      });
    this.editOperationForm
      .get('lgrpType')
      ?.valueChanges.subscribe((selectedValue) => {
        selectedValue === 'LL_3RDPTY_FLEX'
          ? (this.isNodeCheck = true)
          : (this.isNodeCheck = false);
      });
    this.disassociateDialogService.refresh$.subscribe((refresh: boolean) => {
      if (refresh) {
        this.refreshGatewaysTable();
      }
    });
  }

  ngOnChanges(): void {
    this.selectedRows=[];
    this.isLoading = true;
    this.gwcService.getUnitStatus(this.gwControllerName).subscribe({
      next: (res: IGwUnitsInfo) => {
        this.isLoading = false;
        this.gwcIp = res.unit0ID;
      },
      error: (error) => {
        this.isLoading = false;
        this.commonService.showErrorMessage(error);
      }
    });
    if (
      this.currentGwcName &&
      this.gwControllerName &&
      this.currentGwcName !== this.gwControllerName
    ) {
      this.gatewaysTableData = [];
    }
    this.currentGwcName = this.gwControllerName;
  }

  ngAfterViewInit(): void {
    const newConfig = { ...this.gatewaysTableConfig };
    newConfig.extensibleHeaderTemplate = this.elBulkActions;
    this.gatewaysTableConfig = newConfig;
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  initBulkActions() {
    this.bulkActions = [
      {
        label: EOperationName.PROFILE,
        value: EOperationName.PROFILE
      }
    ];
  }

  onMoveToTarget(event: any) {
    this.movedToTargetList = [...this.movedToTargetList, ...event.items];
    this.movedToTarget = true;
    this.addCount += event.items.length;
  }

  onMoveToSource(event: any) {
    this.movedToSourceList = [...this.movedToSourceList, ...event.items];
    this.movedToSource = true;
    this.removeCount += event.items.length;
  }

  getFormFieldControl(controlName: string): AbstractControl {
    return this.editOperationForm.get(controlName) || {} as AbstractControl;
  }

  handleOperationChange(operationName: string, updateFormValidators = false ) {
    if(updateFormValidators) {
      if (this.validatorFieldsRefs.length > 0) {
        this.validatorFieldsRefs.forEach(ctrl => {
          ctrl.clearValidators();
          ctrl.updateValueAndValidity();
        });
      }
      this.backupFormData = this.editOperationForm.value;
      this.editFormReset(operationName);
    }
    switch (operationName) {
      case EOperationName.ALG:
        if(updateFormValidators) {
          this.validatorFieldsRefs = [];
          const alg = this.getFormFieldControl('alg');
          this.validatorFieldsRefs.push(alg);

          alg?.setValidators([Validators.required]);
          alg?.updateValueAndValidity();
          return;
        } else {
          if (
            this.selectedRowValues.algName ===
            this.editOperationForm.get('alg')?.value
          ) {
            this.commonService.showErrorMessage(
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.EDIT_RESULT_MSG.ALG
                .replace(/{{gwName}}/, this.selectedRowValues.name)
                .replace(/{{gwName}}/, this.selectedRowValues.name)
            );
          } else {
            defaultPostBody.algName = this.editOperationForm.get('alg')?.value;
            this.isLoading = true;
            this.gwcService
              .postEdit(
                this.selectedRowValues.gwcID,
                this.selectedRowValues.name,
                defaultPostBody
              )
              .subscribe({
                next: () => {
                  this.editFormReset('');
                  this.isLoading = false;
                  this.commonService.showSuccessMessage(
                    this.selectedRowValues.name +
                      this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                        .GATEWAYS.TABLE.EDIT_RESULT_MSG.ALG_SUCCESS
                  );
                },
                error: (errPostAlg) => {
                  this.editFormReset('');
                  this.isLoading = false;
                  const errorMessage = errPostAlg?.error?.message?.replace('\n', ' ').replace('message = ', '').replace(' details =', '');
                  this.commonService.showErrorMessage(errorMessage);
                },
                complete: () => {
                  this.refreshGatewaysTable();
                }
              });
          }
          break;
        }
      case EOperationName.PEP_SERVER:
        if(updateFormValidators) {
          this.validatorFieldsRefs = [];
          const pepServer = this.getFormFieldControl('pepServer');
          this.validatorFieldsRefs.push(pepServer);

          pepServer?.setValidators([Validators.required]);
          pepServer?.updateValueAndValidity();
          return;
        } else {
          if (
            this.selectedRowValues.pepServerName === this.editOperationForm.get('pepServer')?.value
          ) {
            this.commonService.showErrorMessage(
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.EDIT_RESULT_MSG.PEP_SERVER
                .replace(/{{gwName}}/, this.selectedRowValues.name)
                .replace(/{{gwName}}/, this.selectedRowValues.name)
            );
          } else {
            defaultPostBody.pepServerName =
              this.editOperationForm.get('pepServer')?.value;
            this.isLoading = true;
            this.gwcService
              .postEdit(
                this.selectedRowValues.gwcID,
                this.selectedRowValues.name,
                defaultPostBody
              )
              .subscribe({
                next: () => {
                  this.editFormReset('');
                  this.isLoading = false;
                  this.commonService.showSuccessMessage(
                    this.selectedRowValues.name +
                      this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                        .GATEWAYS.TABLE.EDIT_RESULT_MSG.PEP_SERVER_SUCCESS
                  );
                },
                error: (errPostPepServer) => {
                  this.editFormReset('');
                  this.isLoading = false;
                  const errorMessage =
                    errPostPepServer?.error?.message?.replace('\n', ' ').replace('message = ', '').replace(' details =', '');
                  this.commonService.showErrorMessage(errorMessage);
                },
                complete: () => {
                  this.refreshGatewaysTable();
                }
              });
          }
          break;
        }
      case EOperationName.GATEWAY_CAPACITY:
        if(updateFormValidators) {
          if (this.multiSiteNamesSupported === 'false') {
            this.validatorFieldsRefs = [];
            const gwCapacity = this.getFormFieldControl('gwCapacity');
            this.validatorFieldsRefs.push(gwCapacity);

            gwCapacity?.setValidators([Validators.required]);
            gwCapacity?.updateValueAndValidity();
            return;
          }
          return;
        } else {
          if (this.multiSiteNamesSupported === 'true') {
            if (!this.movedToTarget && !this.movedToSource) {
              this.editResultDialogContent =
                this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.EDIT_RESULT_MSG.PICK_LIST_NO_CHANGE;
              this.showEditResultDialog = true;
            } else if (this.movedToTarget && this.movedToSource) {
              this.editResultDialogContent =
                this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.EDIT_RESULT_MSG.PICK_LIST_BOTH_CHANGE;
              this.showEditResultDialog = true;
            } else {
              if (this.movedToTargetList.length > 0) {
                this.mgMultiSiteName = this.movedToTargetList
                  .map((item) => item.name)
                  .join(',');
              } else if (this.movedToSourceList.length > 0) {
                this.mgMultiSiteName = this.movedToSourceList
                  .map((item) => item.name)
                  .join(',');
              }
              const pickListBody = [
                [
                  {
                    tag: 'clientVers',
                    value: '9'
                  },
                  {
                    tag: 'mgUIName',
                    value: this.selectedRowValues.name
                  },
                  {
                    tag: 'mgMultiSiteName',
                    value: this.mgMultiSiteName
                  },
                  {
                    tag: 'reservedTerminations',
                    value: this.provisionedLgrps.length * 1023
                  }
                ]
              ];
              let timeOut = this.addCount > 0 ? this.addCount : this.removeCount;
              timeOut = Math.ceil((timeOut * 1023) / 100) * 60;
              this.isLoading = true;
              this.gwcService
                .postGwCapacityPickList(pickListBody, timeOut)
                .subscribe({
                  next: (res: any) => {
                    this.editFormReset('');
                    this.isLoading = false;
                    this.editResultDialogContent =
                      this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.EDIT_RESULT_MSG.PICK_LIST_FINAL_RESULT
                        .replace(/{{timeOut}}/, timeOut) + res.responseMsg;
                    this.showEditResultDialog = true;
                  },
                  error: (err) => {
                    this.editFormReset('');
                    this.isLoading = false;
                    this.mgMultiSiteName = '';
                    this.movedToTargetList = [];
                    this.movedToSourceList = [];
                    this.commonService.showAPIError(err);
                  },
                  complete: () => {
                    this.mgMultiSiteName = '';
                    this.movedToTargetList = [];
                    this.movedToSourceList = [];
                    this.refreshGatewaysTable();
                  }
                });
            }
          } else if (this.multiSiteNamesSupported === 'false') {
            if(isNaN(Number(this.editOperationForm.get('gwCapacity')?.value))) {
              this.infoPopupTitle = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.INFO_POPUP.TITLE;
              this.infoPopupMessage = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.INFO_POPUP.MESSAGE;
              this.showInfoPopup = true;
            } else {
              this.showWarningPopupChangeGWCapacity = true;
            }
          }
          break;
        }
      case EOperationName.PROFILE:
        if(updateFormValidators) {
          this.validatorFieldsRefs = [];
          const profile = this.getFormFieldControl('profile');
          this.validatorFieldsRefs.push(profile);

          profile?.setValidators([Validators.required]);
          profile?.updateValueAndValidity();
          return;
        } else {
          const selectedProfile = this.editOperationForm.get('profile')?.value;
          this.isLoading = true;
          this.gwcService.getGwCapacity_Profiles(selectedProfile).subscribe({
            next: (res: ILgrpType) => {
              this.isLoading = false;
              if (res && res.supportedProtocols.length > 0) {
                const protocolValue = res.supportedProtocols[0].protocol.__value;
                this.isLoading = true;
                this.gwcService
                  .saveLgrpType(this.currentGwcName, this.selectedRowValues.name)
                  .subscribe({
                    next: (gwListRes: GatewayListResponse) => {
                      this.isLoading = false;
                      if (
                        protocolValue ===
                        gwListRes.gatewayList[0].configuration.protocol.protocol.__value
                      ) {
                        const profileBody = [
                          [
                            {
                              tag: 'clientVers',
                              value: '05'
                            },
                            {
                              tag: 'mgUIName',
                              value: this.selectedRowValues.name
                            },
                            {
                              tag: 'mgProfileName',
                              value: this.editOperationForm.get('profile')?.value
                            }
                          ]
                        ];
                        this.isLoading = true;
                        this.gwcService.postLgrpType(profileBody).subscribe({
                          next: (profilePostRes: any) => {
                            this.editFormReset('');
                            this.isLoading = false;
                            this.editResultDialogContent = profilePostRes.responseMsg;
                            this.showEditResultDialog = true;
                          },
                          error: (err) => {
                            this.editFormReset('');
                            this.isLoading = false;
                            this.commonService.showAPIError(err);
                          },
                          complete: () => {
                            this.refreshGatewaysTable();
                          }
                        });
                      }
                    },
                    error: (err) => {
                      this.isLoading = false;
                      this.commonService.showAPIError(err);
                    }
                  });
              }
            },
            error: (err) => {
              this.isLoading = false;
              this.commonService.showAPIError(err);
            }
          });
          break;
        }
      case EOperationName.LGRP_TYPE:
        if(updateFormValidators) {
          this.validatorFieldsRefs = [];
          const lgrpType = this.getFormFieldControl('lgrpType');
          this.validatorFieldsRefs.push(lgrpType);

          lgrpType?.setValidators([Validators.required]);
          lgrpType?.updateValueAndValidity();
          return;
        } else {
          this.showWarningPopupChangeLGRP=true;
          break;
        }
      case EOperationName.GR_834:
        if(updateFormValidators) {
          this.validatorFieldsRefs = [];
          const grGw = this.getFormFieldControl('grGw');
          this.validatorFieldsRefs.push(grGw);

          grGw?.setValidators([Validators.required]);
          grGw?.updateValueAndValidity();
          return;
        } else {
          const grGwValue = this.editOperationForm.get('grGw')?.value;
          const grGwBody = grGwValue.label === '' && grGwValue.value === '' ? null : grGwValue;
          this.isLoading = true;
          this.gwcService.postGrGw(this.selectedRowValues.name, grGwBody).subscribe({
            next: () => {
              this.editFormReset('');
              this.isLoading = false;
              this.editResultDialogContent =
                this.selectedRowValues.name +
                this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.EDIT_RESULT_MSG.GR_834;
              this.showEditResultDialog = true;
            },
            error: (err) => {
              this.editFormReset('');
              this.isLoading = false;
              this.commonService.showAPIError(err);
            },
            complete: () => {
              this.refreshGatewaysTable();
            }
          });
          break;
        }
      case EOperationName.IP_ADDRESS:
        if(updateFormValidators) {
          this.validatorFieldsRefs = [];
          const ip = this.getFormFieldControl('ip');
          const port = this.getFormFieldControl('port');
          this.validatorFieldsRefs.push(ip, port);

          ip?.setValidators([Validators.required, Validators.pattern(this.ipReg)]);
          port?.setValidators([Validators.required, Validators.min(0), Validators.max(65535), Validators.pattern(/^[0-9]{1,5}$/)]);
          ip?.updateValueAndValidity();
          port?.updateValueAndValidity();
          return;
        } else {
          defaultPostBody.ipAddress = this.editOperationForm.get('ip')?.value;
          defaultPostBody.protocol.port =
            this.editOperationForm.get('port')?.value;
          this.isLoading = true;
          this.gwcService
            .postEdit(
              this.selectedRowValues.gwcID,
              this.selectedRowValues.name,
              defaultPostBody
            )
            .subscribe({
              next: () => {
                this.editFormReset('');
                this.isLoading = false;
                this.editResultDialogContent =
                  this.selectedRowValues.name +
                  this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                    .GATEWAYS.TABLE.EDIT_RESULT_MSG.IP_ADDRESS;
                this.showEditResultDialog = true;
              },
              error: (errPostIPAddress) => {
                this.editFormReset('');
                this.isLoading = false;
                const errorMessage = errPostIPAddress?.error?.message?.replace('\n', ' ')
                  .replace('message = ', '').replace(' details =', '');
                this.commonService.showErrorMessage(errorMessage);
              },
              complete: () => {
                this.refreshGatewaysTable();
              }
            });
          break;
        }
      case EOperationName.SIGNALING:
        if(updateFormValidators) {
          this.validatorFieldsRefs = [];
          const sgIp = this.getFormFieldControl('sgIp');
          const sgPort1 = this.getFormFieldControl('sgPort1');
          const sgPort2 = this.getFormFieldControl('sgPort2');
          this.validatorFieldsRefs.push(sgIp, sgPort1);

          sgIp?.setValidators([Validators.required, Validators.pattern(this.ipReg)]);
          sgPort1?.setValidators([Validators.required, Validators.pattern(/^\d{1,5}$/), Validators.min(1), Validators.max(65535)]);
          sgPort2?.setValidators([Validators.pattern(/^\d{1,5}$/), Validators.min(1), Validators.max(65535)]);
          sgIp?.updateValueAndValidity();
          sgPort1?.updateValueAndValidity();
          return;
        } else {
          const signalingBody = {
            gwName: this.selectedRowValues.name,
            sgIPAddr1: this.editOperationForm.get('sgIp')?.value,
            sgIPAddr2: '0.0.0.0',
            sgPort1: this.editOperationForm.get('sgPort1')?.value,
            sgPort2: this.editOperationForm.get('sgPort2')?.value
              ? this.editOperationForm.get('sgPort2')?.value
              : '0'
          };
          this.changeSignalingGWMessage = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS
            .CHANGE_SIGNALING_GW_IP.CONFIRM.MESSAGE_ABOUT_VALUE +
          this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.CHANGE_SIGNALING_GW_IP.CONFIRM.VALUES +
          this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.CHANGE_SIGNALING_GW_IP.CONFIRM.CONFIRM_MESSAGE;
          this.changeSignalingGWMessage = this.changeSignalingGWMessage
            .replace(/{{sgIp}}/, signalingBody.sgIPAddr1)
            .replace(/{{port1}}/, signalingBody.sgPort1)
            .replace(/{{port2}}/, signalingBody.sgPort2);
          this.signalingBodyValue = signalingBody;
          this.showChangeSignalingGWConfirmDialog = true;
          break;
        }
      case EOperationName.LBL_INFO:
        if(updateFormValidators) {
          this.validatorFieldsRefs = [];
          const mgcsecipAddress = this.getFormFieldControl('mgcsecipAddress');
          const secipAddress = this.getFormFieldControl('secipAddress');
          const cac = this.getFormFieldControl('cac');
          this.validatorFieldsRefs.push(mgcsecipAddress, secipAddress, cac);

          mgcsecipAddress?.setValidators([ Validators.pattern(this.ipReg) ]);
          secipAddress?.setValidators([Validators.required, Validators.pattern(this.ipReg)]);
          cac?.setValidators([Validators.pattern('[0-9]')]);
          mgcsecipAddress?.updateValueAndValidity();
          secipAddress?.updateValueAndValidity();
          cac?.updateValueAndValidity();

          // set again the incoming data
          this.editOperationForm.get('mgcsecipAddress')?.setValue(this.backupFormData.mgcsecipAddress);
          this.editOperationForm.get('secipAddress')?.setValue(this.backupFormData.secipAddress);
          this.editOperationForm.get('cac')?.setValue(this.backupFormData.cac);
          // mark as pristine because if there is no change on form save btn must be disable
          this.editOperationForm.markAsPristine();
          this.editOperationForm?.updateValueAndValidity();

          return;
        } else {
          if (
            this.editOperationForm.get('mgcsecipAddress')?.value ||
            this.editOperationForm.get('secipAddress')?.value ||
            this.editOperationForm.get('cac')?.value
          ) {
            if (!this.editOperationForm.get('secipAddress')?.value) {
              this.commonService.showErrorMessage(
                this.translateResults.GATEWAY_CONTROLLERS.MESSAGE.GW_SECIP_EMPTY
              );
            }
            const lblInfobody = [
              [
                {
                  tag: 'clientVers',
                  value: '05'
                },
                {
                  tag: 'mgUIName',
                  value: this.selectedRowValues.name
                },
                {
                  tag: 'mgcSecIP',
                  value: this.editOperationForm.get('mgcsecipAddress')?.value
                },
                {
                  tag: 'mgSecIP',
                  value: this.editOperationForm.get('secipAddress')?.value
                },
                {
                  tag: 'mgCAC',
                  value: this.editOperationForm.get('cac')?.value
                    ? this.editOperationForm.get('cac')?.value
                    : '2'
                }
              ]
            ];
            this.isLoading = true;
            this.gwcService.postLgrpType(lblInfobody).subscribe({
              next: (res: any) => {
                this.editFormReset('');
                this.isLoading = false;
                this.editResultDialogContent = res.responseMsg;
                this.showEditResultDialog = true;
              },
              error: (err) => {
                this.editFormReset('');
                this.isLoading = false;
                this.commonService.showAPIError(err);
              },
              complete: () => {
                this.refreshGatewaysTable();
              }
            });
          }
          break;
        }
      case EOperationName.REMOVE_LBL:
        if(updateFormValidators) {
          return;
        } else {
          const rmLblbody = [
            [
              {
                tag: 'clientVers',
                value: '05'
              },
              {
                tag: 'mgUIName',
                value: this.selectedRowValues.name
              },
              {
                tag: 'mgLGRPType',
                value: 'disabled'
              }
            ]
          ];
          this.isLoading = true;
          this.gwcService.postLgrpType(rmLblbody).subscribe({
            next: (res: any) => {
              this.editFormReset('');
              this.isLoading = false;
              this.editResultDialogContent = res.responseMsg;
              this.showEditResultDialog = true;
            },
            error: (err) => {
              this.editFormReset('');
              this.isLoading = false;
              this.commonService.showAPIError(err);
            },
            complete: () => {
              this.refreshGatewaysTable();
            }
          });
          break;
        }
      case EOperationName.PROFILE_BULK:
        if(updateFormValidators) {
          return;
        } else {
          this.postBulkBody = this.selectedRows.map((entry, index) => {
            const entryBody = [
              { tag: 'mgUIName', value: entry.name },
              {
                tag: 'mgProfileName',
                value: this.editOperationForm.get('profile')?.value
              }
            ];
            if (index === 0) {
              entryBody.unshift({ tag: 'clientVers', value: '05' });
            }
            return entryBody;
          });
          this.isLoading = true;
          this.gwcService.postLgrpType(this.postBulkBody).subscribe({
            next: (res: any) => {
              this.editFormReset('');
              this.isLoading = false;
              this.editResultDialogContent = res.responseMsg;
              this.showEditResultDialog = true;
            },
            error: (err) => {
              this.editFormReset('');
              this.isLoading = false;
              this.commonService.showAPIError(err);
            },
            complete: () => {
              this.refreshGatewaysTable();
            }
          });
          break;
        }
    }
  }

  closeChangeSignalingGWConfirmDialog() {
    this.showChangeSignalingGWConfirmDialog = false;
  }

  changeSignalingGWDialogFooterHandler(event: any) {
    if (event) {
      this.isLoading = true;
      this.gwcService
        .postSignalingGwInfo(this.selectedRowValues.gwcID, this.signalingBodyValue)
        .subscribe({
          next: () => {
            this.showChangeSignalingGWConfirmDialog = false;
            this.editFormReset('');
            this.isLoading = false;
            this.editResultDialogContent =
              this.selectedRowValues.name +
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                .GATEWAYS.TABLE.EDIT_RESULT_MSG.SIGNALING;
            this.showEditResultDialog = true;
          },
          error: (errSignaling) => {
            this.editFormReset('');
            this.isLoading = false;
            this.errorData = errSignaling?.error || errSignaling;
            const messageAndDetails = JSON.stringify(this.errorData.message);
            const parsedData = messageAndDetails.split('details = ');
            this.messageText = `"${this.selectedRowValues.name}" : ${this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS
              .CHANGE_SIGNALING_GW_IP.ERROR.MESSAGE} ${parsedData[0].split('"message = ')[1].replace(/\\n/g, '\n')}`;
            this.editResultDialogContent = this.messageText;
            this.showEditResultDialog = true;
          },
          complete: () => {
            this.refreshGatewaysTable();
          }
        });
    } else {
      this.closeChangeSignalingGWConfirmDialog();
    }
  }

  closeInfoPopup() {
    this.showInfoPopup = false;
    this.infoPopupTitle = '';
    this.infoPopupMessage = '';
  }

  onWarningChangeGWCapacityFormSubmit(event: any) {
    if (event) {
      this.closeWarningPopup();
      this.isLoading = true;
      this.gwcService
        .saveLgrpType(this.currentGwcName, this.selectedRowValues.name)
        .subscribe({
          next: (res: GatewayListResponse) => {
            const capacityBody = [
              [
                {
                  tag: 'clientVers',
                  value: '05'
                },
                {
                  tag: 'mgUIName',
                  value: this.selectedRowValues.name
                },
                {
                  tag: 'reservedTerminations',
                  value: this.editOperationForm.get('gwCapacity')?.value
                },
                {
                  tag: 'mgOldLGRPType',
                  value: res.gatewayList[0].configuration.lgrpType
                },
                {
                  tag: 'mgOldLGRPSize',
                  value: res.gatewayList[0].configuration.reservedEndpoints
                },
                {
                  tag: 'mgOldisShared',
                  value: res.gatewayList[0].configuration.isShared
                },
                {
                  tag: 'mgOldExtStTerm',
                  value: res.gatewayList[0].configuration.extStTerm
                },
                {
                  tag: 'mgOldNodeNo',
                  value: res.gatewayList[0].configuration.nodeNumber
                }
              ]
            ];
            this.gwcService.postLgrpType(capacityBody).subscribe({
              next: (capacityRes: any) => {
                this.isLoading = false;
                this.editResultDialogContent = capacityRes.responseMsg;
                this.showEditResultDialog = true;
              },
              error: (err) => {
                this.isLoading = false;
                this.commonService.showAPIError(err);
              },
              complete: () => {
                this.refreshGatewaysTable();
              }
            });
          },
          error: (err) => {
            this.isLoading = false;
            this.commonService.showAPIError(err);
          }
        });
    } else {
      this.closeWarningPopup();
    }
  }

  closeWarningPopup() {
    this.showWarningPopupChangeGWCapacity = false;
  }

  onWarningChangeLGRPFormSubmit(event: boolean){
    if(event){
      this.closeLGRPWarningPopup();
      this.isLoading = true;
      this.isNodeShare = this.editOperationForm.get('lgrpType')?.value
        ? 'Y'
        : 'N';
      this.gwcService
        .saveLgrpType(
          this.selectedRowValues.gwcID,
          this.selectedRowValues.name
        )
        .subscribe({
          next: (res: GatewayListResponse) => {
            const lgrpTypeBody = [
              [
                {
                  tag: 'clientVers',
                  value: '05'
                },
                {
                  tag: 'mgUIName',
                  value: this.selectedRowValues.name
                },
                {
                  tag: 'mgLGRPType',
                  value: this.editOperationForm.get('lgrpType')?.value
                },
                {
                  tag: 'mgOldLGRPType',
                  value: res.gatewayList[0].configuration.lgrpType
                },
                {
                  tag: 'mgOldLGRPSize',
                  value: res.gatewayList[0].configuration.reservedEndpoints
                },
                {
                  tag: 'isShared',
                  value: this.editOperationForm.get('nodeSharing')?.value
                    ? 'Y'
                    : 'N'
                },
                {
                  tag: 'mgOldisShared',
                  value: res.gatewayList[0].configuration.isShared
                },
                {
                  tag: 'mgOldExtStTerm',
                  value: res.gatewayList[0].configuration.extStTerm
                },
                {
                  tag: 'mgOldNodeNo',
                  value: res.gatewayList[0].configuration.nodeNumber
                }
              ]
            ];

            this.gwcService.postLgrpType(lgrpTypeBody).subscribe({
              next: (postLgrpRes: any) => {
                this.editFormReset('');
                this.isLoading = false;
                this.editResultDialogContent = postLgrpRes.responseMsg;
                this.showEditResultDialog = true;
              },
              error: (err) => {
                this.editFormReset('');
                this.isLoading = false;
                this.commonService.showAPIError(err);
              },
              complete: () => {
                this.refreshGatewaysTable();
              }
            });
          },
          error: (err) => {
            this.isLoading = false;
            this.commonService.showAPIError(err);
          }
        });
    } else{
      this.closeLGRPWarningPopup();
    }
  }

  closeLGRPWarningPopup(){
    this.showWarningPopupChangeLGRP = false;
  }

  private editFormReset(operationName: string) {
    this.editOperationForm.setValue({
      operationName,
      alg: '',
      pepServer: '',
      gwCapacity: '',
      profile: '',
      lgrpType: '',
      grGw: { label: '', value: '' },
      ip: '',
      port: '',
      sgIp: '',
      sgPort1: '',
      sgPort2: '',
      mgcsecipAddress: '',
      secipAddress: '',
      cac: '',
      nodeSharing: ''
    }, { emitEvent: false});
  }

  refreshGatewaysTable() {
    if (this.retrieveForm.controls['retrivalCriteria'].value) {
      this.onRetrieveHandle(true);
    } else {
      this.onRetriveAllHandle();
    }
    this.showEditDialog = false;
  }

  initCols() {
    this.gatewaysTableCols = [
      {
        field: FieldName.Checkbox,
        header: '',
        sort: false,
        data: [],
        colsEnable: true
      },
      {
        data: [],
        field: 'name',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.NAME,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'defaultDomainName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.DOMAIN,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'ipAddress',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.IP_ADDRESS,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'mgcsecipAddress',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.MGC_SECIP,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'secipAddress',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.GW_SECIP,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'profileName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.PROFILE,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'maxTerms',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.MAX_TERMS,
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'resTerms',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.RES_TERMS,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'protocol',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.PROTOCOL,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'protVers',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.PROT_VERS,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'protPort',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.PROT_PORT,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'pepServerName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.PEP_SERVER,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'algName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.ALG,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'nodeName',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.NODE_NAME,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'nodeNumber',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.NODE_NUMBER,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'combinedColumn',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.F_U_S,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'locality',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.LGRPLOC,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'cac',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.LBL_CAC,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'lgrptype',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.LGRP_TYPE,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'isShared',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.IS_SHARED,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: 'extStTerm',
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.EXTSTTERM,
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      },
      {
        data: [],
        field: FieldName.Action,
        header: this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.COLS.ACTION,
        colsEnable: true,
        sort: false,
        autoSetWidth: true,
        manualColWidth: 120,
        manualMinColWidth: 120
      }
    ];
  }

  onRetrieveHandle(event: boolean) {
    // reset - false
    // retrieve - true
    const inputValue = this.retrieveForm.get('retrivalCriteria')?.value?.trim();
    if (inputValue !== undefined && (inputValue !== '' && !this.isValueSearchedBefore(inputValue))) {
      const newItem = { label: inputValue, value: inputValue };
      this.searchHistory.push(newItem);
      // Save searchHistory to sessionStorage
      sessionStorage.setItem(
        'searchHistory',
        JSON.stringify(this.searchHistory)
      );
    }
    if (event) {
      const searchString = this.retrieveForm.get('retrivalCriteria')?.value;
      const limitResult = this.retrieveForm.get('limitResult')?.value;
      const maxReturnRows =  limitResult < 0 ? '3000' : limitResult;
      if (isNaN(maxReturnRows) || !maxReturnRows || maxReturnRows >= 2147483647) {
        this.commonService.showErrorMessage(this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.ERROR.NUMERIC);
        return;
      }
      this.isLoading = true;
      this.gwcService
        .getGatewayDataSearchRetrive(this.gwcIp, searchString, maxReturnRows)
        .pipe(
          take(1),
          retry(1),
          tap((res: GatewayDataSearchResponse) => {
            this.isLoading = false;
            this.selectedRows=[];
            const tableDataBackup = this.gatewaysTableData;
            this.gatewaysTableData = [];
            const transformedData = res.gwData.map(
              (item: IProvisioningGatewaysTable) => ({
                ...item,
                combinedColumn: `${item.frame}/${item.shelf}/${item.slot}`,
                defaultDomainName:
                    item.defaultDomainName === 'NOT_SET'
                      ? ''
                      : item.defaultDomainName,
                mgcsecipAddress:
                    item.mgcsecipAddress === 'null' ? '' : item.mgcsecipAddress,
                secipAddress:
                    item.secipAddress === 'null' ? '' : item.secipAddress,
                profileName:
                    item.profileName === 'null' ? '' : item.profileName,
                lgrptype: item.lgrptype === 'null' ? '' : item.lgrptype,
                cac: item.cac === -1 ? '' : item.cac
              })
            );
            this.gatewaysTableData = [
              ...(this.retrieveForm.get('radioButton')?.value === 'appendToList'
                ? tableDataBackup
                : []),
              ...transformedData
            ];
          })
        )
        .subscribe({
          error: (error) => {
            this.isLoading = false;
            this.titleText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.ERROR.TITLE;
            this.errorData = error?.error || error;
            const messageAndDetails = JSON.stringify(this.errorData?.message);
            const parsedData = messageAndDetails?.split('details = ');
            this.detailsText = parsedData[0]?.split('message = ')[1]?.replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' ) || '';
            this.messageText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.ERROR.MESSAGE;
            this.showRetrieveHandleErrorDialog = true;
          }
        });

    } else {
      this.setDefaultValues();
    }
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  closeRetrieveHandleErrorDialog() {
    this.showRetrieveHandleErrorDialog = false;
    this.showDetailsBtn = true;
    this.titleText = '';
    this.messageText = '';
    this.detailsText = '';
  }

  onRetriveAllHandle() {
    this.retrieveForm = this.fb.group({
      radioButton: ['replaceList', []]
    });
    this.isLoading = true;
    this.gwcService
      .getGatewayDataSearchRetriveAll(this.gwControllerName)
      .pipe(take(1), retry(1))
      .subscribe({
        next: (res: GatewayDataSearchResponse) => {
          this.isLoading = false;
          this.selectedRows=[];
          this.gatewaysTableData = [];
          this.gatewaysTableData = res.gwData.map(
            (item: IProvisioningGatewaysTable) => ({
              ...item,
              combinedColumn: `${item.frame}/${item.shelf}/${item.slot}`,
              defaultDomainName:
                item.defaultDomainName === 'NOT_SET'
                  ? ''
                  : item.defaultDomainName,
              mgcsecipAddress:
                item.mgcsecipAddress === 'null' ? '' : item.mgcsecipAddress,
              secipAddress:
                item.secipAddress === 'null' ? '' : item.secipAddress,
              profileName: item.profileName === 'null' ? '' : item.profileName,
              lgrptype: item.lgrptype === 'null' ? '' : item.lgrptype,
              cac: item.cac === -1 ? '' : item.cac
            })
          );
        },
        error: (error) => {
          this.isLoading = false;
          this.commonService.showAPIError(error);
        }
      });
    this.setDefaultValues();
  }

  setDefaultValues() {
    this.retrieveForm = this.fb.group({
      limitResult: ['25'],
      retrivalCriteria: [],
      radioButton: ['replaceList', []]
    });
  }

  isValueSearchedBefore(value: string): boolean {
    return this.searchHistory.some((item) => item.value === value);
  }

  onDetailHandle(data: IProvisioningGatewaysTable) {
    const signalingPromise = this.callSignalingGwInfo(data);
    const applicationPromise = this.callGwApplicationData(data);
    const grGwNamePromise = this.callGrGwName(data);
    this.commonService.showInfoMessage(
      this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE
        .DETAIL_INFO
    );

    Promise.all([signalingPromise, grGwNamePromise, applicationPromise])
      .then(([signalingRes, applicationRes, applicationPromiseRes]) => {
        this.isLoading = false;
        if (!signalingRes && !applicationRes && !applicationPromiseRes) {
          // Checking all three responses are empty
          this.showNoResDialogContent =
            this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.ACTION_DETAILS.NO_RES_MESSAGE.replace(
              /{{gwName}}/,
              data.name
            );
          this.showNoResDialog = true;
        }
      })
      .catch((error) => {
        this.isLoading = false;
        this.commonService.showErrorMessage(error);
      });
  }

  callSignalingGwInfo(data: IProvisioningGatewaysTable): Promise<any> {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.gwcService.getSignalingGwInfo(data.name).subscribe({
        next: (res: string[]) => {
          if (res && res.length) {
            this.dynamicDialogContent = {
              title: 'Details',
              rows: [{ label: 'Gateway Name', value: data.name }],
              subtitle: 'Signaling Gateway Information',
              subRows: [
                { label: 'SIG IP', value: res[0] },
                { label: 'SIG PORT 1', value: res[1] },
                {
                  label: 'SIG PORT 2',
                  value: res[2] === '0' ? 'NOT_SET' : res[2]
                }
              ]
            };
            this.openDetailDialog();
            this.isLoading = false;
            resolve(res);
          } else {
            this.isLoading = false;
            resolve(null);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.commonService.showErrorMessage(err);
          reject(err);
        }
      });
    });
  }

  callGwApplicationData(data: IProvisioningGatewaysTable): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.isLoading = true;
        this.gwcService.getGwApplicationData(data.name).subscribe({
          next: (res: IGwApplicationData) => {
            if (res.keyValuePairs && res.keyValuePairs.length) {
              this.gwApplicationData = res;
              this.dynamicDialogContent = {
                title: 'Details',
                rows: [{ label: 'Gateway Name', value: data.name }],
                subtitle: 'Gateway Application Data',
                subRows: [
                  {
                    label: res.keyValuePairs[0].name,
                    value: res.keyValuePairs[0].value
                  }
                ]
              };
              this.openDetailDialog();
              this.isLoading = false;
              resolve(res);
            } else {
              this.isLoading = false;
              resolve(null);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.commonService.showErrorMessage(err);
            reject(err);
          }
        });
      }, 5000);
    });
  }

  callGrGwName(data: IProvisioningGatewaysTable): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.isLoading = true;
        this.gwcService.getGrGwName(data.name).subscribe({
          next: (res: any) => {
            if (res) {
              this.dynamicDialogContent = {
                title: 'Details',
                rows: [
                  { label: 'Gateway Name', value: data.name },
                  { label: 'GR-834 Gateway Name', value: res }
                ]
              };
              this.openDetailDialog();
              this.isLoading = false;
              resolve(res);
            } else {
              this.isLoading = false;
              resolve(null);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.commonService.showErrorMessage(err);
            reject(err);
          }
        });
      }, 10000);
    });
  }

  onEditHandle(data: IProvisioningGatewaysTable) {
    this.operationNameOptions = [
      { label: EOperationName.ALG, value: EOperationName.ALG },
      { label: EOperationName.PEP_SERVER, value: EOperationName.PEP_SERVER },
      { label: EOperationName.GATEWAY_CAPACITY, value: EOperationName.GATEWAY_CAPACITY },
      { label: EOperationName.PROFILE, value: EOperationName.PROFILE }
    ];
    this.movedToSource = false;
    this.movedToTarget = false;
    this.removeCount = 0;
    this.addCount = 0;

    const algPromise = this.getAlg();
    const pepServerPromise = this.getPepServer();
    const gwCapacityPromise = this.getGwCapacity(data.profileName, data.name);
    const profilesPromise = this.getProfiles(data.name);
    const lgrpTypePromise = this.getLgrpType(data.name);
    const grGwPromise = this.handleGrGw(data.profileName, data.name);
    const gwIpPromise = this.handleGwIP(data.name);
    const signalingGwPromise = this.handleSignalingGw(data.name);
    const lblInfoPromise = this.handleLblInfo(
      data.profileName,
      data.name,
      this.currentGwcName
    );

    this.isLoading = true;
    Promise.all([
      algPromise,
      pepServerPromise,
      gwCapacityPromise,
      profilesPromise,
      lgrpTypePromise,
      grGwPromise,
      gwIpPromise,
      signalingGwPromise,
      lblInfoPromise
    ])
      .then(
        ([
          algResult,
          pepServerResult,
          gwCapacityResult,
          profilesResult,
          lgrpTypeResult,
          grGwResult,
          gwIpResult,
          signalingGwResult,
          lblInfoResult
        ]) => {
          // Checking if all promises resolved successfully
          this.isLoading = false;
          if (
            algResult !== undefined &&
            pepServerResult !== undefined &&
            gwCapacityResult !== undefined &&
            profilesResult !== undefined &&
            lgrpTypeResult !== undefined &&
            grGwResult !== undefined &&
            gwIpResult !== undefined &&
            signalingGwResult !== undefined &&
            lblInfoResult !== undefined
          ) {
            this.showEditDialog = true;
          }
        }
      )
      .catch((error) => {
        this.isLoading = false;
        this.commonService.showErrorMessage(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getAlg(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gwcService.getAlg().subscribe({
        next: (res: any) => {
          const tempOptions = [{ label: '', value: '' }];
          if (res) {
            for (let i = 0; i < res.count; i++) {
              tempOptions.push({
                label: res.list[i]?.name,
                value: res.list[i]?.name
              });
            }
          }
          this.algOptions = tempOptions;
          resolve(res);
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          reject(err);
        }
      });
    });
  }

  getPepServer(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gwcService.getPepServer().subscribe({
        next: (res: any) => {
          const tempOptions = [{ label: '', value: '' }];
          if (res) {
            for (let i = 0; i < res.count; i++) {
              tempOptions.push({
                label: res.list[i]?.name,
                value: res.list[i]?.name
              });
            }
          }
          this.pepServerOptions = tempOptions;
          resolve(res);
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          reject(err);
        }
      });
    });
  }

  getGwCapacity(profileName: string, gwName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gwcService.getGwCapacity_Profiles(profileName).subscribe({
        next: (res: IGwCapacity) => {
          if (res.multiSiteNamesSupported === 'true') {
            this.multiSiteNamesSupported = 'true';
          } else {
            this.multiSiteNamesSupported = 'false';
          }
          resolve(res);
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          reject(err);
        }
      });
      this.gwcService.getTableCache().subscribe({
        next: (res: string[]) => {
          this.availableCapacityList = res.map((name: string) => ({ name }));
        },
        error: (err) => {
          this.commonService.showAPIError(err);
        }
      });
      this.gwcService
        .getGwCapacityPickList(this.currentGwcName, gwName)
        .subscribe({
          next: (res: any) => {
            this.provisionedLgrps = res.epgData.map((item: any) => ({
              name: item.endpointGroupName
            }));
          }
        });
    });
  }

  getProfiles(gwName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gwcService.getEditProfiles(gwName).subscribe({
        next: (res: string[]) => {
          const tempOptions = [];
          if (res) {
            for (let i = 0; i < res.length; i++) {
              tempOptions.push({
                label: res[i],
                value: res[i]
              });
            }
          }
          this.profileOptions = tempOptions;
          resolve(res);
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          reject(err);
        }
      });
    });
  }

  getLgrpType(gwName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gwcService.getGWCNodeByName_v1(this.currentGwcName).subscribe({
        next: (res: GWCNode) => {
          const profileName = res.serviceConfiguration.gwcProfileName;
          if (
            profileName.includes('LARGE_LINENA_V3') ||
            profileName.includes('LARGE_LINENA_V4') ||
            profileName.includes('LARGE_LINEINTL_V3')
          ) {
            this.operationNameOptions.push({
              label: EOperationName.LGRP_TYPE,
              value: EOperationName.LGRP_TYPE
            });
          }
          resolve(res);
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          reject(err);
        }
      });
      this.gwcService.getLgrpType(gwName).subscribe({
        next: (res: ILgrpType) => {
          if (res.endpointType.__value === 8) {
            const lgrpTypes = res.lgrpType.split(',');
            this.lgrpTypeOptions = lgrpTypes.map((type) => ({
              label: type.trim(),
              value: type.trim()
            }));
            resolve(this.lgrpTypeOptions);
          } else {
            resolve([]);
          }
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          reject(err);
        }
      });
    });
  }

  handleGrGw(profileName: string, gwName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gwcService.isSupportMlt(profileName).subscribe({
        next: (res: any) => {
          if (res === 'true') {
            this.operationNameOptions.push({
              label: EOperationName.GR_834,
              value: EOperationName.GR_834
            });
            this.gwcService
              .getGrGwTypeByProfile(profileName)
              .pipe(
                tap((grGwByProfileRes: any) => {
                  this.gwcService.getGrGwNamesByType(grGwByProfileRes).subscribe({
                    next: (grGwByTypeRes: string[]) => {
                      const tempOptions = [{ label: '', value: '' }];
                      if (grGwByTypeRes) {
                        for (let i = 0; i < grGwByTypeRes.length; i++) {
                          tempOptions.push({
                            label: grGwByTypeRes[i],
                            value: grGwByTypeRes[i]
                          });
                        }
                        this.gwcService
                          .isGrGwSet(gwName)
                          .pipe(
                            tap((grGwSetRes: string) => {
                              this.editOperationForm.controls['grGw'].setValue(
                                grGwSetRes
                              );
                            })
                          )
                          .subscribe();
                      }
                      this.grGwOptions = tempOptions;
                      resolve(grGwByTypeRes);
                    }
                  });
                })
              )
              .subscribe();
          }
          resolve(res);
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          reject(err);
        }
      });
    });
  }

  handleGwIP(gwName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gwcService.getLgrpType(gwName).subscribe({
        next: (res: ILgrpType) => {
          if (res.changeIPAvailable === 'true') {
            this.operationNameOptions.push({
              label: EOperationName.IP_ADDRESS,
              value: EOperationName.IP_ADDRESS
            });
          }
          resolve(res);
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          reject(err);
        }
      });
    });
  }

  handleSignalingGw(gwName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gwcService.getLgrpType(gwName).subscribe({
        next: (res: ILgrpType) => {
          const gwcName = res.name;
          if (
            gwcName.includes('GENBAND_G9_NA') ||
            gwcName.includes('GENBAND_G9_INTL') ||
            gwcName.includes('GENBAND_G9_V52')
          ) {
            this.operationNameOptions.push({
              label: EOperationName.SIGNALING,
              value: EOperationName.SIGNALING
            });
          }
          resolve(res);
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          reject(err);
        }
      });
    });
  }

  handleLblInfo(
    profileName: string,
    gwName: string,
    gwcId: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.isLine = null;
      this.isSipline = null;
      this.gwcService
        .isLblSupported(gwcId)
        .pipe(
          tap((res: boolean) => {
            if (res === true) {
              this.gwcService.getLgrpType(gwName).subscribe({
                next: (lgrpRes: ILgrpType) => {
                  this.lblCategory = lgrpRes.category.__value;
                  this.inventoryType = lgrpRes.inventoryType;
                  this.gwcService
                    .getGatewayDataSearchRetrive(this.gwcIp, gwName, 0)
                    .pipe(
                      tap((retrieveRes: GatewayDataSearchResponse) => {
                        this.lblProfileName = retrieveRes.gwData[0].profileName;
                        if (retrieveRes.gwData[0].secipAddress !== 'null') {
                          this.operationNameOptions.push({
                            label: EOperationName.REMOVE_LBL,
                            value: EOperationName.REMOVE_LBL
                          });
                          this.editOperationForm.controls[
                            'mgcsecipAddress'
                          ].setValue(
                            retrieveRes.gwData[0].mgcsecipAddress.replace('null', '')
                          );
                          this.editOperationForm.controls[
                            'secipAddress'
                          ].setValue(
                            retrieveRes.gwData[0].secipAddress.replace('null', '')
                          );
                          // eslint-disable-next-line
                          retrieveRes.gwData[0].cac === -1
                            ? null
                            : this.editOperationForm.controls['cac'].setValue(
                              retrieveRes.gwData[0].cac
                            );
                          this.editOperationForm.markAsPristine();
                          this.editOperationForm.updateValueAndValidity();
                        }
                        resolve(res);
                      })
                    )
                    .subscribe({
                      next: () => {
                        if (this.lblCategory === 1 && this.lblProfileName) {
                          this.nvService
                            .getProfileData(profileName)
                            .pipe(
                              tap((profileRes: ILblProfileData) => {
                                if (profileRes.serviceTypes.length > 0) {
                                  this.isLine = false;
                                  this.isSipline = false;
                                  if (
                                    profileRes.serviceTypes.some(
                                      (type) => type.__value === 0
                                    )
                                  ) {
                                    this.isLine = true;
                                  }
                                  if (
                                    this.inventoryType === profileRes.identifier
                                  ) {
                                    this.isSipline = true;
                                  }
                                }
                              })
                            )
                            .subscribe({
                              next: () => {
                                if (this.isLine && !this.isSipline) {
                                  this.operationNameOptions.push({
                                    label: EOperationName.LBL_INFO,
                                    value: EOperationName.LBL_INFO
                                  });
                                }
                              }
                            });
                        }
                      }
                    });
                },
                error: (err) => {
                  this.commonService.showAPIError(err);
                  reject(err);
                }
              });
            }
            resolve(res);
          })
        )
        .subscribe();
    });
  }

  onEditOperationFormSubmit(event: boolean) {
    // close - false
    // save - true
    resetDefaultPostBody();
    if (event) {
      if (this.isBulkAction) {
        this.handleOperationChange(EOperationName.PROFILE_BULK);
        this.clearSelectedOption();
      }
      this.handleOperationChange(this.selectedOperation);
    } else {
      this.closeEditDialog();
      this.editFormReset('');
      this.clearSelectedOption();
    }
    this.isBulkAction = false;
  }

  closeEditDialog() {
    this.clearSelectedOption();
    this.showEditDialog = false;
  }

  closeNoResDialog() {
    this.showNoResDialog = false;
  }

  openDetailDialog(): void {
    this.showDetailDialog = true;
  }

  closeDetailDialog(): void {
    this.showDetailDialog = false;
  }

  closeEditResultDialog(): void {
    this.showEditResultDialog = false;
    this.closeEditDialog();
    this.closeErrorDialog();
  }

  closeErrorDialog() {
    this.showChangeSignalingGWConfirmDialog = false;
    this.changeSignalingGWMessage = '';
  }

  onCheckboxChange(event: any) {
    if (event) {
      this.selectedRows = event.selectedRows;
      if (this.selectedRows.length === 0) {
        this.selectedAction = null;
      }
    }
  }

  clearSelectedOption() {
    setTimeout(() => {
      this.selectedAction = null;
    }, 100);
  }

  callAction() {
    if (this.selectedRows.length <= LINE_LIMIT.LIMIT) {
      const areProfileNamesSame: boolean = this.selectedRows.every(
        (obj, index, array) => obj.profileName === array[0].profileName
      );
      if (areProfileNamesSame) {
        this.isBulkAction = true;
        this.editOperationForm.controls['operationName'].setValue(EOperationName.PROFILE);
        this.onEditHandle(this.selectedRows[0]);
        this.getProfiles(this.selectedRows[0].name);
      } else {
        this.commonService.showErrorMessage(
          'This operation is only supported for gateways with the same profile'
        );
        this.clearSelectedOption();
      }
    } else {
      this.commonService.showErrorMessage(
        this.translateResults.GATEWAY_CONTROLLERS.MESSAGE.MAX_LINE_LIMIT?.replace(
          '{{LIMIT}}',
          LINE_LIMIT.LIMIT
        )
      );
    }
  }

  closeAssociateDialog() {
    this.showAssociateDialog = false;
  }

  checkDisableSaveBtnOnEditPopup(): boolean {
    const operationName = this.editOperationForm.get('operationName')?.value;

    if (this.multiSiteNamesSupported === 'true' && operationName === EOperationName.GATEWAY_CAPACITY) {
      return this.provisionedLgrps.length === 0;
    }
    return false;
  }
}
