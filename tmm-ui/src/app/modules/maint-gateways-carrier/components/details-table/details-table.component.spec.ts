import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { DetailsTableComponent } from './details-table.component';
import { HttpLoaderFactory } from 'src/app/shared/http-loader-factory';
import { RbnCommonTableModule, PanelMessagesModule } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CMaintenanceByCarrierOptionsData } from '../../models/maint-gateways-carrier';

describe('DetailsTableComponent', () => {
  let component: DetailsTableComponent;
  let fixture: ComponentFixture<DetailsTableComponent>;
  const translate = {
    translateResults: {
      MAI_GATE_WAYS_CARRIER: {
        HEADER: {
          COLUMNS: {
            ENDPOINT_NUMBER: 'Endpoint Number',
            STATE: 'State'
          }
        },
        DETAILS_MESSAGE: 'Details Message'
      }
    }
  };
  const activatedRouteMock = {
    snapshot: { data: { data: { typeMaintenance: 'BY_CARRIER' } } }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsTableComponent],
      imports: [
        HttpClientModule,
        RbnCommonTableModule,
        PanelMessagesModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TranslateInternalService, useValue: translate }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsTableComponent);
    component = fixture.componentInstance;
    initBulkActionOptions();
    fixture.detectChanges();
  });

  function initBulkActionOptions() {
    component.bulkActionOptions = [
      {
        label: CMaintenanceByCarrierOptionsData.QES_BY_CARRIER.label,
        value: CMaintenanceByCarrierOptionsData.QES_BY_CARRIER.value
      },
      {
        label: CMaintenanceByCarrierOptionsData.POST_BY_CARRIER.label,
        value: CMaintenanceByCarrierOptionsData.POST_BY_CARRIER.value
      },
      {
        label: CMaintenanceByCarrierOptionsData.BSY_BY_CARRIER.label,
        value: CMaintenanceByCarrierOptionsData.BSY_BY_CARRIER.value
      },
      {
        label: CMaintenanceByCarrierOptionsData.RTS_BY_CARRIER.label,
        value: CMaintenanceByCarrierOptionsData.RTS_BY_CARRIER.value
      },
      {
        label: CMaintenanceByCarrierOptionsData.FRLS_BY_CARRIER.label,
        value: CMaintenanceByCarrierOptionsData.FRLS_BY_CARRIER.value
      },
      {
        label: CMaintenanceByCarrierOptionsData.INB_BY_CARRIER.label,
        value: CMaintenanceByCarrierOptionsData.INB_BY_CARRIER.value
      }
    ];
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cols when showDetailCols is false', () => {
    spyOn(component, 'initCols');
    component.showDetailCols = false;
    const changes = {
      showDetailCols: {
        previousValue: true,
        currentValue: false,
        isFirstChange: () => false,
        firstChange: false
      }
    };
    component.ngOnChanges(changes);
    expect(component.initCols).toHaveBeenCalled();
  });

  it('should initialize detail cols when showDetailCols is true', () => {
    spyOn(component, 'initDetailCols');
    component.showDetailCols = true;
    const changes = {
      showDetailCols: {
        previousValue: false,
        currentValue: true,
        firstChange: false,
        isFirstChange: () => false
      }
    };
    component.ngOnChanges(changes);
    expect(component.initDetailCols).toHaveBeenCalled();
  });

  it('should set tableConfig.tableName based on ActivatedRoute data', () => {
    expect(component.tableConfig.tableName).toBe('carrierTable');
  });

  it('should call the action with selected rows', () => {
    spyOn(component, 'clearSelectedOption');
    component.selectedAction = { value: 'delete' };
    component.selectedRows = [
      { TerminalNumber: 1 },
      { TerminalNumber: 2 }
    ];
    const emitSpy = spyOn(component.callActionTable, 'emit');
    component.callAction();
    expect(component.selectedRows.length).toBe(0);
    expect(component.clearSelectedOption).toHaveBeenCalled();
  });

  it('should handle checkbox change', () => {
    const event = {
      selectedRows: [{ TerminalNumber: 1 }, { TerminalNumber: 2 }]
    };
    component.onCheckboxChange(event);
    expect(component.selectedRows.length).toBe(2);
  });

  it('should clear the selected action', fakeAsync(
    () => {
      component.clearSelectedOption();
      tick(1000);
      expect(component.selectedAction).toBeNull();
    }
  ));

  it('should call handleClosePanelMessages', () => {
    component.handleClosePanelMessages();
    expect(component.detailsMsgData.showPanelMessages).toBeFalsy();
  });

  it('should call handleRefreshData', () => {
    spyOn(component.refreshTable, 'emit');
    component.handleRefreshData();
    expect(component.refreshTable.emit).toHaveBeenCalled();
  });

});
