import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ItemDropdown } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaintTrunkClliService } from '../../services/maint-trunk-clli.service';
import { MaintGatewaysCarrierService } from 'src/app/modules/maint-gateways-carrier/services/maint-gateways-carrier.service';
import { StorageService } from 'src/app/services/storage.service';
import { ITrunkMtcResourceInterface } from 'src/app/shared/models/trunk-mtc-resource-interface';
import { CommonService } from 'src/app/services/common.service';
import { ECommandKey } from 'src/app/modules/maint-gateways-carrier/models/maint-gateways-carrier';
import { ERunType, ETabIndex, IMaintenance, IRunType } from '../../models/maint-trunk-clli';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { PreferencesService } from 'src/app/services/preferences.service';
import {
  FieldName,
  Icols,
  FilterTypes
} from 'rbn-common-lib';
@Component({
  selector: 'app-d-channel-maint',
  templateUrl: './d-channel-maint.component.html',
  styleUrls: ['./d-channel-maint.component.scss']
})
export class DChannelMaintComponent implements OnInit, OnDestroy {
  dropDownDataMaintenanceActionItems: ItemDropdown[];
  translateResults: any;
  formGroup: FormGroup;
  isInprocess = false;
  destroySubject = new Subject();
  colsDchannel: Icols[] = [];

  @Input() trunkClliName!: string;
  @Output() showTableEvent = new EventEmitter<boolean>();
  autoRefreshSubscription: Subscription;

  get maintenanceAction() {
    return this.formGroup.get('maintenanceAction');
  }

  get showDetails() {
    return this.formGroup.get('showDetails');
  }

  constructor(
    private translateService: TranslateInternalService,
    private storageService: StorageService,
    private maintTrunkClliService: MaintTrunkClliService,
    private maintGatewaysCarrierService: MaintGatewaysCarrierService,
    private commonService: CommonService,
    private preferencesService: PreferencesService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initDropDownBox();
    this.initForm();
    this.initCols();
    this.maintTrunkClliService.refreshTable$.pipe(takeUntil(this.destroySubject)).subscribe(tabIndex => {
      if (tabIndex === ETabIndex.DChannelMaintenance) {
        this.handleRun(ERunType.TABLE);
      }
    });
    this.formGroup.valueChanges.subscribe({
      next: () => {
        this.removeRefresh();
      }
    });
  }

  initForm() {
    this.formGroup = new FormGroup({
      maintenanceAction: new FormControl<string | null>(
        ECommandKey.PostGroupDChannelByTrunkCLLI,
        Validators.required
      ),
      showDetails: new FormControl<boolean>(false)
    });
  }

  initDropDownBox() {
    this.dropDownDataMaintenanceActionItems = [
      {
        value: ECommandKey.PostGroupDChannelByTrunkCLLI,
        label: this.translateResults.TRUNK_CLLI.POST_GROUP_D_CHANNEL
      }
    ];
  }

  handleCancel() {
    this.formGroup.reset();
  }

  initCols() {
    this.colsDchannel = [
      {
        field: FieldName.Checkbox,
        header: '',
        data: [],
        colsEnable: true
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
        field: 'TerminalNumber',
        header:
          this.translateResults.TRUNK_CLLI.HEADER.COLUMNS['TerminalNumber'],
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

  handleRun(runType: IRunType = ERunType.QUERIES) {
    const body: ITrunkMtcResourceInterface[] = [
      { key: ECommandKey.TrunkCLLI, value: this.trunkClliName }
    ];
    const sSecurityInfo = `UserID=${this.storageService.userID}`;
    if (runType !== ERunType.AUTO) {
      this.isInprocess = true;
      this.showDetail(false);
    }
    this.maintGatewaysCarrierService
      .genericCommandToPerformMaintenanceOrQuerying(
        this.maintenanceAction?.value,
        body,
        sSecurityInfo
      )
      .subscribe({
        next: (rs: IMaintenance) => {
          if (runType !== ERunType.AUTO) {
            this.isInprocess = false;
          }
          this.maintTrunkClliService.summaryDetails.next(
            rs[ECommandKey.PostGroupDChannelByTrunkCLLI].Header
          );
          if (this.showDetails?.value) {
            if (runType !== ERunType.AUTO) {
              this.showDetail(true);
            }
            this.maintTrunkClliService.handleTableData(
              rs[ECommandKey.PostGroupDChannelByTrunkCLLI].Members?.Member,
              runType,
              this.colsDchannel
            );
            this.setAutoRefresh();
          }
        },
        error: (err: any) => {
          this.isInprocess = false;
          this.commonService.showAPIError(err);
          this.maintTrunkClliService.resetSummaryAndTable();
        }
      });
  }

  showDetail(value: boolean) {
    this.showTableEvent.emit(value);
  }

  onFormSubmit(event: boolean) {
    event ? this.handleRun() : this.handleCancel();
  }

  setAutoRefresh() {
    this.removeRefresh();
    this.autoRefreshSubscription = this.preferencesService.autoRefreshEmit.subscribe(() => {
      this.handleRun(ERunType.AUTO);
    });
  }

  removeRefresh() {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.removeRefresh();
  }
}
