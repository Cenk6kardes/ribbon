import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';

import TRANSLATIONS_EN from '../../../../../assets/i18n/lmm_en.json';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonService } from 'src/app/services/common.service';
import { StatusLogService } from 'src/app/services/status-log.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { DirectoryService } from '../../services/directory.service';

import { HomeService } from '../../services/home.service';
import { CM_RC_VALUE, DISPLAY_INFO_TYPE, POST_TYPE, REFRESH_TYPE } from '../../models/home';
import { PostCommandComponent } from './post-command.component';
import { StorageService } from 'src/app/services/storage.service';
import { StatusIndicatorsService } from '../../services/status-indicators.service';

import { Status } from 'rbn-common-lib';

describe('PostCommandComponent', () => {
  let component: PostCommandComponent;
  let fixture: ComponentFixture<PostCommandComponent>;

  // #region define constant
  const homeService = jasmine.createSpyObj('homeService', [
    'getLineInformationByDNAndCLLI',
    'getLinePostInformation',
    'getGateway',
    'getAllInformationGWElement',
    'getEndpointStateInformation',
    'getLMMLineGatewayNames',
    'getEndpointsOrdered',
    'getLineInformationByTIDAndCLLI',
    'postCancelDeload',
    'getCMCLLI'
  ]);
  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'getCurrentTime'
  ]);

  const statusLogService = jasmine.createSpyObj('statusLogService', [
    'pushLogs'
  ]);

  const statusIndicatorsService = jasmine.createSpyObj('statusIndicatorsService', ['updateStatus']);

  const responseAllInformationGWElement = {
    identifier: 'mediatrix',
    profile: 'TOUCHTONE',
    hardwareType: {
      number: 2,
      name: 'SMALL',
      snmpNumber: 2,
      snmpName: 'small'
    },
    serviceTypes: { type: 0 },
    gwc: 'GWC-1',
    category: { category: 0 },
    emdata: { emID: null, neID: null, subnetManagerID: null, physicalMG: null },
    nodeName: null,
    nodeNumber: 46,
    toneinfo: { location: null, owner: null },
    maxRsvdEndpoints: 2,
    other_info: null
  };

  const responseGateWay = {
    name: 'sipvmgssl24',
    ipAddress: '47.165.158.121',
    type: 'large',
    extNodeNumber: -1,
    protocol: 'mgcp',
    protVers: '0.0',
    protPort: 7060,
    heartbeat: 6,
    connSel: '0',
    profile: 75,
    pepServerName: 'NOT_SET',
    middleBoxName: 'NOT_SET',
    itransRootMiddleboxNames: [],
    algName: 'NOT_SET',
    defaultDomainName: 'NOT_SET',
    applicationData: []
  };

  const responseEndpointsOrdered = {
    count: 2,
    epData: [
      {
        gwcID: '10.254.146.140:161',
        gatewayName: 'co24mediatrix1124',
        gwHostname: 'co24mediatrix1124',
        gwDefaultDomain: 'NOT_SET',
        endpointName: 'aaln/1',
        extNodeNumber: 46,
        extTerminalNumber: 1,
        endpointStatus: 'NOT_SET',
        iid: -1,
        endpointTNType: 2
      },
      {
        gwcID: '10.254.146.140:161',
        gatewayName: 'co24mediatrix1124',
        gwHostname: 'co24mediatrix1124',
        gwDefaultDomain: 'NOT_SET',
        endpointName: 'aaln/2',
        extNodeNumber: 46,
        extTerminalNumber: 2,
        endpointStatus: 'NOT_SET',
        iid: -1,
        endpointTNType: 2
      }
    ]
  };

  const lineValidateData = {
    cm_dn: '1038831005',
    cm_len: 'LG 00 0 00 05',
    cm_lcc: 'IBN ',
    cm_tid: '46.0.6',
    cm_gwc_name: 'GWC    0',
    cm_gwc_address: '10.254.146.140',
    cm_clli: 'No',
    gw_name: 'co24mediatrix1124',
    gw_address: '47.168.139.99',
    gw_type: '',
    endpoint_name: 'aaln/6',
    cm_rc: '0',
    gw_rc: ''
  };

  const responseEndpointStateInformation = {
    epState: 'OK',
    epInfo: '',
    op_rc: '1000',
    epCallState: 'ON-HOOK',
    epTerminalType: 'POTS_TERM',
    epStateDescription: 'Valid Audit response received from endpoint'
  };

  const responseLinePostInformation = {
    cm_line_state: 'MB',
    cm_connected_party: '',
    cm_dn: '1038831001',
    endpoint_state: '',
    cm_rc: '0',
    gw_rc: '',
    agcf_state: ''
  };
  // #endregion

  const directoryService = jasmine.createSpyObj('directoryService', [
    'storeDataTableStorage',
    'restoreDataTableFromStorage',
    'handleRowData',
    'dataTableChange$',
    'dataTable',
    'getRowIndexByCMDN',
    'handleRowWhenCMRCInvalid',
    'formatEndpointStateValue',
    'formatLineRequest',
    'getPostCommandDataFromStorage',
    'setPostCommandDataToStorage'
  ]);
  directoryService.getPostCommandDataFromStorage.and.returnValue({postValue:'',type:'POST_DN'});
  directoryService.dataTableChange$ = new Subject<boolean>();
  directoryService.dataTable = [];
  const storageService = jasmine.createSpyObj('storageService', [
    'clli'
  ]);

  const mockDataDN = {
    data: [
      {
        cm_dn: '1038831001',
        clli: 'CO24',
        time: '16:17:07',
        cm_line_state: 'MB',
        endpoint_state: 'OK, ON-HOOK, POTS_TERM',
        profile: 'TOUCHTONE',
        gw_address: '47.168.139.99',
        endpoint_name: 'aaln/6',
        cm_tid: '46.0.1',
        cm_gwc_address: '10.254.146.140',
        gw_name: 'co24mediatrix1124',
        getGatewayProtocol: 'mgcp'
      }
    ],
    refreshType: REFRESH_TYPE.ROW
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostCommandComponent],
      imports: [
        // HomeModule,
        SharedModule,
        HttpClientModule
      ],
      providers: [
        { provide: HomeService, useValue: homeService },
        { provide: CommonService, useValue: commonService },
        { provide: StatusLogService, useValue: statusLogService },
        { provide: DirectoryService, useValue: directoryService },
        { provide: StorageService, useValue: storageService },
        { provide: StatusIndicatorsService, useValue: statusIndicatorsService },
        PreferencesService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    storageService.clli = 'C20';
    storageService.cBMgIP = '10.254.146.43';
    fixture = TestBed.createComponent(PostCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.translateResult = TRANSLATIONS_EN;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call save case DN invalid', () => {
    component.postForm.get('postValue')?.setValue('');
    component.save();
    expect(component.displayInfoDialog).toBeTruthy();
  });

  it('should call save with uninitialized GUI case', () => {
    storageService.cBMgIP = null;
    component.save();
    expect(statusLogService.pushLogs).toHaveBeenCalled();
    expect(component.displayInfoDialog).toBeTrue();
  });

  it('should call save case DN vaild', () => {
    spyOn(component, 'doPostDN');
    component.postForm.get('postValue')?.setValue('1038831005');
    component.postForm.get('type')?.setValue(POST_TYPE.POST_DN);
    component.save();
    expect(component.doPostDN).toHaveBeenCalled();
  });

  it('should call save case POST_GATEWAY vaild return empty GATEWAY', () => {
    component.postForm.get('postValue')?.setValue('1038831005');
    component.postForm.get('type')?.setValue(POST_TYPE.POST_GATEWAY);
    homeService.getLMMLineGatewayNames.and.returnValue(of([]));
    component.save();
    expect(component.displayInfoDialog).toBeTruthy();
  });

  it('should call save case POST_GATEWAY vaild return GATEWAYs', () => {
    component.postForm.get('postValue')?.setValue('1038831005');
    component.postForm.get('type')?.setValue(POST_TYPE.POST_GATEWAY);
    homeService.getLMMLineGatewayNames.and.returnValue(
      of([{ name: 'mediatrix' }, { name: 'co24linegw' }])
    );
    component.save();
    expect(component.displayGatewaysDialog).toBeTruthy();
  });

  it('should call save case POST_GATEWAY invalid', () => {
    component.postForm.get('postValue')?.setValue('1038831005');
    component.postForm.get('type')?.setValue(POST_TYPE.POST_GATEWAY);
    const er = {
      error: { message: 'error' }
    };
    homeService.getLMMLineGatewayNames.and.returnValue(throwError(er));
    component.save();
    expect(component.infoDialogData.content).toBe(er.error.message);
  });

  it('should call acceptGateway', () => {
    spyOn(component, 'doPostGateway');
    component.selectedGateway = [
      { name: 'mediatrix' }
    ];
    component.acceptGateway();
    expect(component.doPostGateway).toHaveBeenCalled();
  });

  it('should call doPostDN with empty clli', () => {
    storageService.clli = '';
    spyOn(component, 'displayInfomation');
    component.doPostDN('1038831005');
    expect(component.displayInfomation).toHaveBeenCalled();
  });

  it('should call doPostDN success with cm_rc = 2', () => {
    spyOn(component, 'displayInfomation');
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of({
        cm_dn: '1038831005',
        cm_len: 'LG 00 0 00 05',
        cm_lcc: 'IBN ',
        cm_tid: '46.0.6',
        cm_gwc_name: 'GWC    0',
        cm_gwc_address: '10.254.146.140',
        cm_clli: 'No',
        gw_name: 'co24mediatrix1124',
        gw_address: '47.168.139.99',
        gw_type: '',
        endpoint_name: 'aaln/6',
        cm_rc: '2',
        gw_rc: ''
      })
    );
    const rowData = {
      cm_dn: '1038831005',
      clli: 'CO24',
      time: '14:17:12',
      cm_line_state: 'MB',
      endpoint_state: 'OK, ON-HOOK, POTS_TERM',
      profile: 'TOUCHTONE',
      gw_address: '47.168.139.99',
      endpoint_name: 'aaln/6',
      cm_tid: '46.0.1',
      cm_gwc_address: '10.254.146.140',
      gw_name: 'co24mediatrix1124'
    };
    directoryService.dataTable = [rowData];
    component.doPostDN('1038831005');
    expect(component.displayInfomation).toHaveBeenCalled();
  });

  it('should call doPostDN success with cm_rc = 13', () => {
    spyOn(component, 'displayInfomation');
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of({
        cm_dn: '1038831005',
        cm_len: 'LG 00 0 00 05',
        cm_lcc: 'IBN ',
        cm_tid: '46.0.6',
        cm_gwc_name: 'GWC    0',
        cm_gwc_address: '10.254.146.140',
        cm_clli: 'No',
        gw_name: 'co24mediatrix1124',
        gw_address: '47.168.139.99',
        gw_type: '',
        endpoint_name: 'aaln/6',
        cm_rc: '13',
        gw_rc: ''
      })
    );
    component.doPostDN('1038831005');
    expect(component.displayInfomation).toHaveBeenCalled();
  });

  it('should call doPostDN success with cm_rc = 0', () => {
    spyOn(component, 'handlePostDNSuccess');
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of({
        cm_dn: '1038831005',
        cm_len: 'LG 00 0 00 05',
        cm_lcc: 'IBN ',
        cm_tid: '46.0.6',
        cm_gwc_name: 'GWC    0',
        cm_gwc_address: '10.254.146.140',
        cm_clli: 'No',
        gw_name: 'co24mediatrix1124',
        gw_address: '47.168.139.99',
        gw_type: '',
        endpoint_name: 'aaln/6',
        cm_rc: '0',
        gw_rc: ''
      })
    );
    component.doPostDN('1038831005');
    expect(component.handlePostDNSuccess).toHaveBeenCalled();
  });

  it('should call doPostDN throw error', () => {
    spyOn(component, 'displayInfomation');
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      throwError({
        error: { message: '' }
      })
    );
    component.doPostDN('1038831005');
    expect(component.displayInfomation).toHaveBeenCalled();
  });

  it('should call displayInfomation case display type dialog', () => {
    const information = {
      title: 'Test',
      content: 'OK',
      dnValue: '1038831005'
    };
    component.displayInfomation(information, DISPLAY_INFO_TYPE.DIALOG);
    expect(component.displayInfoDialog).toBeTruthy();
  });

  it('should call displayInfomation case display type toast', () => {
    commonService.showErrorMessage.and.returnValue(of([]));
    const information = {
      title: 'Test',
      content: 'OK',
      dnValue: '1038831005'
    };
    component.displayInfomation(information, DISPLAY_INFO_TYPE.TOAST);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should call handlePostDNSuccess', () => {
    statusLogService.pushLogs.and.returnValue(of([]));

    commonService.getCurrentTime.and.returnValue('11:26:29');

    homeService.getAllInformationGWElement.and.returnValue(
      of(responseAllInformationGWElement)
    );

    homeService.getLinePostInformation.and.returnValue(
      of(responseLinePostInformation)
    );

    homeService.getGateway.and.returnValue(of(responseGateWay));

    homeService.getEndpointStateInformation.and.returnValue(
      of(responseEndpointStateInformation)
    );

    component.handlePostDNSuccess(lineValidateData);
    expect(homeService.getAllInformationGWElement).toHaveBeenCalled();
    expect(homeService.getGateway).toHaveBeenCalled();
  });

  it('should call doPostGateway case no clli', () => {
    storageService.clli = '';
    component.doPostGateway('test');
    expect(component.displayInfoDialog).toBeTruthy();
  });

  it('should call doPostGateway with vaild clli', () => {
    homeService.getAllInformationGWElement.and.returnValue(
      of(responseAllInformationGWElement)
    );

    homeService.getEndpointsOrdered.and.returnValue(
      of(responseEndpointsOrdered)
    );

    homeService.getGateway.and.returnValue(of(responseGateWay));

    homeService.getLineInformationByTIDAndCLLI.and.returnValue(
      of(lineValidateData)
    );

    homeService.getEndpointStateInformation.and.returnValue(
      of(responseEndpointStateInformation)
    );

    homeService.getLinePostInformation.and.returnValue(
      of(responseLinePostInformation)
    );

    component.doPostGateway('test');
    expect(homeService.getAllInformationGWElement).toHaveBeenCalled();
    expect(homeService.getEndpointsOrdered).toHaveBeenCalled();
    expect(homeService.getGateway).toHaveBeenCalled();
  });

  it('should call doPostGateway case getAllInformationGWElement throw error', () => {
    sessionStorage.setItem('clli', 'CO2');
    homeService.getAllInformationGWElement.and.returnValue(
      throwError({
        error: { message: 'error' }
      })
    );
    component.doPostGateway('test');
    expect(component.displayInfoDialog).toBeTruthy();
  });

  it('should call doPostGateway case getGateway throw error', () => {
    sessionStorage.setItem('clli', 'CO2');
    homeService.getAllInformationGWElement.and.returnValue(
      of(responseAllInformationGWElement)
    );
    homeService.getEndpointsOrdered.and.returnValue(
      of(responseEndpointsOrdered)
    );
    homeService.getGateway.and.returnValue(
      throwError({
        error: { message: 'error' }
      })
    );
    component.doPostGateway('test');
    expect(component.displayInfoDialog).toBeTruthy();
  });

  // it('should call changeTypesPost', () => {
  //   spyOn(component, 'save');
  //   component.changeTypesPost(POST_TYPE.SELECT_GATEWAY_TO_POST);
  //   expect(component.save).toHaveBeenCalled();
  // });

  it('should call cancelDeloadPostLine', inject(
    [PreferencesService],
    (preferencesService: PreferencesService) => {
      directoryService.dataTable = [
        {
          'cm_line_state': 'INB ',
          'cm_connected_party': '',
          'cm_dn': '2012739999',
          'endpoint_state': ' ',
          'cm_rc': '0',
          'gw_rc': ' ',
          'agcf_state': ' '
        }
      ];
      spyOn(preferencesService, 'getPreferencesCPDRequest').and.returnValue(
        true
      );
      homeService.postCancelDeload.and.returnValue(of([]));
      preferencesService.autoTerminationEmit$.next();
      expect(homeService.postCancelDeload).toHaveBeenCalled();
    }
  ));

  it('should call refreshDN with REFRESH_TYPE.ROW', () => {
    homeService.getLinePostInformation.and.returnValue(
      of(responseLinePostInformation)
    );
    homeService.getEndpointStateInformation.and.returnValue(
      of(responseEndpointStateInformation)
    );
    component.refreshDN(mockDataDN);
    expect(directoryService.handleRowData).toHaveBeenCalled();
  });

  it('should call refreshDN with REFRESH_TYPE.TABLE', () => {
    spyOn(component, 'doRefreshDN');
    homeService.getCMCLLI.and.returnValue(of('CO2'));
    mockDataDN.refreshType = REFRESH_TYPE.TABLE;
    component.refreshDN(mockDataDN);
    expect(component.doRefreshDN).toHaveBeenCalled();
  });

  it('should call doRefreshDN with invalid cm_rc', () => {
    spyOn(component, 'displayInfomation');
    const tmp = {... responseLinePostInformation };
    tmp.cm_rc = '1';
    homeService.getLinePostInformation.and.returnValue(
      of(tmp)
    );
    mockDataDN.refreshType = REFRESH_TYPE.ROW;
    component.doRefreshDN(mockDataDN);
    expect(component.displayInfomation).toHaveBeenCalled();
  });

  it('should call doRefreshDN with error', () => {
    homeService.getLinePostInformation.and.returnValue(
      throwError({ error: { message: 'error' } })
    );
    mockDataDN.refreshType = REFRESH_TYPE.ROW;
    component.doRefreshDN(mockDataDN);
    expect(mockDataDN.data[0].cm_line_state).toEqual('Not_Available');
  });

  it('should call selectionChange', () => {
    component.selectedGateway = [
      { name: 'med24softph' },
      { name: 'ncsco24.netas.com.tr' }
    ];
    component.selectionChange();
    expect(component.selectedGateway).toEqual([
      { name: 'med24softph' }
    ]);
  });

  it('should call selectionChange', () => {
    component.hideDialogGateway();
    expect(component.postForm.get('type')?.value).toEqual(POST_TYPE.POST_GATEWAY);
  });

  it('should call handleCMRCInvalidMessage with DMA failed', () => {
    const cm_rc = CM_RC_VALUE.DMA_FAULT;
    const clli = 'C039';
    component.handleCMRCInvalidMessage(cm_rc, clli);
    expect(statusIndicatorsService.updateStatus).toHaveBeenCalledWith(3, Status.FAULT);
  });
});
