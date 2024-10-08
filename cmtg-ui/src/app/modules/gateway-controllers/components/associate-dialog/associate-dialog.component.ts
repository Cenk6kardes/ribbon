import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GatewayControllersService } from '../../services/gateway-controllers.service';
import { CommonService } from 'src/app/services/common.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';
import { Subscription, forkJoin } from 'rxjs';
import {
  GatewayInformationOptions,
  IAssociateRequestBody,
  IConfirm,
  IMultiSide,
  ProtocolInfo,
  SupportedProtocols,
  protocolInfoList
} from '../../models/gwControllers';
import { AssociateFormService } from '../../services/associate-form.service';
import { AuditService } from 'src/app/modules/audit/services/audit.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-associate-dialog',
  templateUrl: './associate-dialog.component.html',
  styleUrls: ['./associate-dialog.component.scss']
})
export class AssociateDialogComponent
implements OnInit, OnChanges, AfterContentChecked {
  @Input() gwcname: string;
  @Input() header: string;
  @Input() showDialog: boolean;
  @Output() closeDetailDialog: EventEmitter<void> = new EventEmitter<void>();
  showSignalingGatewayPanel = false;
  isInprocess = false;
  showTGRPPanel = false;
  showGRPanel = false;
  showLGRPLocationPanel = false;
  showPEPServerALG = false;
  disableSubmit = true;
  multiSiteSelection = false;
  showGwcBackup = false;
  mainForm: FormGroup;
  gatewayInformation: FormGroup;
  gwcBackup: FormGroup;
  signalProtocol: FormGroup;
  signalProtocols: SupportedProtocols[];
  endpointNumber: number;
  gatewayOptions: GatewayInformationOptions = {
    gatewayControllerName: [],
    gatewayProfileName: [],
    siteName: []
  };
  formStatusSubscription: Subscription;
  maxEndpoints = 0;
  selectedSiteNames: IMultiSide = { timeout: 0, selectedSiteNames: [] };
  cac: string;

  messageText: string;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showDetailsBtn = true;
  showAddErrorDialog = false;
  translateResults: any;

  confirmDialog: {
    title: string;
    content: string;
    isShowConfirmDialog: boolean;
  } = {
      title: '',
      content: '',
      isShowConfirmDialog: false
    };

  successConfirm: {
    title: string;
    content: string;
    isShowConfirmDialog: boolean;
  } = {
      title: '',
      content: '',
      isShowConfirmDialog: false
    };

  confirmCAC: IConfirm = {
    title: '',
    content: '',
    isShowConfirmDialog: false,
    titleAccept: '',
    titleReject: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleAccept: (isAccept: boolean) => {}
  };
  gwcBackupBody: any;
  pep_alg_radioValue: string;

  constructor(
    private formService: AssociateFormService,
    private gwcService: GatewayControllersService,
    private commonService: CommonService,
    private networkViewService: NetworkViewService,
    private cd: ChangeDetectorRef,
    private auditService: AuditService,
    private translateService: TranslateInternalService
  ) {
    this.mainForm = this.formService.mainFormGroup;
    this.gatewayInformation = this.formService.gatewayInformation;
    this.gwcBackup = this.formService.gwcBackup;
    this.signalProtocol = this.formService.signalProtocol;
    this.translateResults = this.translateService.translateResults;
  }
  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showDialog'] && this.showDialog) {
      this.formStatusSubscription = this.mainForm.statusChanges.subscribe(
        (status) => {
          if (status === 'VALID') {
            this.disableSubmit = false;
          } else {
            this.disableSubmit = true;
          }
        }
      );
      if (this.gwcname) {
        this.gatewayInformation.get('controllerName')?.disable();
        this.gatewayInformation
          .get('controllerName')
          ?.patchValue(
            this.gatewayOptions.gatewayControllerName.find(
              (name) => name === this.gwcname
            )
          );
        this.gatewayInformation.get('controllerName')?.updateValueAndValidity();
      } else {
        this.gatewayInformation.get('controllerName')?.enable();
        this.gatewayInformation.get('controllerName')?.updateValueAndValidity();
      }
    }
    if (
      changes['showDialog'] &&
      !this.showDialog &&
      this.formStatusSubscription
    ) {
      this.formStatusSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getGatewayInformationOptions();
    this.gwcBackupBody = [];
  }

  getGatewayInformationOptions() {
    forkJoin({
      gatewayProfileName:
        this.networkViewService.getAllSupportedGatewayProfiles(),
      gatewayControllerName: this.networkViewService.getGWCNames(),
      siteName: this.gwcService.getGatewaySiteName()
    }).subscribe({
      next: (values) => {
        this.gatewayOptions = { ...values };
        this.gatewayOptions.gatewayProfileName.sort();
        this.gatewayOptions.gatewayControllerName.sort((a, b) => {
          const numA = parseInt(a.split('-')[1],10);
          const numB = parseInt(b.split('-')[1],10);
          return numA - numB;
        });
        this.cd.detectChanges();
      },
      error: (err) => {
        this.commonService.showAPIError(err);
      }
    });
  }

  multisiteSelection(multisiteSelection: boolean) {
    if (multisiteSelection) {
      this.gatewayInformation.get('reservedTerminations')?.disable();
    } else {
      this.gatewayInformation.get('reservedTerminations')?.enable();
    }
    this.gatewayInformation
      .get('reservedTerminations')
      ?.updateValueAndValidity();
    this.multiSiteSelection = multisiteSelection;
  }

  maxEndpoint(maxEndpoint: number) {
    this.maxEndpoints = maxEndpoint;
  }

  signalingGateway(signalingGatewayPanel: boolean) {
    this.showSignalingGatewayPanel = signalingGatewayPanel;
  }

  TGRPPanel(TGRPPanel: boolean) {
    this.showTGRPPanel = TGRPPanel;
  }

  gwcBackupPanel(isGwcBackup: boolean) {
    this.showGwcBackup = isGwcBackup;
  }

  GRPanel(GRPanel: boolean) {
    this.showGRPanel = GRPanel;
  }

  SignalProtocols(supportedProtocols: SupportedProtocols[]) {
    this.signalProtocols = supportedProtocols;
  }

  siteNames(siteNames: IMultiSide) {
    this.selectedSiteNames = siteNames;
  }

  LGRPLocationPanel(endpointnumber: number) {
    if (endpointnumber === -1) {
      this.showLGRPLocationPanel = false;
    } else {
      this.showLGRPLocationPanel = true;
      this.endpointNumber = endpointnumber;
    }
  }

  PEPServerALGPanel(show: boolean) {
    this.showPEPServerALG = show;
  }

  pep_alg_radio(selected: string) {
    this.pep_alg_radioValue = selected;
  }

  closeDialog(): void {
    this.showLGRPLocationPanel = false;
    this.showPEPServerALG = false;
    this.showSignalingGatewayPanel = false;
    this.showTGRPPanel = false;
    this.showGRPanel = false;
    this.multiSiteSelection = false;
    this.mainForm.reset();
    this.mainForm.get('gatewayInformation.reservedTerminations')?.clearValidators();
    this.mainForm.updateValueAndValidity();
    this.closeDetailDialog.emit();
  }

  onAssociateFormSubmit(event: boolean) {
    if (event) {
      this.checkIsAuditRunning();
    } else {
      this.closeDialog();
    }
  }
  // Functions will run one by one below after Form Submit
  checkIsAuditRunning() {
    this.isInprocess = true;
    this.auditService.getRunningAudit().subscribe({
      next: (res) => {
        this.isInprocess = false;
        if (res.length > 0) {
          this.detailsText =
            this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.AUDIT_DETAIL;
          this.messageText =
            this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.FAILED_TO_ASSOCIATE;
          this.showAddErrorDialog = true;
        } else {
          const ipAddress = this.gatewayInformation.get('ipAddress')?.value;
          if (
            ipAddress === null ||
            ipAddress === '' ||
            ipAddress === '0.0.0.0'
          ) {
            this.IfGWIPEmpty();
          } else {
            this.genbandProfileNamesValidation();
          }
        }
      },
      error: (err) => {
        this.isInprocess = false;
        this.commonService.showAPIError(err);
      }
    });
  }

  IfGWIPEmpty() {
    this.isInprocess = true;
    let discoverySupported = false;
    let gotItrans;
    let goTrunk;
    this.networkViewService
      .getProfileData(this.gatewayInformation.get('profileName')?.value)
      .subscribe({
        next: (res) => {
          this.isInprocess = false;
          const category = res.category.__value;
          const serviceTypes = res.serviceTypes.map(
            (serviceType: { __value: number }) => serviceType.__value
          );
          if (
            category === 1 &&
            serviceTypes.length > 0 &&
            serviceTypes != null
          ) {
            gotItrans = false;
            goTrunk = false;
            if (serviceTypes.includes(1)) {
              goTrunk = true;
            }
            if (serviceTypes.includes(5)) {
              gotItrans = true;
            }
            if (gotItrans && goTrunk) {
              discoverySupported = true;
            }
          }
          if (category === 2) {
            discoverySupported = true;
          }
          if (discoverySupported) {
            this.gatewayInformation.get('ipAddress')?.setValue('0.0.0.0');
          }
          if (discoverySupported === false) {
            this.commonService.showErrorMessage(
              this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL
                .GWIP_ERROR
            );
          } else {
            this.genbandProfileNamesValidation();
          }
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          this.isInprocess = false;
        }
      });
  }

  genbandProfileNamesValidation() {
    this.isInprocess = true;
    const profileName = this.gatewayInformation.get('profileName')?.value;
    const gwcId = this.gatewayInformation.get('controllerName')?.value;
    let loadVersion = 'GC16';
    let unit0flag = false;
    let unit1flag = true;
    if (
      (gwcId && profileName === 'GENBAND_G9_INTL') ||
      profileName === 'GENBAND_G9_NA'
    ) {
      this.gwcService.getUnitStatus(gwcId).subscribe({
        next: (unitRes) => {
          const unit0IP = unitRes.unit0IPAddr;
          const unit1IP = unitRes.unit1IPAddr;
          this.gwcService.getGWCLoadName2(unit0IP, false).subscribe({
            next: (response) => {
              const unitObj = this.genbandProfileCheckingUnits(
                response,
                loadVersion
              );
              unit0flag = unitObj.unitFlag;
              loadVersion = unitObj.loadVersion;
              this.gwcService.getGWCLoadName2(unit1IP, false).subscribe({
                next: (res) => {
                  this.isInprocess = false;
                  unit1flag = this.genbandProfileCheckingUnits(
                    res,
                    loadVersion
                  ).unitFlag;
                  if (unit0flag && !unit1flag) {
                    this.confirmDialog.title =
                      this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.CONFIRM_DIALOG;
                    this.confirmDialog.content =
                      this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.CONFIRMATION_DIALOG_CONTENT.replace(
                        /{{gwcName}}/,
                        gwcId
                      ).replace(/{{unit}}/, '-UNIT-0');
                    this.confirmDialog.isShowConfirmDialog = true;
                  } else if (!unit0flag && unit1flag) {
                    this.confirmDialog.title =
                      this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.CONFIRM_DIALOG;
                    this.confirmDialog.content =
                      this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.CONFIRMATION_DIALOG_CONTENT.replace(
                        /{{gwcName}}/,
                        gwcId
                      ).replace(/{{unit}}/, '-UNIT-1');
                    this.confirmDialog.isShowConfirmDialog = true;
                  } else if (unit0flag && unit0flag) {
                    this.confirmDialog.title =
                      this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.CONFIRM_DIALOG;
                    this.confirmDialog.content =
                      this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.CONFIRMATION_DIALOG_CONTENT.replace(
                        /{{gwcName}}/,
                        ''
                      ).replace(/{{unit}}/, '');
                    this.confirmDialog.isShowConfirmDialog = true;
                  }
                  this.checkBackupPath();
                },
                error: (err) => {
                  this.commonService.showAPIError(err);
                  this.isInprocess = false;
                }
              });
            },
            error: (err) => {
              this.commonService.showAPIError(err);
              this.isInprocess = false;
            }
          });
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          this.isInprocess = false;
        }
      });
    } else {
      this.isInprocess = false;
      this.checkBackupPath();
    }
  }

  genbandProfileCheckingUnits(gwcLoad: string, loadVersion: string) {
    let unitFlag = false;
    if (gwcLoad != null) {
      if (gwcLoad.toLowerCase() !== 'unknown') {
        if (gwcLoad.includes('GL')) {
          loadVersion = 'GL16';
        }
        unitFlag = loadVersion > gwcLoad;
      }
    }
    return { unitFlag, loadVersion };
  }

  checkBackupPath() {
    const isLbl = this.gwcBackup.get('lbl')?.value;
    if (this.showGwcBackup && isLbl) {
      this.cac =
        this.gwcBackup.get('cac')?.value === ''
          ? '-1'
          : this.gwcBackup.get('cac')?.value;

      let isGwcBackupValid = true;

      if (this.gwcBackup.get('secipAddress')?.value === '') {
        this.commonService.showErrorMessage(
          this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW
            .GWC_ERROR_MSG.GW_SECIP_EMPTY
        );
        isGwcBackupValid = false;
      }

      if (
        this.gwcBackup.get('mgcsecipAddress')?.value === '0.0.0.0' ||
        this.gwcBackup.get('mgcsecipAddress')?.value === '255.255.255.255'
      ) {
        this.commonService.showErrorMessage(
          this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW
            .GWC_ERROR_MSG.MGC_SECIP_INVALID
        );
        isGwcBackupValid = false;
      }

      if (
        this.gwcBackup.get('secipAddress')?.value === '0.0.0.0' ||
        this.gwcBackup.get('secipAddress')?.value === '255.255.255.255'
      ) {
        this.commonService.showErrorMessage(
          this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW
            .GWC_ERROR_MSG.GW_SECIP_INVALID
        );
        isGwcBackupValid = false;
      }

      if (isGwcBackupValid) {
        if (this.gwcBackup.get('cac')?.value === '0') {
          this.confirmCAC.title =
            this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.CAC_CONFIRM_TITLE;
          this.confirmCAC.titleAccept = this.translateResults.COMMON.YES;
          this.confirmCAC.titleReject = this.translateResults.COMMON.NO;
          this.confirmCAC.content =
            this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.GWC_ERROR_MSG.CAC_ZERO;
          this.confirmCAC.isShowConfirmDialog = true;
          this.confirmCAC.handleAccept = (isAccept: boolean) => {
            if (isAccept) {
              this.gwcBackupBody = [
                {
                  tag: 'mgcSecIP',
                  value: this.gwcBackup.get('mgcsecipAddress')?.value
                },
                {
                  tag: 'mgSecIP',
                  value: this.gwcBackup.get('secipAddress')?.value
                },
                {
                  tag: 'mgCAC',
                  value: '0'
                }
              ];
              this.confirmCAC.isShowConfirmDialog = false;
            } else {
              this.confirmCAC.isShowConfirmDialog = false;
              return;
            }
          };
        } else {
          this.gwcBackupBody = [
            {
              tag: 'mgcSecIP',
              value: this.gwcBackup.get('mgcsecipAddress')?.value
            },
            {
              tag: 'mgSecIP',
              value: this.gwcBackup.get('secipAddress')?.value
            },
            {
              tag: 'mgCAC',
              value: this.cac
            }
          ];
        }
      }
    }
    this.createRequestBody();
  }

  createRequestBody() {
    this.isInprocess = true;
    let assocTimeout = 180;
    let timeout = 0;
    const gwc = this.gatewayInformation.get('controllerName')?.value;
    const protocolVersion = this.signalProtocol.get('protocolVersion')?.value;
    const gwcName = this.gatewayInformation.get('name')?.value;
    const profileName = this.gatewayInformation.get('profileName')?.value;
    const ipAddress = this.gatewayInformation.get('ipAddress')?.value;
    const protocolPort = this.signalProtocol.get('protocolPort')?.value;
    const gwcSiteName = this.gatewayInformation.get('siteName')?.value;
    const reservedTerminations = this.gatewayInformation.get(
      'reservedTerminations'
    )?.value;
    const protocolType = this.findProtocolTypeValue(
      this.signalProtocol.get('protocolType')?.value
    );
    const gwcLGRPType = this.gatewayInformation.get('lgrpType')?.value;
    const isNodeSharing = this.gatewayInformation.get('isNodeSharing')?.value?'Y':'N';

    const requestBody: IAssociateRequestBody[] = [
      { tag: 'clientVers', value: '05' },
      { tag: 'mgUIName', value: gwcName },
      { tag: 'mgProfileName', value: profileName },
      { tag: 'mgIpAddr', value: ipAddress },
      { tag: 'mgProtocolType', value: protocolType },
      { tag: 'mgProtocolVersion', value: protocolVersion },
      { tag: 'mgProtocolPort', value: protocolPort },
      { tag: 'isShared', value: isNodeSharing }
    ];
    if (gwc) {
      requestBody.push({ tag: 'gwcUIName', value: gwc });
    }
    if (gwcSiteName) {
      requestBody.push({ tag: 'mgSiteName', value: gwcSiteName });
    }
    if (
      this.multiSiteSelection &&
      this.selectedSiteNames.selectedSiteNames.length > 0
    ) {
      requestBody.push({
        tag: 'mgMultiSiteName',
        value: this.selectedSiteNames.selectedSiteNames.toString()
      });
    }
    if (reservedTerminations) {
      timeout = Math.ceil(reservedTerminations / 100) + 1;
      requestBody.push({
        tag: 'reservedTerminations',
        value: reservedTerminations.toString()
      });
    } else {
      timeout = Math.ceil(this.maxEndpoints / 100) + 1;
    }
    if (gwcLGRPType) {
      requestBody.push({ tag: 'mgLGRPType', value: gwcLGRPType });
    }
    if (this.multiSiteSelection) {
      timeout = this.selectedSiteNames.timeout;
    }
    if (this.gatewayInformation.get('pep_alg')?.value) {
      if (this.pep_alg_radioValue === 'pepServerName') {
        requestBody.push({
          tag: 'pepServerName',
          value: this.gatewayInformation.get('pep_alg')?.value
        });
      } else {
        requestBody.push({
          tag: 'algName',
          value: this.gatewayInformation.get('pep_alg')?.value
        });
      }
    }
    if (this.mainForm.get('lgrpLocation')) {
      if(this.mainForm.get('lgrpLocation')?.get('frameNumber')?.value !== null){
        requestBody.push({
          tag: 'frameNumber',
          value: this.mainForm.get('lgrpLocation')?.get('frameNumber')?.value
        });
      }
      if(this.mainForm.get('lgrpLocation')?.get('unitNumber')?.value !== null){
        requestBody.push({
          tag: 'unitNumber',
          value: this.mainForm.get('lgrpLocation')?.get('unitNumber')?.value
        });
      }
      if (this.mainForm.get('lgrpLocation')?.get('frameType')?.value) {
        requestBody.push({
          tag: 'frameType',
          value: this.mainForm.get('lgrpLocation')?.get('frameType')?.value
        });
      }
      if (this.mainForm.get('lgrpLocation')?.get('floorPosition')?.value) {
        requestBody.push({
          tag: 'floorPosition',
          value: this.mainForm.get('lgrpLocation')?.get('floorPosition')?.value
        });
      }
      if (this.mainForm.get('lgrpLocation')?.get('rowPosition')?.value) {
        requestBody.push({
          tag: 'rowPosition',
          value: this.mainForm.get('lgrpLocation')?.get('rowPosition')?.value
        });
      }
      if (this.mainForm.get('lgrpLocation')?.get('framePosition')?.value) {
        requestBody.push({
          tag: 'framePosition',
          value: this.mainForm.get('lgrpLocation')?.get('framePosition')?.value
        });
      }
      if (this.mainForm.get('lgrpLocation')?.get('unitPosition')?.value) {
        requestBody.push({
          tag: 'unitPosition',
          value: this.mainForm.get('lgrpLocation')?.get('unitPosition')?.value
        });
      }
    }
    if (
      this.mainForm.get('signallingGateway') &&
      this.mainForm.get('signallingGateway')?.get('enable_disable')?.value
    ) {
      if (this.mainForm.get('signallingGateway')?.get('ip')?.value) {
        requestBody.push({
          tag: 'mgSGIP',
          value: this.mainForm.get('signallingGateway')?.get('ip')?.value
        });
      }
      if (this.mainForm.get('signallingGateway')?.get('port1')?.value) {
        requestBody.push({
          tag: 'mgSGPort1',
          value: this.mainForm.get('signallingGateway')?.get('port1')?.value
        });
      }
      if (this.mainForm.get('signallingGateway')?.get('port2')?.value) {
        requestBody.push({
          tag: 'mgSGPort2',
          value: this.mainForm.get('signallingGateway')?.get('port2')?.value
        });
      } else {
        requestBody.push({
          tag: 'mgSGPort2',
          value: '0'
        });
      }
    }
    if (this.mainForm.get('tgrp')) {
      if (
        this.mainForm.get('tgrp')?.get('tgrp')?.value &&
        this.mainForm.get('tgrp')?.get('tgrpName')?.value
      ) {
        requestBody.push({
          tag: 'tgrpName',
          value: this.mainForm.get('tgrp')?.get('tgrpName')?.value
        });
      }
    }
    if (
      this.mainForm.get('gr') &&
      this.mainForm.get('gr')?.get('gatewayName')?.value
    ) {
      requestBody.push({
        tag: 'GR834Name',
        value: this.mainForm.get('gr')?.get('gatewayName')?.value
      });
    }
    if (timeout !== 0) {
      assocTimeout = timeout * 60;
    }
    requestBody.push(...this.gwcBackupBody);
    this.gwcService
      .putAssociateMediaGateway(requestBody, assocTimeout)
      .subscribe({
        next: (res: any) => {
          this.isInprocess = false;
          const rc = res.rc.__value;
          const successMsg =
            this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL
              .ASSOCIATE_MG_TO_GWC;

          if (rc === 0) {
            const gwcInfos = { gwcUIName: '', gwcIpAddr: '', mgNodeName: '' };
            res.responseData.___a_GWResp.tagValSeq.forEach(
              (item: IAssociateRequestBody) => {
                switch (item.tag) {
                  case 'gwcUIName':
                    gwcInfos.gwcUIName = item.value;
                    break;
                  case 'gwcIpAddr':
                    gwcInfos.gwcIpAddr = item.value;
                    break;
                  case 'mgNodeName':
                    gwcInfos.mgNodeName = item.value;
                    break;
                }
              }
            );
            let msg = this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.SUCCESS_MSG
              .replace(/{{successMsg}}/,successMsg)
              .replace(/{{gwcName}}/,gwcInfos.gwcUIName)
              .replace(/{{gwcIP}}/,gwcInfos.gwcIpAddr)
              .replace(/{{gwcNodeName}}/,gwcInfos.mgNodeName);
            if (profileName === 'VOIP_VPN') {
              msg = msg.concat(this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.VOIP_RESTRICTION);
            }
            this.successConfirm.title =  this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.ASSOCIATE_MG;
            this.successConfirm.content=msg;
            this.successConfirm.isShowConfirmDialog=true;
          } else {
            this.detailsText = res.responseMsg;
            this.messageText =
              this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL.ERROR;
            this.showAddErrorDialog = true;
          }
          this.checkIpAddressProtocolPort(profileName, ipAddress, protocolPort);
        },
        error: (err) => {
          this.isInprocess = false;
          this.commonService.showAPIError(err);
        }
      });
  }

  checkIpAddressProtocolPort(
    profileName: string,
    IpAddress: string,
    portNumber: string
  ) {
    this.isInprocess = true;
    this.gwcService
      .getIpAddressProtocolPort(profileName, IpAddress, portNumber)
      .subscribe({
        next: (res) => {
          this.isInprocess = false;
          if (res) {
            this.commonService.showInfoMessage(
              this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL
                .IP_ADDRESS_ALREADY_IN_USE
            );
          }
        },
        error: (err) => {
          this.isInprocess = false;
          this.commonService.showAPIError(err);
        }
      });
  }

  findProtocolTypeValue(protocolType: string) {
    const protocols = protocolInfoList.find(
      (protocol: ProtocolInfo) => protocol.protocolType === protocolType
    );
    if (protocols === undefined) {
      return 'undefined';
    }
    return protocols.protocolValue.toString();
  }

  genbandConfirmDialogEvent(event: boolean) {
    if (event) {
      this.checkBackupPath();
    }
    this.confirmDialog.isShowConfirmDialog = false;
  }

  successAssociateConfirm(){
    this.successConfirm.isShowConfirmDialog = false;
    this.closeDialog();
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  closeAddErrorDialog() {
    this.showAddErrorDialog = false;
    this.showDetailsBtn = true;
  }
}
