import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SelectItem } from 'primeng/api';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import {
  CMaintenanceByTrunkClliOptionsData,
  ECommandKey,
  ERunType,
  ETabIndex,
  IMaintenance,
  IRunType
} from '../../models/maint-trunk-clli';
import { StorageService } from 'src/app/services/storage.service';
import { MaintGatewaysCarrierService } from 'src/app/modules/maint-gateways-carrier/services/maint-gateways-carrier.service';
import { CommonService } from 'src/app/services/common.service';
import { MaintTrunkClliService } from '../../services/maint-trunk-clli.service';
import { IDataConfirm } from 'src/app/modules/maint-gateways-carrier/models/maint-gateways-carrier';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { PreferencesService } from 'src/app/services/preferences.service';
import {
  FieldName,
  Icols,
  FilterTypes
} from 'rbn-common-lib';

@Component({
  selector: 'app-general-trunk-maint',
  templateUrl: './general-trunk-maint.component.html',
  styleUrls: ['./general-trunk-maint.component.scss']
})
export class GeneralTrunkMaintComponent implements OnInit, OnDestroy {
  translateResults: any;
  formGroup: FormGroup;
  @Input() trunkClliName!: string;
  @Output() showTableEvent = new EventEmitter<boolean>();
  destroySubject = new Subject();
  storeDataSubmitForTable: any[] = [];

  dropDownDataMaintenanceActionItems: SelectItem[];
  currentActionItem = '';
  isInprocess = false;
  showConfirmActions = false;
  dataConfirm: IDataConfirm = { title: '', content: '' };
  autoRefreshSubscription: Subscription;
  colsGeneralTrunkMaint: Icols[] = [];

  get getFormFieldMaintenanceAction() {
    return this.formGroup.get('maintenanceAction');
  }

  get getFormFieldTrunkRange() {
    return this.formGroup.get('trunkRange');
  }

  get getFormFieldEndpointRange() {
    return this.formGroup.controls['trunkRange'];
  }

  get showDetails() {
    return this.formGroup.get('showDetails');
  }

  constructor(
    private translateService: TranslateInternalService,
    private storageService: StorageService,
    private maintTrunkService: MaintGatewaysCarrierService,
    private maintTrunkClliService: MaintTrunkClliService,
    private commonService: CommonService,
    private preferencesService: PreferencesService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initForm();
    this.initMaintenanceOptions();
    this.initCols();
    this.formGroup.controls['trunkRange'].setValue('0-');
    this.currentActionItem = ECommandKey.PostByTrunkCLLI;
    this.formGroup.get('maintenanceAction')?.valueChanges.subscribe((selectedMaintenance) => {
      this.currentActionItem = selectedMaintenance;
    });
    this.maintTrunkClliService.refreshTable$.pipe(takeUntil(this.destroySubject)).subscribe(tabIndex => {
      if (tabIndex === ETabIndex.GeneralTrunkMaintenance) {
        this.getDetailsTable(this.storeDataSubmitForTable, `UserID=${this.storageService.userID}`, ERunType.TABLE);
      }
    });
    this.formGroup.valueChanges.subscribe({
      next: () => {
        this.removeRefresh();
      }
    });
  }

  initMaintenanceOptions() {
    this.dropDownDataMaintenanceActionItems = [
      {
        label: CMaintenanceByTrunkClliOptionsData.POST_BY_TRUNKS.label,
        value: CMaintenanceByTrunkClliOptionsData.POST_BY_TRUNKS.value
      },
      {
        label: CMaintenanceByTrunkClliOptionsData.BSY_BY_TRUNKS.label,
        value: CMaintenanceByTrunkClliOptionsData.BSY_BY_TRUNKS.value
      },
      {
        label: CMaintenanceByTrunkClliOptionsData.RTS_BY_TRUNKS.label,
        value: CMaintenanceByTrunkClliOptionsData.RTS_BY_TRUNKS.value
      },
      {
        label: CMaintenanceByTrunkClliOptionsData.FRLS_BY_TRUNKS.label,
        value: CMaintenanceByTrunkClliOptionsData.FRLS_BY_TRUNKS.value
      },
      {
        label: CMaintenanceByTrunkClliOptionsData.INB_BY_TRUNKS.label,
        value: CMaintenanceByTrunkClliOptionsData.INB_BY_TRUNKS.value
      }
    ];
    this.formGroup.controls['maintenanceAction'].setValue(
      this.dropDownDataMaintenanceActionItems[0].value
    );
  }

  initForm() {
    this.formGroup = new FormGroup({
      trunkRange: new FormControl<string | null>(null, [Validators.required, Validators.pattern(/^\d+(-\d*)?(,\d+(-\d*)?)*$/)]),
      maintenanceAction: new FormControl<string | null>(
        null,
        Validators.required
      ),
      showDetails: new FormControl<boolean>(false)
    });
  }

  handleCancel() {
    this.formGroup.reset();
  }

  handleRun() {
    let securityInfoParam = '';
    const dataSubmit: any[] = [];
    const currentTrunkRangeValue = this.formGroup.get('trunkRange')?.value;
    dataSubmit.push(
      {
        key: 'TrunkClli',
        value: this.trunkClliName
      },
      {
        key: 'TrunkMembers',
        value: currentTrunkRangeValue
      }
    );
    this.storeDataSubmitForTable = dataSubmit;
    this.isInprocess = true;
    securityInfoParam = `UserID=${this.storageService.userID}`;
    const key = this.currentActionItem;
    this.showDetail(false);
    this.maintTrunkService
      .genericCommandToPerformMaintenanceOrQuerying(
        key,
        dataSubmit,
        securityInfoParam
      )
      .subscribe({
        next: (rs: IMaintenance) => {
          this.isInprocess = false;
          this.maintTrunkClliService.summaryDetails.next(rs[key].Header);
          if (rs[key].Error) {
            this.commonService.showErrorMessage(rs[key].Error?.Message ?? '');
            return;
          }
          if (this.showDetails?.value) {
            this.showDetail(true);
            this.getDetailsTable(dataSubmit, securityInfoParam);
          }
        },
        error: (err) => {
          this.isInprocess = false;
          this.commonService.showAPIError(err);
          this.maintTrunkClliService.resetSummaryAndTable();
        }
      });
  }

  initCols() {
    this.colsGeneralTrunkMaint = [
      {
        field: FieldName.Checkbox,
        header: '',
        data: [],
        colsEnable: true
      },
      {
        field: 'TrunkMember',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['TrunkMember'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'TerminalNumber',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['TerminalNumber'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'TrunkDirection',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['TrunkDirection'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'TrunkSignaling',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['TrunkSignaling'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'EndpointName',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['EndpointName'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'State',
        header: this.translateResults.MAI_GATE_WAYS_CARRIER.HEADER.COLUMNS.STATE,
        sort: true,
        data: [],
        colsEnable: true,
        colWidth: 150,
        type: FilterTypes.InputText
      },
      {
        field: 'ConnectedTo',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['ConnectedTo'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'PMTimeSlot',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['PMTimeSlot'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'PMCarrier',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['PMCarrier'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'GatewayName',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['GatewayName'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'PMNumber',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['PMNumber'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'NodeNumber',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['NodeNumber'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: 'PMType',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['PMType'],
        data: [],
        colsEnable: true,
        type: FilterTypes.InputText,
        sort: true
      },
      {
        field: FieldName.Action,
        header: this.translateResults.COMMON.ACTION,
        colsEnable: true,
        colWidth: 30
      }
    ];
  }

  getDetailsTable(dataBody: any, sSecurityInfo: string, runType: IRunType = ERunType.QUERIES) {
    if (runType !== ERunType.AUTO) {
      this.isInprocess = true;
    }
    const key = this.dropDownDataMaintenanceActionItems[0].value;
    this.maintTrunkService
      .genericCommandToPerformMaintenanceOrQuerying(
        key,
        dataBody,
        sSecurityInfo
      )
      .subscribe({
        next: (rs: IMaintenance) => {
          if (runType !== ERunType.AUTO) {
            this.isInprocess = false;
          }
          this.maintTrunkClliService.handleTableData(rs[key]?.Members?.Member, runType, this.colsGeneralTrunkMaint);
          this.setAutoRefresh();
        },
        error: (err) => {
          if (runType !== ERunType.AUTO) {
            this.isInprocess = false;
          }
          this.commonService.showAPIError(err);
          this.maintTrunkClliService.resetSummaryAndTable();
        }
      });
  }

  setAutoRefresh() {
    this.removeRefresh();
    this.autoRefreshSubscription = this.preferencesService.autoRefreshEmit.subscribe(() => {
      this.getDetailsTable(this.storeDataSubmitForTable, `UserID=${this.storageService.userID}`, ERunType.AUTO);
    });
  }

  removeRefresh() {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
  }

  showDetail(value: boolean) {
    this.showTableEvent.emit(value);
  }

  onFormSubmit(event: boolean) {
    if (event) {
      this.checkValidation();
    } else {
      this.handleCancel();
    }
  }

  checkValidation() {
    if (this.formGroup.invalid) {
      if (this.getFormFieldTrunkRange?.hasError('required')) {
        this.commonService.showErrorMessage(
          this.translateResults.TRUNK_CLLI.ERROR_MESSAGES.TRUNKRANGE_REQUIRED
        );
      } else if (this.getFormFieldTrunkRange?.invalid) {
        this.commonService.showErrorMessage(this.translateResults.TRUNK_CLLI.ERROR_MESSAGES.TRUNKRANGE_INVALID);
      } else if (this.getFormFieldEndpointRange.invalid) {
        this.commonService.showErrorMessage(this.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.ENDPOINTRANGE_REQUIRED);
      }
      return;
    }
    const preferences = sessionStorage.getItem('tmm_preferences');

    if (preferences) {
      const preferencesParse = JSON.parse(preferences);
      if (preferencesParse.confirmation.checked) {
        this.showConfirmActions = true;
        this.dataConfirm.title =
          this.translateResults.TRUNK_CLLI.CONFIRMATION_ACTIONS.TITLE;
        const actionCurrent = this.getLabelForm(
          this.dropDownDataMaintenanceActionItems,
          this.getFormFieldMaintenanceAction?.value
        );
        this.dataConfirm.content =
          this.translateResults.TRUNK_CLLI.CONFIRMATION_ACTIONS.CONTENT_ALL_TRUNK.replace(
            '{{action}}',
            actionCurrent
          );
        this.translateResults.TRUNK_CLLI.CONFIRMATION_ACTIONS.CONTENT_ALL_TRUNK.replace(
          '{{action}}',
          actionCurrent
        );
        return;
      }
    }
    this.handleRun();
  }

  changeMaintenanceAction(command: ECommandKey) {
    if (command === ECommandKey.FRLSByTrunkCLLI) {
      this.getFormFieldEndpointRange.setValidators([Validators.required, Validators.pattern(/^\d+(,\d+)*$/)]);
    } else {
      this.getFormFieldEndpointRange.setValidators([Validators.required, Validators.pattern(/^\d+(-\d*)?(,\d+(-\d*)?)*$/)]);
    }
    this.getFormFieldEndpointRange.updateValueAndValidity();
  }

  handleConfirmAction(e: boolean) {
    if (e) {
      this.handleRun();
      this.showConfirmActions = false;
    } else {
      this.showConfirmActions = false;
    }
  }

  getLabelForm(options: SelectItem[], value: string) {
    const item = options.find((n) => n.value === value);
    if (item && item.label) {
      return item.label;
    } else {
      return '';
    }
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.removeRefresh();
  }
}
