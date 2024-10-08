import { IPageHeader, ItemDropdown } from 'rbn-common-lib';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaintGatewaysCarrierService } from 'src/app/modules/maint-gateways-carrier/services/maint-gateways-carrier.service';
import { CommonService } from 'src/app/services/common.service';
import { ITrunkClliNames, TableNameStorage } from 'src/app/modules/maint-trunk-clli/models/maint-trunk-clli';
import {
  ECommandKey,
  IGatewayNames
} from 'src/app/modules/maint-gateways-carrier/models/maint-gateways-carrier';

import { MaintTrunkClliService } from '../../services/maint-trunk-clli.service';
import { ITrunkResponse } from '../../models/maint-trunk-clli';

@Component({
  selector: 'app-maint-trunk-clli',
  templateUrl: './maint-trunk-clli.component.html',
  styleUrls: ['./maint-trunk-clli.component.scss']
})
export class MaintTrunkClliComponent implements OnInit, OnDestroy {
  headerData: IPageHeader;
  dropDownDataGatewayNameItems: ItemDropdown[];
  dropdownDataTrunkCLLIItems: ItemDropdown[];
  translateResults: any;
  formGroup: FormGroup;
  currentTrunkClliName = '';
  isLoading = false;
  summaryDetails!: ITrunkResponse[];
  showTableSelected = true;
  isInprocess = false;
  tabIndex = 0;


  constructor(
    private translateService: TranslateInternalService,
    private maiGatewaysCarrierService: MaintGatewaysCarrierService,
    private commonService: CommonService,
    private maintTrunkClliService: MaintTrunkClliService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.removeStorageTable();
    this.initPageHeader();
    this.initForm();
    this.getGatewayNames();
    this.formGroup
      .get('gatewayName')
      ?.valueChanges.subscribe((selectedGateway) => {
        this.GetTrunkCllisByGatewayName(selectedGateway);
      });
    this.formGroup
      .get('trunkCLLI')
      ?.valueChanges.subscribe((selectedTrunkClli) => {
        this.currentTrunkClliName = selectedTrunkClli;
      });
  }

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.TRUNK_CLLI.TITLE
    };
  }

  initForm() {
    this.formGroup = new FormGroup({
      gatewayName: new FormControl<string | null>(null),
      trunkCLLI: new FormControl<string | null>({ value: null, disabled: true }, Validators.required)
    });
  }

  get gatewayName() {
    return this.formGroup.get('gatewayName') as FormGroup;
  }

  get trunkCLLI() {
    return this.formGroup.get('trunkCLLI') as FormGroup;
  }

  getGatewayNames() {
    const key = ECommandKey.GetGatewayNames;
    this.isInprocess = true;
    this.maiGatewaysCarrierService
      .genericCommandToPerformMaintenanceOrQuerying(key)
      .subscribe({
        next: (rs: IGatewayNames) => {
          this.isInprocess = false;
          if (rs[key]?.Gateway?.Names) {
            const names = rs[key].Gateway.Names;
            if (names) {
              const namesObject = names
                .split(',')
                .map((item: string) => ({ label: item, value: item }));
              this.dropDownDataGatewayNameItems = namesObject;
              this.formGroup.controls['trunkCLLI'].enable();
              if (this.dropDownDataGatewayNameItems.length > 0) {
                this.formGroup.controls['gatewayName'].setValue(
                  this.dropDownDataGatewayNameItems[0].value
                );
              }
            }
          }
        },
        error: (err) => {
          this.isInprocess = false;
          this.commonService.showAPIError(err);
        }
      });
  }

  GetTrunkCllisByGatewayName(selectedGateway: string) {
    const dataSubmit: any[] = [];
    const key = ECommandKey.GetTrunkCllisByGatewayName;
    this.dropdownDataTrunkCLLIItems = [];
    this.isLoading = true;
    dataSubmit.push({
      key: 'GatewayName',
      value: selectedGateway
    });
    this.isInprocess = true;
    this.maiGatewaysCarrierService
      .genericCommandToPerformMaintenanceOrQuerying(key, dataSubmit)
      .subscribe({
        next: (rs: ITrunkClliNames) => {
          this.isInprocess = false;
          if (rs[key]?.TrunkClli) {
            const trunkClliData = rs[key].TrunkClli;
            if (trunkClliData) {
              const convertedArray = Array.isArray(trunkClliData)
                ? trunkClliData.map((item) => ({ label: item, value: item }))
                : [{ label: trunkClliData, value: trunkClliData }];

              this.dropdownDataTrunkCLLIItems = convertedArray;
              this.isLoading = false;
              if (convertedArray.length > 0) {
                this.formGroup.controls['trunkCLLI'].setValue(
                  convertedArray[0].value
                );
              }
            }
          } else {
            console.log(rs[key].Error.Message);
            this.dropdownDataTrunkCLLIItems = [];
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.isInprocess = false;
          this.commonService.showAPIError(err);
        }
      });
  }

  tabChanged(event: any) {
    this.maintTrunkClliService.summaryDetails.next({});
    this.maintTrunkClliService.tableCols.next({ trunkResponse: [] });
    this.tabIndex = event?.index;
  }

  showTable(event: any) {
    this.showTableSelected = event;
  }

  ngOnDestroy(): void {
    this.removeStorageTable();
    this.maintTrunkClliService.summaryDetails.next({});
    this.maintTrunkClliService.tableCols.next({ trunkResponse: [] });
  }

  removeStorageTable() {
    const keyRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        if (
          key.includes('storage_' + TableNameStorage.generalTrunkMaintenanceTable) ||
          key.includes('storage_' + TableNameStorage.dChannelMaintenanceTable)
        ) {
          keyRemove.push(key);
        }
      }
    }
    for (let i = 0; i < keyRemove.length; i++) {
      sessionStorage.removeItem(keyRemove[i]);
    }
  }
}
