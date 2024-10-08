import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ITableConfig, Icols, FilterTypes, FieldName } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { tableConfigCommon } from 'src/app/types/const';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import {
  Capability,
  EStatusProfileChange,
  ExecData,
  GWCNode,
  GWCNodeResponse,
  IConfirm,
  IControllerProfileTable,
  gwcNodeCapability,
  gwcNodeUnits
} from '../../../models/gwControllers';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit, OnChanges {
  @Input() gwControllerName!: string;

  // Profile Table
  profileTableConfig: ITableConfig;
  profileTableCols: Icols[] = [];
  profileTableData: IControllerProfileTable[] = [];

  // Call Agent Table
  agentTableConfig: ITableConfig;
  agentTableCols: Icols[] = [];
  agentTableData: ExecData[] = [];
  showActionDialog = false;
  actionForm: FormGroup;
  execLineOptions: SelectItem[];
  selectedTermType: string;

  translateResults: any;
  isLoading = false;
  gwcStatData!: string;
  defaultGwDomainName!: string;
  codecProfileName!: string;
  nodeNumber!: number;
  gwcAuto!: boolean;
  preSwact!: string;
  toggleStatus!: string;
  codecProfileOptions: SelectItem[];
  profilesOptions: SelectItem[];
  isDisabled: boolean;

  resetCodecProfileValue: string;
  resetGwcAutoValue: boolean;
  resetPreSwactValue: string | null;
  currentGwControllerName: string;

  activeIp: string;
  currentFlowThruValue: boolean;
  selectedProfileName: string;
  clli: string;

  controllerForm: FormGroup;
  overlayPanelForm: FormGroup;
  profileForm: FormGroup;

  confirmCodecProfile: IConfirm = {
    title: '',
    content: '',
    isShowConfirmDialog: false,
    titleAccept: '',
    titleReject: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleAccept: (isAccept: boolean) => { }
  };
  isCodecProfileChange = false;
  backupCodecProfileName: string;

  errorData: {
    errorCode: string,
    message: string
  };
  titleText: string;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showDetailsBtn = true;
  showErrorDialog = false;
  messageText: string;

  // Profile Success Toast Warning
  warning_AOld_BNew = ['AUDCNTL_RMGC_V2', 'AUDCNTL_RMGCINTL_V2'];
  warning_ANew_BOld = ['AUDCNTL_RMGC', 'AUDCNTL_RMGCINTL'];
  oldProfile = '';

  initedFirstProfile = '';
  isButtonDisabled = false;
  isGeneralButtonDisabled = false;

  constructor(
    private translateService: TranslateInternalService,
    private commonService: CommonService,
    private gwcService: GatewayControllersService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private nv: NetworkViewService
  ) {
    this.translateResults = this.translateService.translateResults;

    // Profile Table
    this.profileTableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        ...tableConfigCommon.tableOptions,
        dataKey: ''
      },
      tableName: 'ControllerProfileTbl'
    };

    // Call Agent Table
    this.agentTableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        ...tableConfigCommon.tableOptions,
        dataKey: ''
      },
      tableName: 'ControllerAgentTbl',
      actionColumnConfig: {
        actions: [
          {
            icon: 'fa fa-pencil-square-o',
            label: 'edit action',
            tooltip:
              this.translateResults.COMMON.EDIT,
            onClick: (data: any, index: any) => {
              this.selectedTermType = data.termtype;
              this.editHandle();
            }
          }
        ]
      }
    };

    // Init forms
    this.controllerForm = this.fb.group({
      gwcStatData: [''],
      defaultGwDomain: [''],
      codecProfile: [''],
      nodeNumber: [0],
      gwcAuto: [false],
      preSwact: ['']
    });

    this.overlayPanelForm = this.fb.group({
      codecProfiles: [{ label: '', value: '' }]
    });

    this.profileForm = this.fb.group({
      gwcAddresName: [''],
      flow: [false],
      profiles: [{ label: '', value: '' }]
    });

    this.actionForm = this.fb.group({
      execLine: [{ label: '', value: '' }]
    });
  }

  ngOnInit(): void {
    this.initCols();
    this.initCodecProfileOptions();
    this.isDisabled = true;
    this.isLoading = true;
    this.controllerForm
      .get('gwcAuto')
      ?.valueChanges.subscribe((gwcAutoValue) => {
        this.isLoading = false;
        if (gwcAutoValue === true) {
          this.controllerForm.controls['preSwact'].enable();
          this.controllerForm.controls['preSwact'].setValue(180);
          this.isDisabled = gwcAutoValue;
          this.toggleStatus = 'Enabled';
          this.isGeneralButtonDisabled = false;
        } else {
          this.controllerForm.controls['preSwact'].disable();
          this.controllerForm.controls['preSwact'].setValue(null);
          this.isDisabled = gwcAutoValue;
          this.toggleStatus = 'Disabled';
          this.isGeneralButtonDisabled = true;
        }
      });
    // remove
    this.profileForm
      .get('profiles')
      ?.valueChanges.subscribe((selectedProfile) => {
        this.selectedProfileName = selectedProfile;
        this.gwcService.getFlowthroughStatus(selectedProfile).subscribe({
          next: (res: boolean) => {
            if (res) {
              this.profileForm.controls['flow'].enable();
              this.profileForm.controls['flow'].setValue(false);
              this.profileForm.get('gwcAddresName')?.setValue('');
            } else {
              this.profileForm.controls['flow'].disable();
              this.profileForm.controls['flow'].setValue(false);
              this.profileForm.get('gwcAddresName')?.setValue('');
            }
          }
        });
      });
    this.profileForm.get('flow')?.valueChanges.subscribe((isChecked) => {
      isChecked
        ? this.profileForm.controls['gwcAddresName'].enable()
        : this.profileForm.controls['gwcAddresName'].disable();
      this.currentFlowThruValue = isChecked;
    });
    this.authService.getCLLI().subscribe((res) => {
      this.clli = res;
    });

    this.controllerForm.get('preSwact')?.valueChanges.subscribe(value => {
      this.checkPreSwactValue(value);
    });
  }

  checkPreSwactValue(value: any) {
    const numberValue = Number(value);
    if (this.controllerForm.get('gwcAuto')?.value) {
      if (!isNaN(numberValue) && numberValue % 10 === 0) {
        this.isGeneralButtonDisabled = false;
      } else {
        this.isGeneralButtonDisabled = true;
      }
    }
  }

  ngOnChanges(): void {
    this.initProfileOptions(this.gwControllerName);
    this.getProfileTableData(this.gwControllerName);
    this.getCallAgentTableData(this.gwControllerName);
    this.currentGwControllerName = this.gwControllerName;
    this.isLoading = true;
    this.gwcService.getGWEStatistics(this.gwControllerName).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.count > 0 && res.gwcStatisticsList.length > 0) {
          this.gwcStatData = `${res.gwcStatisticsList[0].gwcStatValue} ${res.gwcStatisticsList[0].gwcStatName}`;
        } else {
          this.gwcStatData = 'No data available';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
    this.isLoading = true;
    this.gwcService.getGWCNodeByName_v1(this.gwControllerName).subscribe({
      next: (res: GWCNode) => {
        this.isLoading = false;
        this.oldProfile = res.serviceConfiguration.gwcProfileName;
        if (res) {
          this.defaultGwDomainName = res.serviceConfiguration.defaultGwDomainName === '' ? '<None>'
            : res.serviceConfiguration.defaultGwDomainName;
        } else {
          this.defaultGwDomainName = 'No data available';
        }
      },
      error: (error) => {
        // Handle the error, show an error message
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
    this.isLoading = true;
    this.gwcService.getGWCNodesByFilter_v1(this.gwControllerName).subscribe({
      next: (res: GWCNodeResponse) => {
        this.isLoading = false;
        if (res.count > 0) {
          this.codecProfileName =
          res.nodeList[0].serviceConfiguration.codecProfileName;
          this.overlayPanelForm.controls['codecProfiles'].setValue(this.codecProfileName);
          this.isCodecProfileChange = false;
          this.backupCodecProfileName = this.codecProfileName;
          this.resetCodecProfileValue = this.codecProfileName;
          this.nodeNumber = res.nodeList[0].serviceConfiguration.gwcNodeNumber;
          this.activeIp = res.nodeList[0].serviceConfiguration.activeIpAddress;
        } else {
          this.codecProfileName = 'No data available';
          this.nodeNumber = 0;
          this.backupCodecProfileName = this.codecProfileName;
          this.isCodecProfileChange = false;
        }
      },
      error: (error) => {
        // Handle the error, show an error message
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
    this.isLoading = true;
    this.gwcService.getGWCMtcControlData(this.gwControllerName).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.autoSwactTimer === -1) {
          this.gwcAuto = false;
          this.toggleStatus = 'Disabled';
          this.controllerForm.controls['preSwact'].disable();
          this.controllerForm.controls['gwcAuto'].setValue(false);
          this.controllerForm.controls['preSwact'].setValue(null);
          this.resetPreSwactValue = null;
          this.resetGwcAutoValue = this.gwcAuto;
        } else {
          this.gwcAuto = true;
          this.toggleStatus = 'Enabled';
          this.controllerForm.controls['preSwact'].enable();
          this.controllerForm.controls['gwcAuto'].setValue(true);
          this.controllerForm.controls['preSwact'].setValue(res.autoSwactTimer);
          this.resetPreSwactValue = res.autoSwactTimer;
          this.resetGwcAutoValue = this.gwcAuto;
        }
      },
      error: (error) => {
        // Handle the error, show an error message
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
  }

  initProfileOptions(gwc: string) {
    this.isLoading = true;
    this.gwcService.getProfiles(gwc).subscribe({
      next: (res: Array<string>) => {
        this.isLoading = false;
        let tempProfilesOptions = [
          {
            label: '',
            value: ''
          }
        ];
        if (res) {
          tempProfilesOptions = res.map((item) => ({
            label: item,
            value: item
          }));
        }
        // Set Select Profile options data
        this.profilesOptions = tempProfilesOptions;
        this.initedFirstProfile = this.profilesOptions[0].value;
        this.isLoading = true;
        this.gwcService
          .getGWCNodeByName_v1(this.currentGwControllerName)
          .subscribe({
            next: (nodeRes: GWCNode) => {
              this.isLoading = false;
              let defaultProfileOption = {
                label: '',
                value: ''
              };
              if (nodeRes) {
                defaultProfileOption = {
                  label: nodeRes.serviceConfiguration.gwcProfileName,
                  value: nodeRes.serviceConfiguration.gwcProfileName
                };
                this.profileForm.controls['profiles'].setValue(
                  defaultProfileOption
                );
              }
            },
            error: (error) => {
              // Handle the error, show an error message
              this.isLoading = false;
              this.commonService.showAPIError(error);
            }
          });
      },
      error: (error) => {
        // Handle the error, show an error message
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
  }

  initCodecProfileOptions() {
    this.isLoading = true;
    this.gwcService.getQueryNtwkCodecProfilesByFilter_v1().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const tempCodecProfileOptions = [];
        if (res) {
          for (let i = 0; i < res.count; i++) {
            tempCodecProfileOptions.push({
              label: res.ncpList[i]?.name,
              value: res.ncpList[i]?.name
            });
          }
        }
        // Set Overlay panel profile options data
        this.codecProfileOptions = tempCodecProfileOptions;
      },
      error: (error) => {
        // Handle the error, show an error message
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
  }

  closeOverlayPanel(event: any, element: any) {
    element.hide(event);
  }

  applyCodecProfileChanges(event: any, element: any) {
    this.codecProfileName = this.overlayPanelForm.get('codecProfiles')?.value;
    this.isCodecProfileChange = true;
    element.hide(event);
  }

  onControllerFormSubmit(event: boolean) {
    if( this.isCodecProfileChange &&
        event &&
        this.backupCodecProfileName !== this.codecProfileName ) {
      this.confirmCodecProfile.title =
        this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CONTROLLER.SUB_TITLES.GENERAL.CONFIRM_TITLE;
      this.confirmCodecProfile.titleAccept = this.translateResults.COMMON.YES;
      this.confirmCodecProfile.titleReject = this.translateResults.COMMON.NO;
      this.confirmCodecProfile.content =
        this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CONTROLLER.SUB_TITLES.GENERAL.CONFIRM_CONTENT
          .replace('/{{currentGwControllerName}}/', `"${this.currentGwControllerName}"`);
      this.confirmCodecProfile.isShowConfirmDialog = true;
      this.confirmCodecProfile.handleAccept = (isAccept: boolean) => {
        if (isAccept) {
          this.controllerFormApply(event);
          this.confirmCodecProfile.isShowConfirmDialog = false;
        } else {
          this.confirmCodecProfile.isShowConfirmDialog = false;
        }
      };
    } else {
      this.controllerFormApply(event);
    }
  }

  controllerFormApply (event: boolean) {
    // reset - false
    // save - true
    if (event) {
      if (this.resetPreSwactValue !== this.controllerForm.get('preSwact')?.value) {
        const tempData = {
          gwcID: this.currentGwControllerName,
          autoSwactTimer: this.controllerForm.get('preSwact')?.value === null ? -1 : this.controllerForm.get('preSwact')?.value
        };
        this.isLoading = true;
        this.gwcService.postGWCMtcControlData(tempData).subscribe({
          next: () => {
            this.isLoading = false;
            this.commonService.showSuccessMessage(
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                .CONTROLLER.SUB_TITLES.GENERAL.MTC_CONTROL_SUCCESS
            );
          },
          error: (errorPostGWCMtc) => {
            this.isLoading = false;
            this.titleText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
              .CONTROLLER.CONTROLLER_FORM_HEADER;
            this.errorData = errorPostGWCMtc?.error || errorPostGWCMtc;
            const messageAndDetails = JSON.stringify(this.errorData?.message);
            const detailsIndex = messageAndDetails.indexOf('details = ');
            const parsedData = messageAndDetails?.split('details = ');
            this.detailsText = messageAndDetails.substring(detailsIndex + 'details = '.length)
              .trim().replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;') || '';
            this.messageText = parsedData[0]?.split('message = ')[1]?.replace(this.reg, '<br>')
              .replace(this.tabReg, ' &emsp;') || '';
            if (!this.detailsText || this.detailsText === '"') {
              this.commonService.showErrorMessage(this.messageText);
            } else {
              this.showErrorDialog = true;
            }
          },
          complete: () => {
            // update form current data informations
            this.ngOnChanges();
          }
        });
      }

      if (this.resetCodecProfileValue !== this.codecProfileName) {
        this.isLoading = true;
        this.gwcService
          .postConfigureGWCService(
            this.currentGwControllerName,
            this.codecProfileName
          )
          .subscribe({
            next: () => {
              this.isLoading = false;
              this.commonService.showSuccessMessage(
                this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                  .CONTROLLER.SUB_TITLES.GENERAL.POST_CONFIGURE_SUCCESS
              );
              this.isCodecProfileChange = false;
              this.backupCodecProfileName = this.codecProfileName;
            },
            error: (errorPostConfigure) => {
              this.isLoading = false;
              this.titleText = this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                .CONTROLLER.CONTROLLER_FORM_HEADER;
              this.errorData = errorPostConfigure?.error || errorPostConfigure;
              const messageAndDetails = JSON.stringify(this.errorData?.message);
              const detailsIndex = messageAndDetails.indexOf('details = ');
              const parsedData = messageAndDetails?.split('details = ');
              this.detailsText = messageAndDetails.substring(detailsIndex + 'details = '.length)
                .trim().replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;') || '';
              this.messageText = parsedData[0]?.split('message = ')[1]?.replace(this.reg, '<br>')
                .replace(this.tabReg, ' &emsp;') || '';
              if (!this.detailsText || this.detailsText === '"') {
                this.commonService.showErrorMessage(this.messageText);
              } else {
                this.showErrorDialog = true;
              }
            },
            complete: () => {
              // update form current data informations
              this.ngOnChanges();
            }
          });
      }
    } else {
      this.ngOnChanges();
      this.isCodecProfileChange = false;
    }
  }

  handleProfileChange(profile: string) {
    // Disable SAVE button if profile is same or not changed to different
    this.isButtonDisabled = this.selectedProfileName === this.initedFirstProfile ? false : true;
  }

  onProfileFormSubmit(event: boolean) {
    if (event) {
      const [gwc, gwcId] = this.currentGwControllerName.split('-'); // GWC-0 -> GWC, 0
      // Checking flow thru value
      if (this.currentFlowThruValue) {
        if (this.profileForm.get('gwcAddresName')?.value.trim().length >0) {
          const body = [
            {
              field_name: 'profile_name',
              value: this.selectedProfileName
            },
            {
              field_name: 'gwc_name_flowThr',
              value: this.currentGwControllerName
            },
            {
              field_name: 'active_ip_flowThr',
              value: this.activeIp
            },
            {
              field_name: 'gwc_addressName_flowThr',
              value: this.profileForm.get('gwcAddresName')?.value
            }
          ];
          this.isLoading = true;
          this.gwcService
            .postControllerProfileCallAgentPanelSave(
              Number(gwcId),
              this.clli,
              body
            )
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                switch (res?.rc?.__value) {
                  case 0:
                    if (
                      (this.warning_AOld_BNew.includes(this.oldProfile) && this.warning_ANew_BOld.includes(this.selectedProfileName)) ||
                      (this.warning_ANew_BOld.includes(this.oldProfile) && this.warning_AOld_BNew.includes(this.selectedProfileName))
                    ) {
                      this.commonService.showSuccessMessage(
                        `${EStatusProfileChange.SUCCESS} \n ${EStatusProfileChange.RC_0}`);
                    } else {
                      this.commonService.showSuccessMessage(
                        EStatusProfileChange.SUCCESS
                      );
                    }
                    break;
                  case 56:
                    this.messageText = EStatusProfileChange.RC_56;
                    this.detailsText = res.responseMsg;
                    this.showErrorDialog = true;
                    break;
                  case 57:
                    this.messageText = EStatusProfileChange.RC_57;
                    this.detailsText = res.responseMsg;
                    this.showErrorDialog = true;
                    break;
                  case 58:
                    this.messageText = EStatusProfileChange.RC_58;
                    this.detailsText = res.responseMsg;
                    this.showErrorDialog = true;
                    break;
                  case 59:
                    this.messageText = EStatusProfileChange.RC_59;
                    this.detailsText = res.responseMsg;
                    this.showErrorDialog = true;
                    break;
                  case 4:
                    this.messageText = EStatusProfileChange.RC_4;
                    this.detailsText = res.responseMsg;
                    this.showErrorDialog = true;
                    break;
                  case 108:
                    this.messageText = EStatusProfileChange.RC_108;
                    this.detailsText = res.responseMsg;
                    this.showErrorDialog = true;
                    break;
                  default:
                    if (res?.responseMsg?.length > 0) {
                      this.titleText =
                      this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.
                        TABS.CONTROLLER.SUB_TITLES.PROFILE.CHANGE_GWC_PROFILE;
                      this.messageText =
                        this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING
                          .TABS.CONTROLLER.SUB_TITLES.PROFILE.PROFILE_FAIL_RES
                          .replace(/{{rcValue}}/, res.rc.__value);
                      this.detailsText = res.responseMsg;

                    }
                    this.showErrorDialog = true;
                    break;
                }
              },
              complete: () => {
                this.profileForm.get('gwcAddresName')?.setValue('');
                this.oldProfile = '';
              },
              error: (error) => {
                this.isLoading = false;
                this.commonService.showAPIError(error);
                this.profileForm.get('gwcAddresName')?.setValue('');
                this.oldProfile = '';
              }
            });
        } else {
          this.commonService.showErrorMessage(this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
            .CONTROLLER.ERROR.EMPTY_GWC_ADDRESS);
        }
      } else {
        const body = [
          {
            field_name: 'profile_name',
            value: this.selectedProfileName
          }
        ];
        this.isLoading = true;
        this.gwcService
          .postControllerProfileCallAgentPanelSave(
            Number(gwcId),
            this.clli,
            body
          )
          .subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.titleText =
              this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.
                TABS.CONTROLLER.SUB_TITLES.PROFILE.CHANGE_GWC_PROFILE;
              switch (res?.rc?.__value) {
                case 0:
                  if (
                    (this.warning_AOld_BNew.includes(this.oldProfile) && this.warning_ANew_BOld.includes(this.selectedProfileName)) ||
                    (this.warning_ANew_BOld.includes(this.oldProfile) && this.warning_AOld_BNew.includes(this.selectedProfileName))
                  ) {
                    this.commonService.showSuccessMessage(
                      `${EStatusProfileChange.SUCCESS} \n ${EStatusProfileChange.RC_0}`);
                  } else {
                    this.commonService.showSuccessMessage(
                      EStatusProfileChange.SUCCESS
                    );
                  }
                  break;
                case 56:
                  this.messageText = EStatusProfileChange.RC_56;
                  this.detailsText = res.responseMsg;
                  this.showErrorDialog = true;
                  break;
                case 57:
                  this.messageText = EStatusProfileChange.RC_57;
                  this.detailsText = res.responseMsg;
                  this.showErrorDialog = true;
                  break;
                case 58:
                  this.messageText = EStatusProfileChange.RC_58;
                  this.detailsText = res.responseMsg;
                  this.showErrorDialog = true;
                  break;
                case 59:
                  this.messageText = EStatusProfileChange.RC_59;
                  this.detailsText = res.responseMsg;
                  this.showErrorDialog = true;
                  break;
                case 4:
                  this.messageText = EStatusProfileChange.RC_4;
                  this.detailsText = res.responseMsg;
                  this.showErrorDialog = true;
                  break;
                case 108:
                  this.messageText = EStatusProfileChange.RC_108;
                  this.detailsText = res.responseMsg;
                  this.showErrorDialog = true;
                  break;
                default:
                  if (res?.responseMsg?.length > 0) {
                    this.messageText =
                      this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING
                        .TABS.CONTROLLER.SUB_TITLES.PROFILE.PROFILE_FAIL_RES
                        .replace(/{{rcValue}}/, res.rc.__value);
                    this.detailsText = res.responseMsg;
                  }
                  this.showErrorDialog = true;
                  break;
              }
            },
            complete: () => {
              this.profileForm.get('gwcAddresName')?.setValue('');
              this.oldProfile = '';
            },
            error: (error) => {
              this.isLoading = false;
              this.commonService.showAPIError(error);
              this.profileForm.get('gwcAddresName')?.setValue('');
              this.oldProfile = '';
            }
          });
      }
    } else {
      this.profileForm.reset();
      this.refreshCallAgentTable();
      this.refreshProfileTable();
    }
  }

  generatePostBody(termTypeToFilter: string, newName: string): any[] {
    const postBody: any[] = [];

    this.agentTableData.forEach(item => {
      let fieldValue = item.name;
      if (item.termtype === termTypeToFilter) {
        fieldValue = newName;
      }
      postBody.push({
        field_name: 'execdata',
        value: `${fieldValue},${item.termtype}`
      });
    });

    return postBody;
  }

  editHandle() {
    this.showActionDialog = true;
    const profileName = this.profileForm.get('profiles')?.value;
    this.nv.getGatewayControllerProfileData(profileName).subscribe({
      next: (res) => {
        const execinfo = res.execinfo || [];
        const filteredExecinfo = execinfo.filter((item: any) => item.termtype === this.selectedTermType);
        this.execLineOptions = filteredExecinfo.map((item: any) => ({
          label: item.name,
          value: item.name
        }));
      }
    });
  }

  initCols() {
    this.profileTableCols = [
      {
        data: [],
        field: 'capability',
        header: 'Capability',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'capacity',
        header: 'Capacity',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'units',
        header: 'Units',
        colsEnable: true,
        sort: false,
        type: FilterTypes.InputText,
        autoSetWidth: true
      }
    ];
    this.agentTableCols = [
      {
        data: [],
        field: 'termtype',
        header: 'Term Type',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'name',
        header: 'Exec Lineup',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: FieldName.Action,
        header:
          this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS
            .TABLE.COLS.ACTION,
        colsEnable: true,
        sort: false,
        autoSetWidth: true
      }
    ];
  }

  getProfileTableData(gwc: string) {
    this.isLoading = true;
    this.gwcService.getGWCNodesByFilter_v1(gwc).subscribe({
      next: (res: GWCNodeResponse) => {
        this.profileTableData = [];
        this.isLoading = false;
        this.profileTableData =
          res.nodeList[0].serviceConfiguration.capabilities
            .filter((capabilities: Capability) => {
              const capabilityValue = capabilities.capability.__value;
              // Remove capabilities with values 15-IPSEC and 16-KERBEROS from the table
              return capabilityValue !== 15 && capabilityValue !== 16;
            })
            .map((capabilities: Capability) => {
              const capabilityValue = capabilities.capability.__value;
              const capabilityName =
              gwcNodeCapability[capabilityValue] || 'Unknown';
              const units = gwcNodeUnits[capabilityValue] || 'Unknown';
              return {
                capability: capabilityName,
                units: units,
                capacity: capabilities.capacity
              };
            });
      },
      error: (err) => {
        this.isLoading = false;
        this.commonService.showAPIError(err);
      }
    });
  }

  getCallAgentTableData(gwc: string) {
    this.isLoading = true;
    this.gwcService.getGWCNodesByFilter_v1(gwc).subscribe({
      next: (res: GWCNodeResponse) => {
        this.isLoading = false;
        this.agentTableData = [];
        this.agentTableData =
          res.nodeList[0].serviceConfiguration.execDataList.map(
            (execDataList: ExecData) => ({
              name: execDataList.name,
              termtype: execDataList.termtype
            })
          );
      },
      error: (error) => {
        // Handle the error, show an error message
        this.isLoading = false;
        this.commonService.showAPIError(error);
      }
    });
  }

  onTableActionSubmit(event: boolean) {
    // cancel - false
    // save - true
    if (event) {
      const postBody = this.generatePostBody(this.selectedTermType, this.actionForm.get('execLine')?.value);
      const gwcUnitNumber = parseInt(this.currentGwControllerName.split('-')[1], 10);
      this.isLoading = true;
      this.gwcService.postControllerProfileCallAgentPanelSave(gwcUnitNumber, this.clli, postBody).subscribe({
        next: (res) => {
          if (res) {
            switch (res.rc.__value) {
              case 0:
                this.commonService.showSuccessMessage(
                  this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                    .CONTROLLER.EDIT_MSG.RC_0);
                break;
              case 56:
                this.commonService.showErrorMessage(
                  this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                    .CONTROLLER.EDIT_MSG.RC_56);
                break;
              case 57:
                this.commonService.showErrorMessage(
                  this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                    .CONTROLLER.EDIT_MSG.RC_57);
                break;
              case 58:
                this.commonService.showErrorMessage(
                  this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                    .CONTROLLER.EDIT_MSG.RC_58);
                break;
              case 59:
                this.commonService.showErrorMessage(
                  this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                    .CONTROLLER.EDIT_MSG.RC_59);
                break;
              default:
                this.commonService.showErrorMessage(
                  this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
                    .CONTROLLER.EDIT_MSG.RC_UNKNOWN
                    .replace(/{{rcValue}}/, res.rc.__value)
                );
                break;
            }
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.showActionDialog = false;
          this.commonService.showErrorMessage(
            this.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
              .CONTROLLER.EDIT_MSG.RC_UNKNOWN
              .replace(/{{gwName}}/, this.currentGwControllerName));
        },
        complete: () => {
          this.isLoading = false;
          this.showActionDialog = false;
          this.refreshCallAgentTable();
        }
      });
    } else {
      this.closeDialog();
    }
  }

  closeDialog(): void {
    this.actionForm.reset();
    this.showActionDialog = false;
  }

  refreshProfileTable() {
    this.getProfileTableData(this.currentGwControllerName);
  }

  refreshCallAgentTable() {
    this.getCallAgentTableData(this.currentGwControllerName);
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
    this.showDetailsBtn = true;
    this.titleText = '';
    this.messageText = '';
    this.detailsText = '';
  }
}
