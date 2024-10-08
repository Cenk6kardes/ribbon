import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { of, throwError } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

import { AppModule } from 'src/app/app.module';
import { MaintTrunkClliComponent } from './maint-trunk-clli.component';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { MaintGatewaysCarrierService } from 'src/app/modules/maint-gateways-carrier/services/maint-gateways-carrier.service';

describe('MaintTrunkClliComponent', () => {
  let component: MaintTrunkClliComponent;
  let fixture: ComponentFixture<MaintTrunkClliComponent>;
  const translate = {
    translateResults: {
      TRUNK_CLLI: {
        TITLE: 'Maintenance by Trunk CLLI',
        GATEWAY_NAME: 'Gateway Name',
        TRUNK_CLLI: 'Trunk CLLI',
        GENERAL_TRUNK_MAINTANENCE: 'General Trunk Maintenance',
        D_CHANNEL_MAINTANENCE: 'D-Channel Maintenance',
        ISUP_COT_TEST: 'ISUP COT Test',
        TRUNK_RANGE: 'Trunk Range',
        MAINTANENCE_ACTION: 'Maintenance Action',
        TRUNK_MEMBER: 'Trunk Member',
        ANOTHER_SELECT_ITEM_IF_NEED: 'Another Select Item If Need'
      },
      COMMON: {
        RUN: 'Run',
        CANCEL: 'Cancel',
        ERROR: 'Error',
        SHOW_DETAILS: 'Show Details',
        SELECT: 'select',
        RUN_TEST: 'Run Test'
      }
    }
  };

  const gatewayNames = {
    GetGatewayNames: {
      Gateway: {
        Names:
          'CO39G9PRI,labpbxco39,NETG9VMG36,NETG9VMG38,NETG9VMG39,testrnk3,testtrnk3'
      }
    }
  };

  const trunkClliData = {
    GetTrunkCllisByGatewayName: {
      TrunkClli: ['MARSPRA250U', 'MARSPRA250N']
    }
  };

  const maintGatewaysCarrierService = jasmine.createSpyObj(
    'MaintGatewaysCarrierService',
    ['genericCommandToPerformMaintenanceOrQuerying']
  );

  const commonService = jasmine.createSpyObj('CommonService', ['showAPIError']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintTrunkClliComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: CommonService, useValue: commonService },
        {
          provide: MaintGatewaysCarrierService,
          useValue: maintGatewaysCarrierService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MaintTrunkClliComponent);
    component = fixture.componentInstance;

    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying
      .withArgs('GetGatewayNames')
      .and.returnValue(of(gatewayNames));

    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying
      .withArgs(
        'GetTrunkCllisByGatewayName',
        jasmine.objectContaining({ key: 'GatewayName', value: 'CO39G9PRI' })
      )
      .and.returnValue(of(trunkClliData));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties and subscribe to value changes', () => {
    const selectedGateway = 'CO39G9PRI';
    const selectedTrunkClli = 'MARSPRA250U';
    spyOn(component, 'initPageHeader');
    spyOn(component, 'initForm');
    spyOn(component, 'getGatewayNames');
    spyOn(component, 'GetTrunkCllisByGatewayName');
    component.formGroup.get('gatewayName')?.setValue(selectedGateway);
    component.formGroup.get('trunkCLLI')?.setValue(selectedTrunkClli);

    component.ngOnInit();

    expect(component.initPageHeader).toHaveBeenCalled();
    expect(component.headerData.title).toBe(
      translate.translateResults.TRUNK_CLLI.TITLE
    );
    expect(component.initForm).toHaveBeenCalled();
    expect(component.getGatewayNames).toHaveBeenCalled();
    expect(component.formGroup.controls['gatewayName'].value).toEqual(
      selectedGateway
    );
    expect(component.GetTrunkCllisByGatewayName).toHaveBeenCalledWith(
      selectedGateway
    );
    expect(component.formGroup.controls['trunkCLLI'].value).toEqual(
      selectedTrunkClli
    );
    expect(component.currentTrunkClliName).toEqual(selectedTrunkClli);
  });

  it('should call genericCommandToPerformMaintenanceOrQuerying error', () => {
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying
      .withArgs('GetGatewayNames')
      .and.returnValue(throwError('error'));

    const keyForGateway = 'GetGatewayNames';

    component.getGatewayNames();
    expect(
      maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying
    ).toHaveBeenCalledWith(keyForGateway);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should populate dropdownDataTrunkCLLIItems and set isLoading when TrunkClli data is available', () => {
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(
      of({
        GetTrunkCllisByGatewayName: {
          TrunkClli: ['MARSPRA250U', 'MARSPRA250N']
        }
      })
    );
    const selectedGatewayName = 'CO39G9PRI';
    const keyForTrunk = 'GetTrunkCllisByGatewayName';

    component.GetTrunkCllisByGatewayName(selectedGatewayName);

    expect(component.dropdownDataTrunkCLLIItems).toEqual([
      { label: 'MARSPRA250U', value: 'MARSPRA250U' },
      { label: 'MARSPRA250N', value: 'MARSPRA250N' }
    ]);
    expect(component.isLoading).toBe(false);
    expect(component.formGroup.controls['trunkCLLI'].value).toBe('MARSPRA250U');
    expect(
      maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying
    ).toHaveBeenCalledWith(keyForTrunk, [
      { key: 'GatewayName', value: selectedGatewayName }
    ]);
  });

  it('should clear dropdownDataTrunkCLLIItems and log error message when TrunkClli data is not available', () => {
    const consoleSpy = spyOn(console, 'log');
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(
      of({
        GetTrunkCllisByGatewayName: {
          Error: {
            Message: 'An error occurred'
          }
        }
      })
    );

    const selectedGatewayName = 'CO39G9PRI';
    component.GetTrunkCllisByGatewayName(selectedGatewayName);

    expect(component.dropdownDataTrunkCLLIItems).toEqual([]);
    expect(component.isLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('An error occurred');
  });

  it('should call genericCommandToPerformMaintenanceOrQuerying error for GetTrunkCllisByGatewayName()', () => {
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(
      throwError('error')
    );
    const dataSubmit: any[] = [];
    const keyForTrunk = 'GetTrunkCllisByGatewayName';
    const selectedGatewayName = 'CO39G9PRI';
    dataSubmit.push({
      key: 'GatewayName',
      value: selectedGatewayName
    });
    component.GetTrunkCllisByGatewayName(selectedGatewayName);
    expect(
      maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying
    ).toHaveBeenCalledWith(keyForTrunk, dataSubmit);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });
});
