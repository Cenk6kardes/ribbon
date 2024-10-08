import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GatewayControllerElementManagerService } from 'src/app/services/api/gateway-controller-element-manager.service';
import { LineMaintenanceManagerService } from 'src/app/services/api/line-maintenance-manager.service';
import { ReportService } from './reports.service';


describe('ReportService', () => {
  let service: ReportService;
  const reportList = [{
    fileDisplay: 'Report-2023-05-23-03-00-01(GMT+0300)',
    fileName: 'Report_1',
    fileLMTimeInMillis: 1684800001078
  }];

  const generalReports = [
    {
      gwcName: 'GWC-0',
      queryResult: 'Succesful',
      numberOfGW: 4
    }
  ];

  const reportDetail = [
    {
      gwName: 'med24softph',
      errorMessage: 'GW DISABLED'
    }
  ];

  const gateways = [
    {
      name: 'mediatrix'
    }
  ];

  const gatewaysList = [
    {
      gwcAlias: 'gwcAlias',
      gwcStatus: 'gwcStatus'
    }
  ];

  const troubleQueryGWController = ['GWC-1'];

  const queryConfig = {
    enabled: false,
    timeToRun: '03:00:00',
    daily: true,
    sunday: false,
    monday: false,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: false,
    saturday: false
  };

  const response200 = {
    code: 200,
    message: '200 OK'
  };

  const lineMaintenanceManagerService = {
    getListOfReport: () => of(reportList),
    getGeneralResultOfReport: () => of(generalReports),
    getDetailedReport: () => of(reportDetail),
    postTroubleQueryGWControllers: () => of(true),
    postTroubleQueryAllGWControllers: () => of(true),
    getQueryConfiguration: () => of(queryConfig),
    runQueryConfiguration: () => of(response200)
  };

  const gatewayControllerElementManagerService = {
    getLMMLineGatewayNames: () => of(gateways),
    getGWCList: () => of(gatewaysList)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: LineMaintenanceManagerService, value: lineMaintenanceManagerService },
        { provide: GatewayControllerElementManagerService, value: gatewayControllerElementManagerService }
      ]
    });
    service = TestBed.inject(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return value when calling getListOfReport function ', () => {
    service.getListOfReport();
    lineMaintenanceManagerService.getListOfReport().subscribe(res => {
      expect(res).toEqual(reportList);
    });
  });

  it('should return value when calling getGeneralResultOfReport function ', () => {
    service.getGeneralResultOfReport('report1');
    lineMaintenanceManagerService.getGeneralResultOfReport().subscribe(res => {
      expect(res).toEqual(generalReports);
    });
  });

  it('should return value when calling getDetailedReport function ', () => {
    service.getDetailedReport('report1');
    lineMaintenanceManagerService.getDetailedReport().subscribe(res => {
      expect(res).toEqual(reportDetail);
    });
  });

  it('should return value when calling getLMMLineGatewayNames function ', () => {
    service.getLMMLineGatewayNames('report1');
    gatewayControllerElementManagerService.getLMMLineGatewayNames().subscribe(res => {
      expect(res).toEqual(gateways);
    });
  });

  it('should return value when calling getGatewayControllersList function ', () => {
    service.getGatewayControllersList();
    gatewayControllerElementManagerService.getGWCList().subscribe(res => {
      expect(res).toEqual(gatewaysList);
    });
  });

  it('should return value when calling postTroubleQueryGWControllers function ', () => {
    service.postTroubleQueryGWControllers(troubleQueryGWController);
    lineMaintenanceManagerService.postTroubleQueryGWControllers().subscribe(res => {
      expect(res).toEqual(true);
    });
  });

  it('should return value when calling postTroubleQueryAllGWControllers function ', () => {
    service.postTroubleQueryAllGWControllers();
    lineMaintenanceManagerService.postTroubleQueryAllGWControllers().subscribe(res => {
      expect(res).toEqual(true);
    });
  });

  it('should return value when calling getQueryConfiguration function ', () => {
    service.getQueryConfiguration();
    lineMaintenanceManagerService.getQueryConfiguration().subscribe(res => {
      expect(res).toEqual(queryConfig);
    });
  });

  it('should return value when calling runQueryConfiguration function ', () => {
    service.runQueryConfiguration(queryConfig);
    lineMaintenanceManagerService.runQueryConfiguration().subscribe(res => {
      expect(res).toEqual(response200);
    });
  });
});
