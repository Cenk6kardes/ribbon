import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { of, throwError } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

import { IsupCotTestComponent } from './isup-cot-test.component';
import { AppModule } from 'src/app/app.module';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { MaintGatewaysCarrierService } from '../../../maint-gateways-carrier/services/maint-gateways-carrier.service';
import { StorageService } from 'src/app/services/storage.service';

describe('IsupCotTestComponent', () => {
  let component: IsupCotTestComponent;
  let fixture: ComponentFixture<IsupCotTestComponent>;
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
        ANOTHER_SELECT_ITEM_IF_NEED: 'Another Select Item If Need',
        HEADER: {
          CARRIER_NAMES: 'Carrier Names',
          SUMMARY: 'Summary',
          COLUMNS: {
            State: 'State',
            TrunkDirection: 'Direction',
            TrunkSignaling: 'Signaling',
            EndpointName: 'Endpoint',
            GatewayName: 'Gateway',
            PMNumber: 'PM #',
            NodeNumber: 'Node #',
            TerminalNumber: 'Terminal #',
            PMType: 'PM Type',
            TrunkMember: 'Trunk Member',
            AdditionalInfo: 'Additional Info',
            CallID: 'Call Id',
            ContinuityCondition: 'Continuity Condition',
            TestResult: 'Test Result',
            ConnectedTo: 'Connected to',
            PMCarrier: 'Pm Carrier',
            PMTimeSlot: 'Time Slot',
            Error: 'Error'
          }
        }
      },
      MAI_GATE_WAYS_CARRIER: {
        HEADER: {
          COLUMNS: {
            STATE: 'State'
          }
        }
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

  const errorResponseOfGenericCommandToPerformMaintenanceOrQuerying =
  {
    ICOTTest: {
      Header: {
        TrunkCLLI: 'G9ITISUPBA',
        CMCLLI: 'CO39',
        FirstMember: 450,
        TrunkMembers: 450,
        GroupSize: 450
      },
      Members: {
        Member: {
          TrunkMember: 450,
          Error: {
            Number: 137,
            Message: 'The trunk member is not data filled. Verify data fill in table TRKGRP/TRKSGRP/TRKMEM for C20.',
            Severity: 'MAJOR'
          }
        }
      }
    }
  };

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError', 'showErrorMessage']);

  const maintGatewaysCarrierService = jasmine.createSpyObj('maintGatewaysCarrierService', ['genericCommandToPerformMaintenanceOrQuerying']);

  const storageService = jasmine.createSpyObj('StorageService', ['userID']);


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsupCotTestComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: CommonService, useValue: commonService },
        { provide: MaintGatewaysCarrierService, useValue: maintGatewaysCarrierService },
        { provide: StorageService, useValue: storageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IsupCotTestComponent);
    component = fixture.componentInstance;
    const successResponseOfGenericCommandToPerformMaintenanceOrQuerying =
    {
      ICOTTest: {
        Header: {
          TrunkCLLI: 'G9ITISUPBA',
          CMCLLI: 'CO39',
          FirstMember: 0,
          TrunkMembers: 0,
          GroupSize: 0
        },
        Members: {
          Member: {
            AdditionalInfo: '',
            CallId: '',
            ContinutyCondition: '',
            TestResult: 'TEST_PASSED',
            TrunkMember: 0
          }
        }
      }
    };
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(of(
      successResponseOfGenericCommandToPerformMaintenanceOrQuerying
    ));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call runIsupCotTest and reset form if trunkClliName exists and formGroup is valid', () => {
    spyOn(component, 'runIsupCotTest');
    const validTrunkClliName = 'G9ITISUPBA';
    const validTrunkMemberValue = '450';

    component.formGroup.controls['trunkMember'].setValue(validTrunkMemberValue);
    component.trunkClliName = validTrunkClliName;

    component.handleRun();

    expect(component.runIsupCotTest).toHaveBeenCalledWith(validTrunkClliName, validTrunkMemberValue);
    expect(component.formGroup.value).toEqual({ trunkMember: null });
  });

  it('should show error message if trunkClliName does not exist', () => {
    (component.trunkClliName as any) = null;
    component.handleRun();
    expect(commonService.showErrorMessage).toHaveBeenCalledWith('Invalid Value for Trunk CLLI Field');
  });

  it('should show error message if formGroup is not valid', () => {
    component.formGroup.controls['trunkMember'].setValue('450,451');
    component.handleRun();
    expect(commonService.showErrorMessage).toHaveBeenCalledWith('450,451 is not a decimal');
  });

  it('should call handleCancel', () => {
    component.handleCancel();
    expect(component.formGroup.value).toEqual({ trunkMember: null });
  });

  it('should call genericCommandToPerformMaintenanceOrQuerying with correct parameters', () => {
    const trunkClliValue = 'G9ITISUPBA';
    const trunkMemberValue = '0';

    component.runIsupCotTest(trunkClliValue, trunkMemberValue);

    expect(maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying).toHaveBeenCalled();
  });

  it('should call genericCommandToPerformMaintenanceOrQuerying with wrong parameters', () => {
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(of(
      errorResponseOfGenericCommandToPerformMaintenanceOrQuerying
    ));

    const trunkClliValue = 'G9ITISUPBA';
    const trunkMemberValue = '450';

    component.runIsupCotTest(trunkClliValue, trunkMemberValue);

    expect(maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying).toHaveBeenCalled();
  });

  it('should call genericCommandToPerformMaintenanceOrQuerying error', () => {
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(throwError('error'));
    const trunkClliValue = 'G9ITISUPBA';
    const trunkMemberValue = '341';

    component.runIsupCotTest(trunkClliValue, trunkMemberValue);
    expect(maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });
});
