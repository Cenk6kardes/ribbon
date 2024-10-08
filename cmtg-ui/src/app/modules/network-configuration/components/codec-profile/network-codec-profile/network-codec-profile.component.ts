import {
  mapBearerPathToName,
  mapBearerTypeDefaultandNetworkDefaultToName,
  mapCodecSelectionToName,
  mapCodecSelectionToNumber,
  mapPacketizationRateToName,
  mapPacketizationRateToNumber,
  mapRfc2833andComfortNoiseToName,
  mapRfc2833andComfortNoiseToNumber,
  mapT38ToName,
  mapT38ToNumber } from './../models/network-codec-profile';
import { ITableConfig, Icols, FilterTypes, FieldName, ItemDropdown } from 'rbn-common-lib';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { tableConfigCommon } from 'src/app/types/const';
import {
  IDataCodec,
  INcpListData,
  INetworkCodecProfile,
  INtwkCodecProfileRequestData,
  INtwkCodecProfileTableData } from '../models/network-codec-profile';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-network-codec-profile',
  templateUrl: './network-codec-profile.component.html',
  styleUrls: ['./network-codec-profile.component.scss']
})
export class NetworkCodecProfileComponent implements OnInit {

  tableConfig: ITableConfig;
  cols: Icols[] = [];
  data: INtwkCodecProfileTableData[] = [];
  translateResults: any;
  isLoading = false;
  showAddNwkCodecProfile = false;
  showAddErrorDialog = false;
  showCodecNameExistsErrorDialog = false;
  alreadyExistsMessage = '';
  showInfoAboutCancelOptionDialog = false;
  showInfoAboutInvalidCodec = false;
  deleteSelectedDataWithName = '';
  showDeleteConfirmPopup = false;
  showDeleteErrorDialog = false;
  errorData: {
    errorCode: string,
    message: string
  };
  messageText: string;
  detailsText: string;
  reg = /\\n/g;
  tabReg = /\\t/g;
  showDetailsBtn = true;
  btnLabel = 'Show Details';

  showEditNwkCodecProfile = false;
  beforeEditedData: any;
  showEditErrorDialog = false;

  networkCodecProfileFormGroup: FormGroup;
  packetizationRateDataItems: ItemDropdown[];
  t38DataItems: ItemDropdown[];

  availableCodecs: IDataCodec[];
  codecSelectionOrder: IDataCodec[];

  codecList: IDataCodec[];

  constructor(
    private translateService: TranslateInternalService,
    private networkConfigurationService: NetworkConfigurationService,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
    this.tableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        ...tableConfigCommon.tableOptions,
        dataKey: 'name'
      },
      tableName: 'NtwkCodecProfileTbl',
      actionColumnConfig: {
        actions: [
          {
            icon: 'fa fa-pencil-square-o',
            label: 'Edit',
            tooltip: 'Edit',
            onClick: (data: any, index: any) => {
              this.networkCodecProfileFormGroup.markAsPristine();
              this.showEditNwkCodecProfile = true;

              // set table
              this.initCodec();
              const codecSelectionArray: string[] = data.codecSelection.split(',');
              this.availableCodecs =  this.availableCodecs.filter((codec) => !codecSelectionArray.includes(codec.name));
              this.codecSelectionOrder = codecSelectionArray.filter(codecName => ( codecName !== '<none>' ))
                .map( item => ({ name: item }) );

              // set form value
              this.networkCodecProfileFormGroup.setValue({
                name: data.name,
                packetizationRate: data.packetizationRate,
                t38: data.t38,
                rfc2833: mapRfc2833andComfortNoiseToNumber[data.rfc2833] ? true : false,
                comfortNoise: mapRfc2833andComfortNoiseToNumber[data.comfortNoise] ? true : false,
                networkDefault: (data.networkDefault === 'Yes') ? true : false,
                codecSelectionOrder: this.codecSelectionOrder
              });
            }
          },
          {
            icon: 'fa fa-trash',
            label: 'Delete',
            tooltip: 'Delete',
            onClick: (event: INtwkCodecProfileTableData) => {
              this.deleteSelectedDataWithName = event.name;
              this.showDeleteConfirmPopup = true;
            }
          }
        ]
      }
    };

    this.codecList = [
      { name: 'G.729' },
      { name: 'PCMA' },
      { name: 'PCMU' },
      { name: 'G.726-32' },
      { name: 'G.723-1' },
      { name: 'EVRC' },
      { name: 'EVRC0' },
      { name: 'AAL2-G726-32' },
      { name: 'BV16' },
      { name: 'AMR' },
      { name: 'G726-24' }
    ];
  }

  ngOnInit(): void {
    this.initCols();
    this.initForm();
    this.setDropDownItems();
    this.getNtwkCodecProfile();
    this.initCodec();
  }

  initCols() {
    this.cols = [
      {
        data: [], field: 'name',
        header: this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.FORM.NAME,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'codecSelection',
        header: this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.FORM.CODEC_SELECTION,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'packetizationRate',
        header: this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.FORM.PACKETIZATION_RATE,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 't38',
        header: this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.FORM.T_38,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'rfc2833',
        header: this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.FORM.RFC2833,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'comfortNoise',
        header: this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.FORM.COMFORT_NOISE, options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'bearerTypeDefault',
        header: this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.FORM.BEARER_TYPE_DEFAULT,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'networkDefault',
        header: this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.FORM.NETWORK_DEFAULT,
        options: {}, colsEnable: true, sort: true,
        type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: FieldName.Action,
        header: 'Action',
        colsEnable: true, sort: false, autoSetWidth: true
      }
    ];
  }

  initForm() {
    this.networkCodecProfileFormGroup = new FormGroup({
      name: new FormControl<string>('', Validators.required),
      packetizationRate: new FormControl<string | null>('10 ms'),
      t38: new FormControl<string | null>('OFF'),
      rfc2833: new FormControl<boolean>(false),
      comfortNoise: new FormControl<boolean>(false),
      networkDefault: new FormControl<boolean>(false),
      codecSelectionOrder: new FormControl<IDataCodec[] | null>(null)
    });
  }

  initCodec() {
    this.availableCodecs = [
      { name: 'G.729' },
      { name: 'PCMA' },
      { name: 'PCMU' },
      { name: 'G.726-32' },
      { name: 'G.723-1' },
      { name: 'EVRC' },
      { name: 'EVRC0' },
      { name: 'AAL2-G726-32' },
      { name: 'BV16' },
      { name: 'AMR' },
      { name: 'G726-24' }
    ];
    this.codecSelectionOrder = [];
  }

  // Get Network Codec Profile
  getNtwkCodecProfile() {
    this.isLoading = true;
    this.networkConfigurationService
      .getNtwkCodecProfile()
      .pipe(
        map((res: INetworkCodecProfile) => {
          const convertedData = res.ncpList.map((resData: INcpListData) => ({
            name: resData.name,
            bearerPath: mapBearerPathToName[resData.bearerPath.__value],
            codecSelection: [
              mapCodecSelectionToName[resData.preferredCodec.__value],
              mapCodecSelectionToName[resData.defaultCodec.__value],
              mapCodecSelectionToName[resData.alternativeCodec.__value]
            ]
              .filter(value => value !== '<none>')
              .join(','),
            packetizationRate: mapPacketizationRateToName[resData.packetizationRate.__value],
            t38: mapT38ToName[resData.t38.__value],
            rfc2833: mapRfc2833andComfortNoiseToName[resData.rfc2833.__value],
            comfortNoise: mapRfc2833andComfortNoiseToName[resData.comfortNoise.__value],
            bearerTypeDefault: mapBearerTypeDefaultandNetworkDefaultToName[resData.bearerTypeDefault.__value],
            networkDefault: mapBearerTypeDefaultandNetworkDefaultToName[resData.networkDefault.__value]
          }));
          return convertedData;
        })
      )
      .subscribe({
        next: (res: INtwkCodecProfileTableData[]) => {
          this.isLoading = false;
          this.data = res;
        },
        error: (error) => {
          this.isLoading = false;
          this.commonService.showAPIError(error);
        }
      });
  }

  refreshTable() {
    this.getNtwkCodecProfile();
  }

  // Add Network Codec Profile
  addNtwkCodecProfile(data: INtwkCodecProfileRequestData) {
    const isNameExists = this.data.some(obj => obj.name.toLowerCase() === data.name.toLowerCase());
    if (isNameExists) {
      this.showCodecNameExistsErrorDialog = true;
      this.alreadyExistsMessage =
        this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.ADD.NAME_EXISTS_ERROR.MESSAGE.replace('/{{codecName}}/', data.name);
    } else {
      this.isLoading = true;
      this.networkConfigurationService.addNwkCodecProfile(data).subscribe({
        next: () => {
          this.isLoading = false;
          this.closeAddNwkCodecProfile();
          this.refreshTable();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorData = error?.error || error;
          const messageAndDetails = JSON.stringify(this.errorData?.message);
          const parsedData = messageAndDetails?.split('details = ');
          this.detailsText = parsedData[0]?.split('"message = ')[1]?.replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' );
          this.messageText = this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.ADD.ADD_ERROR_MESSAGE;
          this.showAddErrorDialog = true;
        }
      });
    }
  }

  closeCodecNameExistsErrorDialog() {
    this.showCodecNameExistsErrorDialog = false;
    this.alreadyExistsMessage = '';
  }

  addNewNwkCodecProfileBtn() {
    this.networkCodecProfileFormGroup.markAsPristine();
    this.showAddNwkCodecProfile = true;
  }

  closeAddNwkCodecProfile() {
    this.showAddNwkCodecProfile = false;
    this.networkCodecProfileFormGroup.setValue({
      name: '',
      packetizationRate: '10 ms',
      t38: 'OFF',
      rfc2833: false,
      comfortNoise: false,
      networkDefault: false,
      codecSelectionOrder: null
    });
    this.initCodec();
  }

  addNetworkCodecProfileFormFooterHandler(event: any) {
    if (event) {
      if (
        this.networkCodecProfileFormGroup.controls['codecSelectionOrder']?.value
          ?.length > 3 ||
        !this.checkPCMAorPCMUavailable()
      ) {
        this.showInfoAboutInvalidCodec = true;
      } else {
        const data: INtwkCodecProfileRequestData = this.setDataForRequest();
        this.addNtwkCodecProfile(data);
      }
    } else {
      if(this.networkCodecProfileFormGroup.dirty) {
        this.showInfoAboutCancelOptionDialog = true;
      } else {
        this.closeAddNwkCodecProfile();
      }
    }
  }

  closeAddErrorDialog() {
    this.showAddErrorDialog = false;
    this.showDetailsBtn = true;
    this.closeAddNwkCodecProfile();
  }

  closeCancelOptionDialog() {
    this.showInfoAboutCancelOptionDialog = false;
  }

  closeInfoAboutCancelOptionDialog(event: any) {
    if (event) {
      this.closeAddNwkCodecProfile();
      this.closeCancelOptionDialog();
      this.showEditNwkCodecProfile = false;
    } else {
      this.closeCancelOptionDialog();
    }
  }

  closeInfoAboutInvalidCodec() {
    this.showInfoAboutInvalidCodec = false;
  }

  // Delete Network Codec Profile
  deleteNtwkCodecProfile(profileName: string) {
    this.isLoading = true;
    this.networkConfigurationService.deleteNwkCodecProfile(profileName).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeDeleteNtwkCodecProfile();
        this.refreshTable();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorData = error?.error || error;
        const messageAndDetails = JSON.stringify(this.errorData?.message);
        const parsedData = messageAndDetails.split('details = ');
        this.detailsText = parsedData[0].split('"message = ')[1].replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' );
        this.messageText = this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.DELETE.DELETE_ERROR_MESSAGE;
        this.showDeleteErrorDialog = true;
      }
    });
  }

  closeDeleteNtwkCodecProfile() {
    this.showDeleteConfirmPopup = false;
  }

  deleteNtwkCodecProfileFooterHandler(event: any) {
    event ?
      this.deleteNtwkCodecProfile(this.deleteSelectedDataWithName) :
      this.closeDeleteNtwkCodecProfile();
  }

  showOrHideButtonClick() {
    this.showDetailsBtn = !this.showDetailsBtn;
  }

  closeDeleteErrorDialog() {
    this.showDeleteErrorDialog = false;
    this.showDetailsBtn = true;
    this.closeDeleteNtwkCodecProfile();
  }

  // Edit Network Codec Profile
  editNtwkCodecProfile(data: INtwkCodecProfileRequestData) {
    this.isLoading = true;
    this.networkConfigurationService.editNwkCodecProfile(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeEditNwkCodecProfile();
        this.refreshTable();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorData = error?.error || error;
        const messageAndDetails = JSON.stringify(this.errorData?.message);
        const parsedData = messageAndDetails.split('details = ');
        this.detailsText = parsedData[0].split('"message = ')[1].replace(this.reg, '<br>').replace(this.tabReg, ' &emsp;' );
        this.messageText = this.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.EDIT.EDIT_ERROR_MESSAGE;
        this.showEditErrorDialog = true;
      }
    });
  }

  closeEditNwkCodecProfile() {
    this.showEditNwkCodecProfile = false;
    this.networkCodecProfileFormGroup.setValue({
      name: '',
      packetizationRate: '10 ms',
      t38: 'OFF',
      rfc2833: false,
      comfortNoise: false,
      networkDefault: false,
      codecSelectionOrder: null
    });
    this.initCodec();
  }

  closeEditErrorDialog() {
    this.showEditErrorDialog = false;
    this.showDetailsBtn = true;
  }

  editNetworkCodecProfileFormFooterHandler(event: any) {
    if (event) {
      if (
        this.networkCodecProfileFormGroup.controls['codecSelectionOrder']?.value
          ?.length > 3 || !this.checkPCMAorPCMUavailable()
      ) {
        this.showInfoAboutInvalidCodec = true;
      } else {
        const data: INtwkCodecProfileRequestData = this.setDataForRequest();
        this.editNtwkCodecProfile(data);
      }
    } else {
      if(this.networkCodecProfileFormGroup.dirty) {
        this.showInfoAboutCancelOptionDialog = true;
      } else {
        this.closeEditNwkCodecProfile();
      }
    }
  }

  // other helper functions
  checkPCMAorPCMUavailable() {
    const selectedCodecList: IDataCodec[] =
      this.networkCodecProfileFormGroup.controls['codecSelectionOrder']?.value;
    return selectedCodecList.some(
      (item) => item.name === 'PCMA' || item.name === 'PCMU'
    );
  }

  setDropDownItems() {
    const packetizationRateData = ['10 ms', '20 ms', '30 ms', '40 ms'];
    this.packetizationRateDataItems = this.mapDataForDropDown( packetizationRateData, 'packetizationRate');
    const t38Data = ['OFF', 'ON (Strict)', 'LOOSE'];
    this.t38DataItems = this.mapDataForDropDown( t38Data, 't38');
  }

  mapDataForDropDown(data: string[], formName: string) {
    const dropdownDataItems = data.map((item: string) => ({ label: item,value: item }));

    if (dropdownDataItems.length > 0) {
      this.networkCodecProfileFormGroup.controls[`${formName}`].setValue(dropdownDataItems[0].value);
    }
    return dropdownDataItems;
  }

  onChangeTargetData() {
    this.networkCodecProfileFormGroup.patchValue({ codecSelectionOrder: this.codecSelectionOrder });
    this.networkCodecProfileFormGroup.markAsDirty();
    this.networkCodecProfileFormGroup.updateValueAndValidity();
  }

  checkIsAtLeastOneAvailableCodec() {
    return this.networkCodecProfileFormGroup.controls['codecSelectionOrder'].value.length > 0
      ? this.codecList.some((item) => item.name === this.networkCodecProfileFormGroup.controls['codecSelectionOrder'].value[0]?.name)
      : false;
  }

  setDataForRequest() {
    return {
      name: this.networkCodecProfileFormGroup.controls['name'].value,
      bearerPath: 1,
      bearerTypeDefault: 1,
      packetizationRate: mapPacketizationRateToNumber[this.networkCodecProfileFormGroup.controls['packetizationRate']?.value],
      t38: mapT38ToNumber[this.networkCodecProfileFormGroup.controls['t38']?.value],
      rfc2833: this.networkCodecProfileFormGroup.controls['rfc2833']?.value ? 1: 0,
      comfortNoise: this.networkCodecProfileFormGroup.controls['comfortNoise']?.value ? 1: 0,
      networkDefault: this.networkCodecProfileFormGroup.controls['networkDefault']?.value ? 1: 0,
      // Since we do not show <none> value in the UI, so we set its value to undefined. I added '|| <none>' to handle this situation.
      preferredCodec:
        mapCodecSelectionToNumber[this.networkCodecProfileFormGroup.controls['codecSelectionOrder']?.value[0]?.name  || '<none>'],
      defaultCodec:
        mapCodecSelectionToNumber[this.networkCodecProfileFormGroup.controls['codecSelectionOrder']?.value[1]?.name || '<none>'],
      alternativeCodec:
        mapCodecSelectionToNumber[this.networkCodecProfileFormGroup.controls['codecSelectionOrder']?.value[2]?.name || '<none>']
    };
  }
}
