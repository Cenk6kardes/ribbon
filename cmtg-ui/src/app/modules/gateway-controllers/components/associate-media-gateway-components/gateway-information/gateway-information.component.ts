import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  GatewayInformationOptions,
  ILblProfileData,
  categoryMapping,
  serviceTypeMapping
} from '../../../models/gwControllers';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { CommonService } from 'src/app/services/common.service';
import { AssociateFormService } from '../../../services/associate-form.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-gateway-information',
  templateUrl: './gateway-information.component.html',
  styleUrls: ['./gateway-information.component.scss']
})
export class GatewayInformationComponent implements OnInit, OnChanges {
  @Input() gatewayOptions: GatewayInformationOptions;
  @Input() showDialog: boolean;
  @Input() pep_alg_radioValue: string;
  @Output() multisiteSelection: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() signalingGateway: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() TGRPPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() GRPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() SignalProtocols = new EventEmitter();
  @Output() LGRPPanel = new EventEmitter();
  @Output() PEPServerALG = new EventEmitter();
  @Output() maxEndpoints: EventEmitter<number> = new EventEmitter<number>();
  @Output() gwcBackupPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
  isInprocess=false;
  form: FormGroup;
  controllerNamePlaceHolder = 'COMMON.SELECT';
  showSiteName = false;
  showlgrpType = false;
  endpointType = -1;
  multiSiteSelection = false;
  requiredValidator=Validators.required;
  lgrpTypeOptions: string[] = [];
  inventoryType: string;
  category: number;
  pepOrAlgLabel = '';
  translateResults: any;
  showIsNodeSharing=false;
  constructor(
    private formService: AssociateFormService,
    private gwcService: GatewayControllersService,
    private commonService: CommonService,
    private networkService: NetworkViewService,
    private translateService: TranslateInternalService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showDialog'] && !this.showDialog) {
      this.resetValues();
    }
    if (changes['pep_alg_radioValue']) {
      switch(this.pep_alg_radioValue){
        case 'pepServerName':
          this.pepOrAlgLabel =
          this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.FIELDS.GATEWAY_INFO.GATEWAY_PEP_SERVER;
          break;
        case 'algName':
          this.pepOrAlgLabel =
          this.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.FIELDS.GATEWAY_INFO.GATEWAY_ALG;
          break;
        default:
          this.pepOrAlgLabel='';
      }
    }
  }

  ngOnInit(): void {
    this.form = this.formService.gatewayInformation;
  }

  get getReservedTerminations(){
    return this.form.get('reservedTerminations');
  }

  get getIpAddres(){
    return this.form.get('ipAddress');
  }

  resetValues() {
    this.showSiteName = false;
    this.showlgrpType = false;
    this.endpointType = -1;
    this.controllerNamePlaceHolder = 'COMMON.SELECT';
    this.lgrpTypeOptions = [];
  }

  handleControllerNameChange(gwc: string) {
    this.checkForGatewayLgrp(gwc);
    if(this.form.get('profileName')?.value.trim().length > 0){
      this.checkTGRPpanel(gwc);
      this.checkGwcBackupPanel(gwc);
    }
  }

  handleLgrpTypeChange(lgrpType: string){
    this.showIsNodeSharing=lgrpType==='LL_3RDPTY_FLEX'?true:false;
    this.form.get('isNodeSharing')?.reset();
  }

  handleProfileChange(profile: string) {
    this.gwcService.getGwCapacity_Profiles(profile).subscribe({
      next: (res) => {
        this.inventoryType = res.inventoryType;
        this.category = res.category.__value;
        this.SignalProtocols.emit(res.supportedProtocols);
        this.lgrpTypeOptions = res.lgrpType.split(',');
        this.endpointType = res.endpointType.__value;
        if (res.resvTermMandatory === 'true') {
          this.form
            .get('reservedTerminations')
            ?.setValidators([Validators.required, Validators.pattern(/^\S*$/)]);
        } else {
          this.form
            .get('reservedTerminations')
            ?.removeValidators([
              Validators.required,
              Validators.pattern(/^\S*$/)
            ]);
        }
        this.multiSiteSelection = res.multiSiteNamesSupported === 'true';
        this.multisiteSelection.emit(this.multiSiteSelection);
        this.maxEndpoints.emit(res.maxEndpoints);
        this.form.get('reservedTerminations')?.addValidators(Validators.max(res.maxEndpoints));
        const includeLine = res.typeList.includes('line');
        this.showSiteName = !(res.multiSiteNamesSupported === 'true') && includeLine;
        if (this.showSiteName) {
          this.form.addControl('siteName', new FormControl(''));
          if(!this.form.get('siteName')?.value){
            this.form.get('siteName')?.setValue(this.gatewayOptions.siteName[0]);
          }
        } else {
          this.form.removeControl('siteName');
        }
        this.form.get('reservedTerminations')?.updateValueAndValidity();
        this.form.updateValueAndValidity();
        if (this.form.get('controllerName')?.value) {
          this.checkForGatewayLgrp(this.form.get('controllerName')?.value);
          this.checkTGRPpanel(this.form.get('controllerName')?.value);
          this.checkGwcBackupPanel(this.form.get('controllerName')?.value);
        }
        this.checkGR_834GWName(profile);
        this.checkLGRPLocationPanel(res.dispPhyLocation);
        this.checkPEPServerALGPanel(profile);
      },
      error: (err) => {
        this.commonService.showAPIError(err);
      }
    });
    this.checkSignalingGatewayPanel(profile);
    this.form.get('pep_alg')?.setValue('');
    this.formService.gwcBackup.reset();
  }

  checkGwcBackupPanel(gwc: string) {
    this.gwcService.isLblSupported(gwc).subscribe({
      next: (lblRes: boolean) => {
        if (lblRes === true) {
          this.networkService.getProfileData(this.form.get('profileName')?.value).subscribe({
            next: (profileRes: ILblProfileData) => {
              if (
                profileRes &&
                profileRes.serviceTypes &&
                Array.isArray(profileRes.serviceTypes)
              ) {
                const containsZero = profileRes.serviceTypes.some(
                  (item) => item.__value === 0
                );
                if (
                  containsZero &&
                  this.inventoryType !== 'SIPVOICE' &&
                  this.category === 1
                ) {
                  this.gwcBackupPanel.emit(true);
                } else {
                  this.gwcBackupPanel.emit(false);
                }
              }
            },
            error: (err) => {
              this.commonService.showAPIError(err);
            }
          });
        }
      },
      error: (err) => {
        this.commonService.showAPIError(err);
      }
    });
  }

  keyPreventFn(event: any) {
    const forbiddenKeyCodes = ['+', 'e', 'E', ',', '-', '.']; // plus, e, comma, minus, dot
    if (forbiddenKeyCodes.includes(event.key)) {
      event.preventDefault();
    }
  }

  checkForGatewayLgrp(gwc: string) {
    this.form.get('isNodeSharing')?.reset();
    this.showIsNodeSharing=false;
    if (!this.multiSiteSelection && this.endpointType === 8) {
      this.isInprocess = true;
      this.gwcService.getGWCNodeByName_v1(gwc).subscribe({
        next: (res) => {
          this.isInprocess = false;
          const set = new Set([
            'LARGE_LINENA_V3',
            'LARGE_LINENA_V4',
            'LARGE_LINEINTL_V3'
          ]);
          if (set.has(res.serviceConfiguration.gwcProfileName)) {
            this.form.addControl('lgrpType', new FormControl(''));
            this.showlgrpType = true;
          } else {
            this.showlgrpType = false;
          }
          if(this.showlgrpType){
            this.form.get('lgrpType')?.setValue(this.lgrpTypeOptions[0]);
          }
        },
        error: (err) => {
          this.isInprocess = false;
          this.commonService.showAPIError(err);
        }
      });
    } else {
      this.showlgrpType = false;
      this.form.removeControl('lgrpType');
    }
  }

  checkSignalingGatewayPanel(profileName: string) {
    if (profileName === 'GENBAND_G9_NA' || profileName === 'GENBAND_G9_INTL') {
      this.signalingGateway.emit(true);
    } else {
      this.signalingGateway.emit(false);
    }
  }

  checkTGRPpanel(controllerName: string) {
    // reset tgrp panel
    this.TGRPPanel.emit(false);
    const set = new Set([
      'TRUNKINTL_V2',
      'TRUNKNA_V2',
      'LINE_TRUNK_AUD_NA_V2',
      'LINE_TRUNK_AUD_NA_V3',
      'LINE_TRUNK_AUD_INTL_V2'
    ]);
    this.gwcService.getGWCNodeByName_v1(controllerName).subscribe({
      next: (GWCNodeRespose) => {
        if (
          set.has(GWCNodeRespose.serviceConfiguration.gwcProfileName)
        ) {
          this.networkService
            .getProfileData(this.form.get('profileName')?.value)
            .subscribe({
              next: (res) => {
                if (res.serviceTypes.length > 0) {
                  const valuesArray = res.serviceTypes.map(
                    (value: { __value: number }) => value.__value
                  );
                  const trpPanelCondition = valuesArray.includes(1);
                  this.TGRPPanel.emit(trpPanelCondition);
                }
              },
              error: (err) => {
                this.commonService.showAPIError(err);
              }
            });
        } else {
          this.TGRPPanel.emit(false);
        }
      },
      error: (err) => {
        this.commonService.showAPIError(err);
      }
    });
  }

  checkPEPServerALGPanel(profile: string) {
    // close pepserverPanel
    this.PEPServerALG.emit(false);
    this.networkService.getProfileData(profile).subscribe({
      next: (res) => {
        let isServiceTypeLine = false;
        res.serviceTypes.map((tempServiceType: { __value: number }) => {
          if (
            serviceTypeMapping[tempServiceType.__value] ===
            serviceTypeMapping[4]
          ) {
            this.PEPServerALG.emit(true);
          } else {
            this.PEPServerALG.emit(false);
          }
          if (
            serviceTypeMapping[0] ===
            serviceTypeMapping[tempServiceType.__value]
          ) {
            isServiceTypeLine = true;
          }
        });
        const category = categoryMapping[res.category.__value];
        if (category === categoryMapping[2] && isServiceTypeLine) {
          this.controllerNamePlaceHolder =
            'GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.FIELDS.GATEWAY_INFO.AUTO_SELECT';
        } else {
          this.controllerNamePlaceHolder = 'COMMON.SELECT';
        }
      },
      error: (err) => {
        this.commonService.showAPIError(err);
      }
    });
  }

  checkGR_834GWName(profile: string) {
    // reset the GR DATAS
    this.GRPanel.emit(false);
    this.gwcService.isSupportMlt(profile).subscribe({
      next: (res) => {
        const flag = res === 'true' ? true : false;
        this.GRPanel.emit(flag);
      },
      error: (err) => {
        this.commonService.showAPIError(err);
      }
    });
  }

  ipAdressBlur() {
    if (this.form.get('ipAddress')?.invalid) {
      return true;
    } else {
      return false;
    }
  }

  checkLGRPLocationPanel(dispPhyLocation: string) {
    if (dispPhyLocation === 'true') {
      this.LGRPPanel.emit(this.endpointType);
    } else {
      // dont show LGRP component if -1
      this.LGRPPanel.emit(-1);
    }
  }
}
