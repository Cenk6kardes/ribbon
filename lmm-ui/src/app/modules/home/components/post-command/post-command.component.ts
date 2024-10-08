import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Navigation, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ILineRequest, ILineValidateResponseInfo } from 'src/app/shared/models/line-maintenance-manager';
import { IPreferences } from 'src/app/types';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { StatusLogService } from 'src/app/services/status-log.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';

import { HomeService } from '../../services/home.service';
import { DirectoryService } from '../../services/directory.service';
import { StatusIndicatorsService } from 'src/app/modules/home/services/status-indicators.service';
import {
  CM_RC_VALUE, DISPLAY_INFO_TYPE, POST_TYPE, REFRESH_TYPE,
  EDirectoryValue, IDirectoryTable, protocolsSupported, IRefreshDNEmit
} from '../../models/home';
import { ILMMLineGatewayNames } from 'src/app/shared/models/gateway-controller-element-manager';

import { Status } from 'rbn-common-lib';
import { OrderList } from 'primeng/orderlist';
import { take } from 'rxjs/operators';

export interface IInformationData {
  content: string;
  dnValue?: string;
  title?: string;
}

@Component({
  selector: 'app-post-command',
  templateUrl: './post-command.component.html',
  styleUrls: ['./post-command.component.scss']
})
export class PostCommandComponent implements OnInit, OnDestroy {
  @ViewChild('orderListGateway', { static: false }) orderListGateway: OrderList;
  translateResult: any;
  displayGatewaysDialog = false;
  gatewaysData: ILMMLineGatewayNames[] = [];
  selectedGateway: ILMMLineGatewayNames[] = [];
  dataTable: IDirectoryTable[] = [];
  typesPost = [
    { label: 'Post DN', value: POST_TYPE.POST_DN },
    { label: 'Post Gateway', value: POST_TYPE.POST_GATEWAY },
    { label: 'Select Gateway to Post', value: POST_TYPE.SELECT_GATEWAY_TO_POST }
  ];
  postForm: FormGroup;
  displayInfoDialog = false;
  infoDialogData = {
    title: '',
    content: ''
  };
  isInprocess = false;

  preferences: IPreferences;
  autoTerminationSubscription: Subscription;
  navigation: Navigation | null;
  postCommandData: any;
  constructor(private homeService: HomeService,
    private fb: FormBuilder,
    private translateInternalService: TranslateInternalService,
    private directoryService: DirectoryService,
    private preferencesService: PreferencesService,
    private statusLogService: StatusLogService,
    private commonService: CommonService,
    private storageService: StorageService,
    private statusIndicatorsService: StatusIndicatorsService,
    private router: Router
  ) {
    this.translateResult = this.translateInternalService.translateResults;
    this.navigation = this.router.getCurrentNavigation();
  }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      type: [this.typesPost[0].value, Validators.required],
      postValue: ['']
    });
    /**
     * The disable post button is checked with the validation of the form, and the data is pulled from storage.
     * When the form is first set, if it is not saved to storage, the button becomes disabled.
     */
    if (this.directoryService.getPostCommandDataFromStorage().length === 0 ) {
      this.directoryService.setPostCommandDataToStorage(this.postForm.value);
    }
    if (this.navigation?.extras?.state) {
      const postValue = this.navigation.extras.state['gwName'];
      this.postForm.get('type')?.setValue(POST_TYPE.POST_GATEWAY);
      this.postForm.get('postValue')?.setValue(postValue);
      this.doPostGateway(this.postForm.get('postValue')?.value);
    }
    this.cancelDeloadPostLine();
    this.postCommandData = this.directoryService.getPostCommandDataFromStorage();
    if (this.postCommandData) {
      const dataPCommand = JSON.parse(JSON.stringify(this.postCommandData));
      this.postForm.get('type')?.setValue(dataPCommand.type);
      this.postForm.get('postValue')?.setValue(dataPCommand.postValue);
    }
  }

  save() {
    // Check if the GUI has been initialized before posting
    if (!this.storageService.cBMgIP || !this.storageService.clli) {
      this.statusLogService.pushLogs('VRB: GUI initialization in progress');
      this.infoDialogData.title = this.translateResult.HOME.COMMAND_ABORTED;
      this.infoDialogData.content = this.translateResult.HOME.GUI_INITIALIZATION_IN_PROGRESS;
      this.displayInfoDialog = true;
      return;
    }
    const postValue = this.postForm.get('postValue')?.value;
    const typePostCommand = this.postForm.get('type')?.value;
    if (!typePostCommand) {
      this.infoDialogData.title = this.translateResult.HOME.POST_COMMAND_FAILED;
      this.infoDialogData.content = this.translateResult.HOME.ENTER_TYPE_POST_COMMAND;
      this.displayInfoDialog = true;
      return;
    } else if (typePostCommand === POST_TYPE.POST_DN) {
      const regexPostDN = /^[0-9]+$/.test(postValue);
      if (!postValue || !regexPostDN) {
        this.infoDialogData.title = this.translateResult.HOME.POST_COMMAND_FAILED;
        this.infoDialogData.content = postValue ? this.translateResult.HOME.DN_NOT_EXIST : this.translateResult.HOME.ENTER_DN;
        this.displayInfoDialog = true;
        return;
      }
    } else if (typePostCommand === POST_TYPE.POST_GATEWAY) {
      const regexPostGateway = /^[a-zA-Z0-9.-]+$/;
      const invalidInput = !regexPostGateway.test(postValue);
      if (invalidInput) {
        this.infoDialogData.title = this.translateResult.HOME.POST_COMMAND_FAILED;
        this.infoDialogData.content = this.translateResult.HOME.GATEWAY_NOT_FOUND_OR_NOT_SUPPORTED;
        this.displayInfoDialog = true;
        return;
      }
    }
    switch (typePostCommand) {
      case POST_TYPE.POST_GATEWAY:
      case POST_TYPE.SELECT_GATEWAY_TO_POST:
        this.isInprocess = true;
        this.homeService.getLMMLineGatewayNames(postValue).subscribe({
          next: (rs) => {
            this.isInprocess = false;
            if (rs.length > 0) {
              this.gatewaysData = rs.map(gw => ({ name: gw }));
              // select first gateway
              this.selectedGateway.push(this.gatewaysData[0]);
              if (this.gatewaysData.length === 1 && typePostCommand === POST_TYPE.POST_GATEWAY) {
                this.handleFilterOrderList();
                this.selectedGateway.push(this.gatewaysData[0]);
                this.acceptGateway();
              } else {
                this.displayGatewaysDialog = true;
              }
            } else {
              this.infoDialogData.title = this.translateResult.HOME.POST_COMMAND_FAILED;
              this.infoDialogData.content = this.translateResult.HOME.GATEWAY_NOT_FOUND_OR_NOT_SUPPORTED;
              this.displayInfoDialog = true;
            }
          },
          error: (er) => {
            this.isInprocess = false;
            this.infoDialogData.title = this.translateResult.HOME.POST_COMMAND_FAILED;
            this.infoDialogData.content = er?.error?.message ? er.error.message :
              this.translateResult.HOME.GATEWAY_NOT_FOUND_OR_NOT_SUPPORTED;
            this.displayInfoDialog = true;
          }
        });
        break;
      case POST_TYPE.POST_DN:
        this.doPostDN(postValue);
        break;
      default:
        break;
    }
  }

  acceptGateway() {
    this.postForm.get('postValue')?.setValue(this.selectedGateway[0].name);
    this.displayGatewaysDialog = false;
    this.doPostGateway(this.postForm.get('postValue')?.value);
  }

  doPostDN(dnValue: string) {
    this.isInprocess = true;
    const displayInfo = DISPLAY_INFO_TYPE.DIALOG;
    const information: IInformationData = { title: '', content: '', dnValue };

    const clli = this.storageService.clli;
    if (!clli) {
      this.isInprocess = false;
      information.content = this.translateResult.HOME.NOT_FOUND_CLLI;
      this.displayInfomation(information, displayInfo);
      return;
    }
    this.homeService.getLineInformationByDNAndCLLI(dnValue, clli).subscribe({
      next: (rs) => {
        this.isInprocess = false;
        if (rs && rs.hasOwnProperty('cm_rc')) {
          switch (rs.cm_rc) {
            case CM_RC_VALUE.DN_VALID:
              this.handlePostDNSuccess(rs);
              break;
            default:
              information.content = this.handleCMRCInvalidMessage(rs.cm_rc, clli);
              this.displayInfomation(information, displayInfo);
              this.directoryService.handleRowWhenCMRCInvalid(rs.cm_dn);
              break;
          }
        } else {
          information.content = this.translateResult.HOME.DN_NOT_EXIST;
          this.displayInfomation(information, displayInfo);
        }
      },
      error: (er) => {
        this.isInprocess = false;
        information.content = er?.error?.message;
        this.displayInfomation(information, displayInfo);
      }
    });
  }


  handlePostDNSuccess(lineValidate: ILineValidateResponseInfo) {
    const rowValues: IDirectoryTable = this.getDefaultRowValues();

    // 1. set value column 'Directory Number'
    rowValues.cm_dn = lineValidate.cm_dn;
    // 2. set value column 'call server clli'
    if (!rowValues.clli || rowValues.clli === EDirectoryValue.LOADING) {
      rowValues.clli = this.storageService.clli;
    }
    // Need to add this properties
    this.updateRowDataByLineData(rowValues, lineValidate);

    if (lineValidate.gw_name === EDirectoryValue.NOT_AVAILABLE
      && lineValidate.gw_address === EDirectoryValue.NOT_AVAILABLE
      && lineValidate.endpoint_name === EDirectoryValue.NOT_AVAILABLE) {
      // 4.1 set value column 'Endpoint State Communication Error'
      rowValues.endpoint_state = EDirectoryValue.LEGACY_LINE;
      // 5.1 set value column 'Gateway Profile'
      rowValues.profile = EDirectoryValue.NOT_AVAILABLE;
    } else {
      // this.homeService.getGateway(lineValidate.cm_gwc_name, lineValidate.gw_name).subscribe();
      this.homeService.getAllInformationGWElement(lineValidate.gw_name).subscribe({
        next: (rs) => {
          // 5.2 set value column 'Gateway Profile'
          rowValues.profile = rs.profile;
          this.homeService.getGateway(lineValidate.cm_gwc_name, lineValidate.gw_name).subscribe({
            next: (getGatewayRes) => {
              // adding protocol into rowValues to re-use on Refresh function.
              rowValues.getGatewayProtocol = getGatewayRes.protocol;
              this.handleEndpointStateField(rowValues);
            },
            error: () => {
              rowValues.endpoint_state = EDirectoryValue.NOT_AVAILABLE;
            }
          });
        },
        error: () => {
          rowValues.profile = EDirectoryValue.NOT_AVAILABLE;
        }
      });
    }

    const lineDataObject: ILineRequest = this.directoryService.formatLineRequest(lineValidate);
    const rowIndex = this.directoryService.getRowIndexByCMDN(lineValidate.cm_dn);

    // 3. set value column 'Call Server Line State'
    this.handleCMLineStateField(lineDataObject, rowValues);

    // 6. set value column 'Time'
    rowValues.time = this.commonService.getCurrentTime();
    this.directoryService.handleRowData(rowValues, rowIndex);
  }

  doPostGateway(postValue: string) {
    // Directory Number (OK)
    // call server clli --> get from the Storage (OK)
    // Call Server Line State (OK)
    // Endpoint State Communication Error OK
    // Gateway Profile (OK)
    // Time --> Auto (OK)
    const clliStorage = this.storageService.clli;
    if (!clliStorage) {
      this.infoDialogData.title = this.translateResult.HOME.POST_COMMAND_FAILED;
      this.infoDialogData.content = this.translateResult.HOME.NOT_FOUND_CLLI;
      this.displayInfoDialog = true;
      return;
    }
    const rowsDataInit = this.getDefaultRowValues();
    rowsDataInit.clli = clliStorage;
    this.isInprocess = true;
    this.homeService.getAllInformationGWElement(postValue).subscribe({
      next: (rs) => {
        // rs.profile --> Gateway Profile
        rowsDataInit.profile = rs.profile;
        const epData = {
          endpointName: '',
          endpointStatus: '',
          endpointTNType: -1,
          extNodeNumber: -1,
          extTerminalNumber: -1,
          gatewayName: postValue,
          gwDefaultDomain: '',
          gwHostname: '',
          gwcID: '',
          iid: -1
        };
        const encodedEpData = encodeURIComponent(JSON.stringify(epData));
        this.homeService.getEndpointsOrdered(encodedEpData, false).subscribe({
          next: (endpointsOrderedRes) => {
            const tidValues: string[] = [];
            for (let i = 0; i < endpointsOrderedRes.epData.length; i++) {
              const epDataItem = endpointsOrderedRes.epData[i];
              tidValues.push(epDataItem.extNodeNumber + '.0.' + epDataItem.extTerminalNumber);
            }
            let processTIDComplete = 0;
            // we can retrieve the protocol with this service.
            this.homeService.getGateway(rs.gwc, postValue).subscribe({
              next: (gwsRs) => {
                for (let i = 0; i < tidValues.length; i++) {
                  const rowsData = { ...rowsDataInit };
                  // adding protocol into rowsData to re-use on Refresh function.
                  rowsData.getGatewayProtocol = gwsRs.protocol;
                  const tidValue = tidValues[i];
                  this.homeService.getLineInformationByTIDAndCLLI(tidValue, rowsData.clli).subscribe({
                    next: (rsLine) => {
                      // Need to add this properties
                      this.updateRowDataByLineData(rowsData, rsLine);
                      processTIDComplete++;
                      if (processTIDComplete === tidValues.length) {
                        this.isInprocess = false;
                      }
                      if (rsLine.cm_rc === CM_RC_VALUE.DN_VALID) {
                        // skip if DN = ''.
                        if (rsLine.cm_dn.trim() === '') {
                          return;
                        }
                        // rsLine.cm_dn --> Directory Number
                        rowsData.cm_dn = rsLine.cm_dn;
                        if (rsLine.gw_name === EDirectoryValue.NOT_AVAILABLE
                          && rsLine.gw_address === EDirectoryValue.NOT_AVAILABLE
                          && rsLine.endpoint_name === EDirectoryValue.NOT_AVAILABLE) {
                          rowsData.endpoint_state = EDirectoryValue.LEGACY_LINE;
                          rowsData.profile = EDirectoryValue.NOT_AVAILABLE;
                        } else {
                          if (protocolsSupported.includes(gwsRs.protocol)) {
                            this.homeService.getEndpointStateInformation(rsLine.cm_gwc_address, rsLine.cm_tid).subscribe({
                              next: (endpointStateRs) => {
                                // eslint-disable-next-line max-len
                                // endpointStateRs.epState, endpointStateRs.epCallState, endpointStateRs.epTerminalType --> Endpoint State Communication Error
                                rowsData.endpoint_state = this.directoryService.formatEndpointStateValue(endpointStateRs);
                              },
                              error: () => {
                                rowsData.endpoint_state = EDirectoryValue.NOT_AVAILABLE;
                              },
                              complete:() => {
                                this.directoryService.dataTableChange$.next(true);
                              }
                            });
                          } else {
                            // EDirectoryValue.UNSUPPORTED_GW --> Endpoint State Communication Error
                            rowsData.endpoint_state = EDirectoryValue.UNSUPPORTED_GW;
                          }
                        }

                        const lineDataObject = this.directoryService.formatLineRequest(rsLine);
                        this.handleCMLineStateField(lineDataObject, rowsData);

                        rowsData.time = this.commonService.getCurrentTime();
                        this.directoryService.handleRowData(rowsData);
                      } else {
                        this.directoryService.handleRowWhenCMRCInvalid(rsLine.cm_dn);
                      }
                    },
                    error: (er) => {
                      processTIDComplete++;
                      if (processTIDComplete === tidValue.length) {
                        this.isInprocess = false;
                      }
                    }
                  });
                }
              },
              error: (erGetGateway) => {
                this.infoDialogData.title = this.translateResult.HOME.POST_COMMAND_FAILED;
                this.infoDialogData.content = erGetGateway.error.message;
                this.displayInfoDialog = true;
                this.isInprocess = false;
              }
            });
          },
          error: (er) => {
            this.infoDialogData.title = this.translateResult.HOME.POST_COMMAND_FAILED;
            this.infoDialogData.content = er.error.message;
            this.displayInfoDialog = true;
            this.isInprocess = false;
          }
        });

      },
      error: (er) => {
        this.infoDialogData.title = this.translateResult.HOME.POST_COMMAND_FAILED;
        this.infoDialogData.content = er.error.message;
        this.displayInfoDialog = true;
        this.isInprocess = false;
      }
    });
  }

  changeTypesPost(type: string) {
    this.postForm.get('postValue')?.setValue('');
    if (type === POST_TYPE.SELECT_GATEWAY_TO_POST) {
      this.orderListGateway.resetFilter();
      this.save();
    }
  }

  cancelDeloadPostLine() {
    this.autoTerminationSubscription = this.preferencesService.autoTerminationEmit$.subscribe(() => {
      const lineTemp: ILineRequest[] = [];
      const dataTemp = this.directoryService.dataTable;
      for (let i = 0; i < dataTemp.length; i++) {
        const item = dataTemp[i];
        lineTemp.push({
          cm_clli: item.clli,
          cm_tid: item.cm_dn,
          endpoint_name: item.endpoint_name,
          gw_address: item.gw_address,
          gw_name: item.gw_name
        });
      }
      // when "auto termination" timer expires and CPD Requests is enabled
      if (this.preferencesService.getPreferencesCPDRequest() && lineTemp.length > 0) {
        this.statusLogService.pushLogs('VRB: Auto Termination - cancelling pending CPD requests');
        lineTemp.forEach(line => {
          this.homeService.postCancelDeload(line).subscribe({
            error: (err) => {
              this.commonService.showAPIError(err);
            }
          });
        });
      }
    });
  }

  refreshDN($dataDN: IRefreshDNEmit) {
    if ($dataDN.refreshType === REFRESH_TYPE.ROW) {
      this.doRefreshDN($dataDN);
    } else {
      if ($dataDN.refreshType !== REFRESH_TYPE.AUTO) {
        this.isInprocess = true;
      }
      this.homeService.getCMCLLI().subscribe(() => {
        if ($dataDN.refreshType !== REFRESH_TYPE.AUTO) {
          this.isInprocess = false;
        }
        this.doRefreshDN($dataDN);
      }, (error) => {
        if ($dataDN.refreshType !== REFRESH_TYPE.AUTO) {
          this.isInprocess = false;
        }
        this.commonService.showAPIError(error);
      });
    }
  }

  doRefreshDN(dataDN: IRefreshDNEmit) {
    if (!Array.isArray(dataDN.data)) {
      return;
    }
    dataDN.data.forEach((rowValues: IDirectoryTable) => {
      const lineRequest = this.directoryService.formatLineRequest(rowValues);
      rowValues.time = this.commonService.getCurrentTime();
      if (dataDN.refreshType !== REFRESH_TYPE.AUTO) {
        rowValues.cm_line_state = EDirectoryValue.LOADING;
        rowValues.endpoint_state = EDirectoryValue.LOADING;
      }

      this.homeService.getLinePostInformation(lineRequest).pipe(take(1)).subscribe({
        next: (rs) => {
          if (rs.cm_rc === CM_RC_VALUE.DN_VALID) {
            rowValues.cm_line_state = rs.cm_line_state;
            if (rowValues.gw_name === EDirectoryValue.NOT_AVAILABLE
              && rowValues.gw_address === EDirectoryValue.NOT_AVAILABLE) {
              rowValues.endpoint_state = EDirectoryValue.LEGACY_LINE;
            } else {
              this.handleEndpointStateField(rowValues);
            }
          } else {
            // If cm_rc === '2' => Do not display any result in table related to this DN
            if (rs.cm_rc === CM_RC_VALUE.DN_NOT_EXIST) {
              this.directoryService.deleteRowWhenCMRC_2(rowValues.cm_dn);
            } else {
              rowValues.endpoint_state = EDirectoryValue.NOT_AVAILABLE;
              rowValues.cm_line_state = EDirectoryValue.NOT_AVAILABLE;
            }
            const displayInfo = dataDN.refreshType === REFRESH_TYPE.ROW ? DISPLAY_INFO_TYPE.DIALOG : DISPLAY_INFO_TYPE.LOGS;
            const information: IInformationData = { title: this.translateResult.COMMON.ERROR, content: '', dnValue: rs.cm_dn };
            information.content = this.handleCMRCInvalidMessage(rs.cm_rc, rowValues.clli);
            this.displayInfomation(information, displayInfo);
          }
        },
        error: () => {
          rowValues.cm_line_state = EDirectoryValue.NOT_AVAILABLE;
          rowValues.endpoint_state = EDirectoryValue.NOT_AVAILABLE;
        },
        complete:() => {
          this.directoryService.dataTableChange$.next(true);
        }
      });
      this.directoryService.handleRowData(rowValues);
    });
  }

  // #region Common functions
  handleCMRCInvalidMessage(cm_rc: string, clli: string) {
    if (cm_rc === CM_RC_VALUE.DMA_FAULT) {
      this.statusIndicatorsService.updateStatus(3, Status.FAULT);
    }
    if (this.translateResult.HOME.CM_RC_ERRORS.hasOwnProperty(cm_rc)) {
      return this.translateResult.HOME.CM_RC_ERRORS[cm_rc]?.replace('{{CLLI}}', clli);
    } else {
      return 'cm_rc: ' + cm_rc;
    }
  }

  displayInfomation(information: IInformationData, displayInfo = DISPLAY_INFO_TYPE.DIALOG) {
    if (!information.title) {
      information.title = this.translateResult.HOME.POST_COMMAND_FAILED;
    }
    switch (displayInfo) {
      case DISPLAY_INFO_TYPE.TOAST:
        const summary = information.dnValue ? (information.dnValue + ' - ' + information.title) : information.title;
        this.commonService.showErrorMessage(information.content, summary);
        break;
      case DISPLAY_INFO_TYPE.DIALOG:
        this.infoDialogData.title = information.title || '';
        this.infoDialogData.content = information.content;
        this.displayInfoDialog = true;
        break;
      default:
        this.statusLogService.pushLogs(`DN ${information.dnValue} ${information.content}`);
        break;
    }
  }

  handleEndpointStateField(rowValues: IDirectoryTable) {
    if (rowValues.getGatewayProtocol && protocolsSupported.includes(rowValues.getGatewayProtocol)) {
      this.homeService.getEndpointStateInformation(rowValues.cm_gwc_address, rowValues.cm_tid).subscribe({
        next: (endpoint) => {
          // 4.3 set value column 'Endpoint State Communication Error'
          rowValues.endpoint_state = this.directoryService.formatEndpointStateValue(endpoint);
        },
        error: () => {
          rowValues.endpoint_state = EDirectoryValue.NOT_AVAILABLE;
        },
        complete:() => {
          this.directoryService.dataTableChange$.next(true);
        }
      });
    } else {
      // 4.2 set value column 'Endpoint State Communication Error'
      rowValues.endpoint_state = EDirectoryValue.UNSUPPORTED_GW;
    }
  }

  handleCMLineStateField(lineData: ILineRequest, rowValues: IDirectoryTable) {
    this.homeService.getLinePostInformation(lineData).subscribe({
      next: (rs) => {
        rowValues.cm_line_state = rs.cm_line_state;
      },
      error: () => {
        rowValues.cm_line_state = EDirectoryValue.NOT_AVAILABLE;
      }
    });
  }

  getDefaultRowValues(): IDirectoryTable {
    return {
      cm_dn: EDirectoryValue.LOADING,
      clli: EDirectoryValue.LOADING,
      time: EDirectoryValue.LOADING,
      cm_line_state: EDirectoryValue.LOADING,
      endpoint_state: EDirectoryValue.LOADING,
      profile: EDirectoryValue.LOADING,
      gw_address: EDirectoryValue.EMPTY,
      endpoint_name: EDirectoryValue.EMPTY,
      cm_tid: EDirectoryValue.EMPTY,
      cm_gwc_address: EDirectoryValue.EMPTY,
      gw_name: EDirectoryValue.EMPTY
    };
  }

  /**
   * Need add these properties to re-use for action on the table
   * @param rowsData IDirectoryTable
   * @param lineData ILineValidateResponseInfo
   */
  updateRowDataByLineData(rowsData: IDirectoryTable, lineData: ILineValidateResponseInfo) {
    rowsData.gw_name = lineData.gw_name;
    rowsData.gw_address = lineData.gw_address;
    rowsData.endpoint_name = lineData.endpoint_name;
    rowsData.cm_tid = lineData.cm_tid;
    rowsData.cm_gwc_address = lineData.cm_gwc_address;
  }
  // #endregion

  ngOnDestroy(): void {
    this.autoTerminationSubscription?.unsubscribe();
    if (this.storageService.sessionId) {
      this.directoryService.setPostCommandDataToStorage(this.postForm.value);
    }
  }

  selectionChange() {
    // only allow select one Gateway
    if (this.selectedGateway.length > 0) {
      this.selectedGateway = [this.selectedGateway[0]];
    }
  }

  hideDialogGateway() {
    this.postForm.get('type')?.setValue(POST_TYPE.POST_GATEWAY);
  }

  handleFilterOrderList() {
    this.selectedGateway = [];
  }
}
