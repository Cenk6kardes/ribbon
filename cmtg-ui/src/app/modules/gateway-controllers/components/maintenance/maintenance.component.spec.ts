import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MaintenanceComponent } from './maintenance.component';
import { Subject, Subscription, of, throwError } from 'rxjs';
import { GatewayControllersService } from '../../services/gateway-controllers.service';
import { CommonService } from 'src/app/services/common.service';
import { MaintenanceTriggerService } from '../../services/maintenance-trigger.service';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IStatusDataResponse } from '../../models/gwControllers';

describe('MaintenanceComponent', () => {
  let component: MaintenanceComponent;
  let fixture: ComponentFixture<MaintenanceComponent>;
  let refreshGwcSubscription: Subscription;

  const gwcServiceMock = jasmine.createSpyObj('gwcService', [
    'getUnitStatus',
    'getLoadNameVersion',
    'getGWCLoadName2',
    'getGWCNodesByFilter_v1',
    'getGWCNodeByName_v1',
    'getStatusData_e'
  ]);

  const getUnitStatusRes = {
    unit0ID: '10.254.166.18:161',
    unit0IPAddr: '10.254.166.18',
    unit0Port: 161,
    unit1ID: '10.254.166.19:161',
    unit1IPAddr: '10.254.166.19',
    unit1Port: 161
  };
  const getLoadNameVersionRes = 'RMS';
  const getGWCLoadName2Res = 'GL230AR';
  const getGWCNodesByFilterRes = {
    count: 1,
    nodeList: [
      {
        gwcId: 'GWC-0',
        callServer: {
          name: 'CO39',
          cmMsgIpAddress: ''
        },
        elementManager: {
          ipAddress: '10.254.166.150',
          trapPort: '3162'
        },
        serviceConfiguration: {
          gwcNodeNumber: 41,
          activeIpAddress: '10.254.166.16',
          inactiveIpAddress: '10.254.166.17',
          unit0IpAddress: '10.254.166.18',
          unit1IpAddress: '10.254.166.19',
          gwcProfileName: 'LINE_TRUNK_AUD_NA',
          capabilities: [
            {
              capability: {
                __value: 2
              },
              capacity: 4094
            },
            {
              capability: {
                __value: 18
              },
              capacity: 0
            },
            {
              capability: {
                __value: 9
              },
              capacity: 16
            },
            {
              capability: {
                __value: 8
              },
              capacity: 300
            },
            {
              capability: {
                __value: 14
              },
              capacity: 0
            },
            {
              capability: {
                __value: 22
              },
              capacity: 1
            },
            {
              capability: {
                __value: 23
              },
              capacity: 0
            },
            {
              capability: {
                __value: 16
              },
              capacity: 0
            },
            {
              capability: {
                __value: 15
              },
              capacity: 0
            },
            {
              capability: {
                __value: 7
              },
              capacity: 6400
            },
            {
              capability: {
                __value: 3
              },
              capacity: 4096
            },
            {
              capability: {
                __value: 6
              },
              capacity: 20
            },
            {
              capability: {
                __value: 19
              },
              capacity: 0
            },
            {
              capability: {
                __value: 1
              },
              capacity: 6400
            }
          ],
          bearerNetworkInstance: 'NET 2',
          bearerFabricType: 'IP',
          codecProfileName: 'default',
          execDataList: [
            {
              name: 'DPLEX',
              termtype: 'DPL_TERM'
            },
            {
              name: 'DTCEX',
              termtype: 'PRAB'
            },
            {
              name: 'GWCEX',
              termtype: 'ABTRK'
            },
            {
              name: 'POTSEX',
              termtype: 'POTS'
            },
            {
              name: 'KSETEX',
              termtype: 'KEYSET'
            }
          ],
          defaultGwDomainName: ''
        },
        deviceList: []
      }
    ]
  };
  const getGWCNodeByName_v1Res = {
    gwcId: 'GWC-1',
    callServer: {
      name: 'CO39',
      cmMsgIpAddress: ''
    },
    elementManager: {
      ipAddress: '10.254.166.150',
      trapPort: '3162'
    },
    serviceConfiguration: {
      gwcNodeNumber: 7,
      activeIpAddress: '10.254.166.20',
      inactiveIpAddress: '10.254.166.21',
      unit0IpAddress: '10.254.166.22',
      unit1IpAddress: '10.254.166.23',
      gwcProfileName: 'SMALL_LINENA_V2',
      capabilities: [
        {
          capability: {
            __value: 1
          },
          capacity: 25600
        },
        {
          capability: {
            __value: 16
          },
          capacity: 0
        },
        {
          capability: {
            __value: 7
          },
          capacity: 25600
        },
        {
          capability: {
            __value: 6
          },
          capacity: 500
        },
        {
          capability: {
            __value: 15
          },
          capacity: 0
        }
      ],
      bearerNetworkInstance: 'NET 2',
      bearerFabricType: 'IP',
      codecProfileName: 'default',
      execDataList: [
        {
          name: 'POTSEX',
          termtype: 'POTS'
        },
        {
          name: 'KSETEX',
          termtype: 'KEYSET'
        }
      ],
      defaultGwDomainName: ''
    },
    deviceList: []
  };
  const getStatusDataRes = {
    adminState: 'unlocked(1)',
    usageState: '<unknown>',
    operState: 'enabled(1)',
    standbyState: '<unknown>',
    activityState: '<unknown>',
    swactState: '<unknown>',
    isolationState: '<unknown>',
    alarmState: '00 00 00 00',
    availState: '<unknown>',
    faultState: '<unknown>',
    readyState: 'inService(1)',
    haState: 'inactive(2)'
  };

  const commonServiceMock = jasmine.createSpyObj('commonService', [
    'showAPIError'
  ]);

  const triggerServiceMock = jasmine.createSpyObj('triggerService', [
    'getMaintenanceTrigger'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceComponent],
      providers: [
        { provide: GatewayControllersService, useValue: gwcServiceMock },
        { provide: CommonService, useValue: commonServiceMock },
        { provide: MaintenanceTriggerService, useValue: triggerServiceMock }
      ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(MaintenanceComponent);
    component = fixture.componentInstance;
    refreshGwcSubscription = component.refreshGwcSubscription;

    component.gwControllerName = 'GWC-0';
    component.unit0ID = '10.254.166.18:161';
    component.unit1ID = '10.254.166.19:161';
    component.unit0IPAddr = '10.254.166.18';
    component.unit1IPAddr = '10.254.166.19';
    component.loadNameUnit0 = 'GL230AR';
    component.loadNameUnit1 = 'GL230AR';
    component.overallStatus = 'In Service';
    component.active = '10.254.166.16';
    component.inactive = '10.254.166.17';
    component.ipPanelUnit0 = '10.254.166.18';
    component.ipPanelUnit1 = '10.254.166.19';
    component.elementManagerIp = '10.254.166.150';
    component.trap = '3162';

    const maintenanceTriggerSubject = new Subject<void>();
    triggerServiceMock.getMaintenanceTrigger.and.returnValue(
      of(maintenanceTriggerSubject.asObservable())
    );
    gwcServiceMock.getUnitStatus.and.returnValue(of(getUnitStatusRes));
    gwcServiceMock.getLoadNameVersion.and.returnValue(of(getLoadNameVersionRes));
    gwcServiceMock.getGWCLoadName2.and.returnValue(of(getGWCLoadName2Res));
    gwcServiceMock.getGWCNodesByFilter_v1.and.returnValue(of(getGWCNodesByFilterRes));
    gwcServiceMock.getGWCNodeByName_v1.and.returnValue(of(getGWCNodeByName_v1Res));
    gwcServiceMock.getStatusData_e.and.returnValue(of(getStatusDataRes));

    fixture.detectChanges();
  });

  afterEach(() => {
    refreshGwcSubscription.unsubscribe(); // Unsubscribe after each test
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe from refreshGwcSubscription on ngOnDestroy', () => {
    component.refreshGwcSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);

    component.ngOnDestroy();

    expect(component.refreshGwcSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should set overallStatus to "In Service" when both readyStates are "inService(1)"', () => {
    const unit0ID = '10.254.166.22:161';
    const unit1ID = '10.254.166.23:161';

    component.handleOverallStatus(unit0ID, unit1ID);

    expect(gwcServiceMock.getStatusData_e).toHaveBeenCalledWith(unit0ID);
    expect(gwcServiceMock.getStatusData_e).toHaveBeenCalledWith(unit1ID);
    expect(component.overallStatus).toEqual('In Service');
  });

  it('should set overallStatus to "Out Of Service" when both readyStates are "outOfService"', () => {
    const outofService = { readyState: 'outOfService(2)' };
    gwcServiceMock.getStatusData_e.and.returnValue(of(outofService));
    const unit0ID = '10.254.166.22:161';
    const unit1ID = '10.254.166.23:161';

    component.handleOverallStatus(unit0ID, unit1ID);

    expect(gwcServiceMock.getStatusData_e).toHaveBeenCalledWith(unit0ID);
    expect(gwcServiceMock.getStatusData_e).toHaveBeenCalledWith(unit1ID);
    expect(component.overallStatus).toEqual('Out Of Service');
  });

  it('should set overallStatus to "Degraded" if either unit is inService(1)  and activeUnit = Unit 1', () => {
    const unit0ID = 'unit0';
    const unit1ID = 'unit1';
    const res0 = { readyState: 'inService(1)' };
    const res1 = { readyState: 'outOfService(2)', haState: 'active(1)' };

    gwcServiceMock.getStatusData_e.withArgs(unit0ID).and.returnValue(of(res0));
    gwcServiceMock.getStatusData_e.withArgs(unit1ID).and.returnValue(of(res1));

    component.handleOverallStatus(unit0ID, unit1ID);

    expect(gwcServiceMock.getStatusData_e).toHaveBeenCalledWith(unit0ID);
    expect(gwcServiceMock.getStatusData_e).toHaveBeenCalledWith(unit1ID);
    expect(component.overallStatus).toEqual('Degraded');
    expect(component.activeUnit).toEqual('Unit 1');
  });

  it('should set activeUnit = Unit 0', () => {
    const unit0ID = 'unit0';
    const unit1ID = 'unit1';
    const res0 = { readyState: 'inService(1)', haState: 'active(1)' };
    const res1 = { readyState: 'outOfService(2)'};

    gwcServiceMock.getStatusData_e.withArgs(unit0ID).and.returnValue(of(res0));
    gwcServiceMock.getStatusData_e.withArgs(unit1ID).and.returnValue(of(res1));

    component.handleOverallStatus(unit0ID, unit1ID);

    expect(component.activeUnit).toEqual('Unit 0');
  });

  it('should set overallStatus to "<unknown>" if it is not suitable the all case', () => {
    const unit0ID = '10.254.166.22:161';
    const unit1ID = '10.254.166.23:161';
    const res = { readyState: 'asd' };
    gwcServiceMock.getStatusData_e.and.returnValue(of(res));
    fixture.detectChanges();

    component.handleOverallStatus(unit0ID, unit1ID);

    expect(gwcServiceMock.getStatusData_e).toHaveBeenCalledWith(unit0ID);
    expect(gwcServiceMock.getStatusData_e).toHaveBeenCalledWith(unit1ID);
    expect(component.overallStatus).toEqual('<unknown>');
  });

  // it('should call error with unit1ID', () => {
  //   const unit0ID = '10.254.166.22:161';
  //   const unit1ID = '10.254.166.23:161';

  //   gwcServiceMock.getStatusData_e.withArgs(unit0ID).and.returnValue(throwError('error'));
  //   gwcServiceMock.getStatusData_e.withArgs(unit1ID).and.returnValue(throwError('error'));
  //   component.handleOverallStatus(unit0ID, unit1ID);

  //   expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  // });

  // it('should call error with unit1ID', () => {
  //   const unit0ID = '10.254.166.22:161';
  //   const unit1ID = '10.254.166.23:161';
  //   const res0 = { readyState: 'inService(1)' };

  //   gwcServiceMock.getStatusData_e.withArgs(unit0ID).and.returnValue(of(res0));
  //   gwcServiceMock.getStatusData_e.withArgs(unit1ID).and.returnValue(throwError('error'));
  //   component.handleOverallStatus(unit0ID, unit1ID);

  //   expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  // });

  // refreshGwcStatus
  it('should not refresh GWC status', () => {
    spyOn(component.refreshGwcSubscription, 'unsubscribe');
    component.gwControllerName = '';

    component.refreshGwcStatus();

    expect(component.refreshGwcSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should refresh GWC status', () => {
    component.refreshGwcStatus()?.subscribe(() => {
      expect(gwcServiceMock.getUnitStatus).toHaveBeenCalled();
      expect(component.unit0ID).toEqual(getUnitStatusRes.unit0ID);
      expect(component.unit1ID).toEqual(getUnitStatusRes.unit1ID);
      expect(component.unit0IPAddr).toEqual(getUnitStatusRes.unit0IPAddr);
      expect(component.unit1IPAddr).toEqual(getUnitStatusRes.unit1IPAddr);
      expect(gwcServiceMock.getStatusData_e).toHaveBeenCalledWith(getUnitStatusRes.unit0ID);
      expect(gwcServiceMock.getStatusData_e).toHaveBeenCalledWith(getUnitStatusRes.unit1ID);
      expect(gwcServiceMock.getGWCNodesByFilter_v1).toHaveBeenCalledWith(component.gwControllerName);
      expect(gwcServiceMock.getGWCNodeByName_v1).toHaveBeenCalledWith(component.gwControllerName);
    });
  });

  // ngOnChanges()
  it('should handle ngOnChanges()>getGWCLoadName2 errors by calling commonService.showAPIError', () => {
    gwcServiceMock.getGWCLoadName2.and.returnValue(throwError('error'));

    component.gwControllerName = 'GWC-1';
    component.ngOnChanges();

    expect(commonServiceMock.showAPIError).toHaveBeenCalled();
  });

  it('should handle errors correctly when API calls (getUnitStatus) fail', (done) => {
    const error = { errorCode: 'error', status: 404 };

    gwcServiceMock.getUnitStatus.and.returnValue(throwError(error));
    component.ngOnChanges();

    // Wait for async operation to complete
    setTimeout(() => {
      expect(commonServiceMock.showAPIError).toHaveBeenCalledWith(error);
      expect(component.isLoading).toBe(false);
      // Done function indicates the end of async test
      done();
    }, 0);
  });

  it('should handle errors correctly when API calls (getLoadNameVersion) fail', (done) => {
    const error = { errorCode: 'error', status: 404 };

    gwcServiceMock.getLoadNameVersion.and.returnValue(throwError(error));
    component.ngOnChanges();

    // Wait for async operation to complete
    setTimeout(() => {
      expect(commonServiceMock.showAPIError).toHaveBeenCalledWith(error);
      expect(component.isLoading).toBe(false);
      // Done function indicates the end of async test
      done();
    }, 0);
  });

  it('should call APIs and set loadNameUnit0 and loadNameUnit1 to <unknown>', (done) => {
    gwcServiceMock.getStatusData_e.and.returnValue(of({ haState: '<unknown>' }));

    component.ngOnChanges();

    // Wait for async operations to complete
    setTimeout(() => {
      expect(component.loadNameUnit0).toEqual('<unknown>');
      expect(component.loadNameUnit1).toEqual('<unknown>');

      expect(component.isLoading).toBe(false);
      done();
    }, 0);
  });


});
