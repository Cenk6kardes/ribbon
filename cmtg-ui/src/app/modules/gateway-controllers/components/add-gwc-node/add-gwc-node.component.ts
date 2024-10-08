import { map } from 'rxjs/operators';
import { ITableConfig, Icols, FilterTypes } from 'rbn-common-lib';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { tableConfigCommon } from 'src/app/types/const';
import { NetworkViewService } from 'src/app/services/api/network-view.service';
import { CommonService } from 'src/app/services/common.service';
import { GatewayControllersService } from '../../services/gateway-controllers.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddGwcOptions, gwcNodeCapability } from '../../models/gwControllers';

@Component({
  selector: 'app-add-gwc-node',
  templateUrl: './add-gwc-node.component.html',
  styleUrls: ['./add-gwc-node.component.scss']
})
export class AddGwcNodeComponent implements OnInit, OnChanges {
  @Input() isShowNewGWCNodeDialog: boolean;
  @Output() closeDialogEmitter = new EventEmitter();
  showAddDialog = false;
  isInprocess = false;
  tableCols: Icols[] = [];
  tableDatas: any;
  tableConfig: ITableConfig;
  translateResults: any;
  disableButton = true;
  form: FormGroup;
  toneValue = '';
  termTypes: string[] = [];
  execInfoOptions: any = [];
  isFlowThrough = false;
  errorData: {
    errorCode: string;
    message: string;
  };
  messageText: string;
  messageTextDetail: string;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showDetailsBtn = true;
  showAddErrorDialog = false;

  options: IAddGwcOptions = {
    controllerName: [],
    gwcProfiles: [],
    codecProfiles: []
  };

  constructor(
    private networkViewService: NetworkViewService,
    private commonService: CommonService,
    private gatewayControllerService: GatewayControllersService,
    private translateInternalService: TranslateInternalService,
    private fb: FormBuilder
  ) {
    this.translateResults = this.translateInternalService.translateResults;

    this.tableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        ...tableConfigCommon.tableOptions,
        dataKey: 'capability'
      },
      tableName: 'capabilitiyCapacity'
    };
  }

  ngOnInit(): void {
    this.initCols();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initForm();
    if (this.isShowNewGWCNodeDialog) {
      this.getDatas();
    }
  }

  initForm() {
    this.form = this.fb.group({
      controllerName: [null],
      defaultDomainName: [''],
      profile: [null, Validators.required],
      flowCheckBox: [false],
      gwcAdressName: [{ value: '', disabled: true }],
      gwcCodecProfile: [null, Validators.required],
      termTypeFormGroup: this.fb.group({})
    });
  }

  get controllerName() {
    return this.form.get('controllerName')?.value;
  }
  get defaultDomainName() {
    return this.form.get('defaultDomainName')?.value;
  }
  get profile() {
    return this.form.get('profile');
  }
  get gwcCodecProfile() {
    return this.form.get('gwcCodecProfile');
  }
  get flowCheckBox() {
    return this.form.get('flowCheckBox');
  }
  get gwcAdressName() {
    return this.form.get('gwcAdressName');
  }

  handleChangeProfile(event: string) {
    this.flowCheckBox?.setValue(false);
    this.getGatewayControllerProfileData(event);
    this.getFlowthroughStatus(event);
  }

  handleControllerNameChange(event: string) {
    event ? (this.disableButton = false) : (this.disableButton = true);
  }
  handleflowCheckBox(event: any) {
    if (event) {
      this.gwcAdressName?.enable();
    } else {
      this.gwcAdressName?.reset();
      this.gwcAdressName?.disable();
    }
  }

  getGatewayControllerProfileData(profile: string) {
    const termTypeFormGroup = this.form.get('termTypeFormGroup') as FormGroup;
    this.isInprocess = true;
    this.networkViewService.getGatewayControllerProfileData(profile).subscribe({
      next: (res) => {
        this.execInfoOptions = res.execinfo.reduce(
          (
            acc: { [key: string]: string[] },
            item: { name: string; termtype: string }
          ) => {
            const { termtype, name } = item;
            if (!acc[termtype]) {
              acc[termtype] = [];
            }
            acc[termtype].push(name);
            return acc;
          },
          {}
        );

        const termtypes: string[] = res.execinfo.map(
          (a: { name: string; termtype: string }) => a.termtype
        );
        this.termTypes = [...new Set(termtypes)];
        // this part for delete old controls if there is any when changing profile option
        if (termTypeFormGroup) {
          Object.keys(termTypeFormGroup.controls).forEach((controlName) => {
            termTypeFormGroup.removeControl(controlName);
          });
        }
        //
        this.termTypes.map((termType: string) => {
          const initialValue = this.execInfoOptions[termType][0];
          termTypeFormGroup.addControl(
            termType,
            this.fb.control(initialValue, Validators.required)
          );

          this.form.updateValueAndValidity();
        });

        this.toneValue = res.toneinfo;
        const capabilities = res.types.map(
          (capabilityValue: { __value: number }, index: number) => ({
            capability: gwcNodeCapability[capabilityValue.__value],
            capacity: res.capacity[index]
          })
        );
        this.tableDatas = capabilities;
      },
      error: (err) => {
        this.commonService.showAPIError(err);
      },
      complete: () => {
        this.isInprocess = false;
      }
    });
  }

  getDatas() {
    this.getAllGatewayControllerProfiles();
    this.getLabMode();
    this.getqueryNtwkCodecProfilesByFilter();
  }

  initCols() {
    this.tableCols = [
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
      }
    ];
  }
  getAllGatewayControllerProfiles() {
    // Profile(s)
    this.networkViewService.getGatewayControllerProfiles().subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.options.gwcProfiles = res;
          this.options.gwcProfiles.sort();
        }
      },
      error: (error) => {
        this.isInprocess = false;
        this.commonService.showAPIError(error);
      }
    });
  }
  getLabMode() {
    this.isInprocess=true;
    // check false or not if false continue to gwcconfigured on shelf
    this.gatewayControllerService.getLabMode().subscribe({
      next: (booleanLabMode: boolean) => {
        this.isInprocess = false;
        // getgwcsconfigured on shelf is for controllername
        if (!booleanLabMode) {
          this.isInprocess = true;
          this.gatewayControllerService
            .getGWCsConfiguredOnShelf(false)
            .subscribe({
              next: (response) => {
                this.isInprocess = false;
                if (response.length < 1) {
                  this.showAddDialog = false;
                  this.commonService.showInfoMessage(
                    this.translateResults.GATEWAY_CONTROLLERS.ADD_GWC_NODE
                      .ERRORS.ALL_GWC_PROVISIONED
                  );
                  this.closeDialog();
                } else if (response.length === 1) {
                  this.showAddDialog = true;
                  this.options.controllerName.push(response[0]['gwcName']);
                } else if (response.length > 1) {
                  this.showAddDialog = true;
                  this.options.controllerName = response.map((res: any)=>res.gwcName);
                }
                this.options.controllerName.sort((a, b) => {
                  const numA = parseInt(a.split('-')[1],10);
                  const numB = parseInt(b.split('-')[1],10);
                  return numA - numB;
                });
              },
              error: (err) => {
                this.isInprocess = false;
                this.commonService.showAPIError(err);
              }
            });
        }
      },
      error: (err) => {
        this.isInprocess = false;
        this.commonService.showAPIError(err);
      }
    });
  }

  getqueryNtwkCodecProfilesByFilter() {
    this.isInprocess = true;
    this.gatewayControllerService
      .getQueryNtwkCodecProfilesByFilter_v1()
      .pipe(map((res: any) => res.ncpList))
      .subscribe({
        next: (res) => {
          this.isInprocess = false;
          res.map((obj: any) => {
            this.options.codecProfiles.push(obj['name']);
          });
        },
        error: (err) => {
          this.isInprocess = false;
          this.commonService.showAPIError(err);
        }
      });
  }

  getFlowthroughStatus(profile: string) {
    this.isInprocess = true;
    this.gatewayControllerService.getFlowthroughStatus(profile).subscribe({
      next: (res) => {
        this.isFlowThrough = res;
        this.isInprocess = false;
      },
      error: (err) => {
        this.isInprocess = false;
        this.commonService.showAPIError(err);
      }
    });
  }

  addIfFlowthroughGWCFalse(termTypes: string[], execData: string[]) {
    this.isInprocess = true;
    this.gatewayControllerService
      .addGWCtoCSsync(
        {
          gwcUnitNumber: this.controllerName.substring(4),
          profileName: this.profile?.value,
          codecProfile: this.gwcCodecProfile?.value
        },
        this.defaultDomainName,
        termTypes,
        execData
      )
      .subscribe({
        next: (res: any) => {
          if (res.rc.__value !== 0) {
            this.commonService.showErrorMessage(res.responseMsg);
            return;
          }
          this.commonService.showSuccessMessage(res.responseMsg);
          this.closeDialog();
        },
        error: (err) => {
          this.isInprocess = false;
          this.errorData = err?.error || err;
          const messageAndDetails = JSON.stringify(this.errorData.message);
          const parsedData = messageAndDetails.split('details = ');
          this.detailsText = parsedData[0].replace(this.reg, '<br>');
          this.messageText =
            this.translateResults.GATEWAY_CONTROLLERS.ADD_GWC_NODE.ERRORS.FAILED_TO_ADD;

          this.showAddErrorDialog = true;
        },
        complete: () => {
          this.isInprocess = false;
        }
      });
  }
  addIfFlowthroughGWCTrue(termTypes: string[], execData: string[]) {
    this.isInprocess = true;
    this.gatewayControllerService
      .addGwctoCSsync_v2(
        {
          gwcUnitNumber: this.controllerName.substring(4),
          profileName: this.profile?.value,
          codecProfile: this.gwcCodecProfile?.value
        },
        this.defaultDomainName,
        this.gwcAdressName?.value,
        termTypes,
        execData
      )
      .subscribe({
        next: (res: any) => {
          if (res.rc.__value !== 0) {
            this.commonService.showErrorMessage(res.responseMsg);
            return;
          }
          this.commonService.showSuccessMessage(res.responseMsg);
          this.closeDialog();
        },
        error: (err) => {
          this.isInprocess = false;
          this.errorData = err?.error || err;
          const messageAndDetails = JSON.stringify(this.errorData.message);
          const parsedData = messageAndDetails.split('details = ');
          this.detailsText = parsedData[0].replace(this.reg, '<br>');
          this.messageText =
            this.translateResults.GATEWAY_CONTROLLERS.ADD_GWC_NODE.ERRORS.FAILED_TO_ADD;

          this.showAddErrorDialog = true;
        },
        complete: () => {
          this.isInprocess = false;
        }
      });
  }

  onFormSubmit(event: boolean) {
    if (event) {
      if (this.form.invalid) {
        if (this.profile?.invalid) {
          this.commonService.showErrorMessage(
            this.translateResults.GATEWAY_CONTROLLERS.ADD_GWC_NODE.ERRORS
              .PROFILE_REQUIRED
          );
          return;
        }
        if (this.gwcCodecProfile?.invalid) {
          this.commonService.showErrorMessage(
            this.translateResults.GATEWAY_CONTROLLERS.ADD_GWC_NODE.ERRORS
              .GWC_CODEC_REQUIRED
          );
          return;
        }
      }
      const termTypeFromGroupValues = this.form
        .get('termTypeFormGroup')
        ?.getRawValue();
      const termTypes = Object.keys(termTypeFromGroupValues);
      const execData = Object.values(termTypeFromGroupValues) as string[];
      this.flowCheckBox?.value
        ? this.addIfFlowthroughGWCTrue(termTypes, execData)
        : this.addIfFlowthroughGWCFalse(termTypes, execData);
    } else {
      this.closeDialog();
    }
  }
  closeDialog() {
    this.form.reset();
    this.form.removeControl('termTypeFormGroup');
    for (const option in this.options) {
      this.options[option as keyof IAddGwcOptions] = [];
    }
    this.tableDatas = [];
    this.toneValue = '';

    this.termTypes = [];
    this.execInfoOptions = [];
    this.isFlowThrough = false;
    this.showAddDialog=false;
    this.closeDialogEmitter.emit();
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  closeAddErrorDialog() {
    this.showAddErrorDialog = false;
    this.showDetailsBtn = true;
  }

  refreshTable() {
    this.getGatewayControllerProfileData(this.profile?.value);
  }
}
