import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { InterfaceBrowserService } from './interface-browser.service';
import { CmtgRestService } from 'src/app/services/api/cmtg-rest.service';
import { of } from 'rxjs';
import { IRingTemplate, ISigTemplate } from '../models/interface-browser';

describe('InterfaceBrowserService', () => {
  let service: InterfaceBrowserService;
  let cmtgRestServiceMock: jasmine.SpyObj<CmtgRestService>;
  const apiPath = environment.host + '/v5cfgmgrApi/v5cfgmgr/v1.0/';

  beforeEach(() => {
    const mockCmtgRestService = jasmine.createSpyObj('CmtgRestService', [
      'getDataBody',
      'put',
      'postDataBody',
      'post',
      'deleteDataBody'
    ]);
    TestBed.configureTestingModule({
      providers: [
        InterfaceBrowserService,
        { provide: CmtgRestService, useValue: mockCmtgRestService }
      ]
    });
    service = TestBed.inject(InterfaceBrowserService);
    cmtgRestServiceMock = TestBed.inject(
      CmtgRestService
    ) as jasmine.SpyObj<CmtgRestService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call getDataBody for getRingTemplateId', () => {
    cmtgRestServiceMock.getDataBody.and.returnValue(of({ data: 'mockData' }));
    service.getRingTemplateId();
    expect(cmtgRestServiceMock.getDataBody).toHaveBeenCalledWith(
      `${apiPath}v5-ring-all-template`
    );
  });

  it('should call getDataBody for getRingTemplate', () => {
    const v5RingId = '123';
    cmtgRestServiceMock.getDataBody.and.returnValue(of({ data: 'mockData' }));

    service.getRingTemplate(v5RingId);

    expect(cmtgRestServiceMock.postDataBody).toHaveBeenCalledWith(
      `${apiPath}v5-ring-template-list`,v5RingId
    );
  });

  it('should call put for addNewRing', () => {
    const newRing: IRingTemplate = {
      v5ringid: '3',
      std: '2',
      r01: '2',
      r02: '2',
      r03: '2',
      r04: '2',
      r05: '2',
      r06: '2',
      r07: '2',
      r08: '2',
      r09: '2',
      r10: '2',
      r11: '2',
      r12: '2',
      r13: '2',
      r14: '2',
      r15: '2'
    };
    service.addNewRing(newRing);
    expect(cmtgRestServiceMock.put).toHaveBeenCalledWith(
      `${apiPath}v5-ring-template`,
      newRing
    );
  });

  it('should call deleteDataBody for deleteRing', () => {
    const v5RingId = '123';
    cmtgRestServiceMock.deleteDataBody.and.returnValue(of({}));

    service.deleteRing(v5RingId);

    expect(cmtgRestServiceMock.postDataBody).toHaveBeenCalledWith(`${apiPath}v5-ring-template-delete`,v5RingId);
  });

  it('should call postDataBody for modifyRing', () => {
    const ring: IRingTemplate = {
      v5ringid: '3',
      std: '2',
      r01: '2',
      r02: '2',
      r03: '2',
      r04: '2',
      r05: '2',
      r06: '2',
      r07: '2',
      r08: '2',
      r09: '2',
      r10: '2',
      r11: '2',
      r12: '2',
      r13: '2',
      r14: '2',
      r15: '2'
    };
    cmtgRestServiceMock.postDataBody.and.returnValue(of({}));

    service.modifyRing(ring);

    expect(cmtgRestServiceMock.postDataBody).toHaveBeenCalledWith(`${apiPath}v5-ring-template`,
      ring
    );
  });

  it('should call getDataBody for getSigTemplateId', () => {
    cmtgRestServiceMock.getDataBody.and.returnValue(of({ data: 'mockData' }));

    service.getSigTemplateId();

    expect(cmtgRestServiceMock.getDataBody).toHaveBeenCalledWith(`${apiPath}v5-sig-all-template-sync`);
  });

  it('should call postDataBody for getSigTemplate', () => {
    const v5sigId = '123';

    cmtgRestServiceMock.postDataBody.and.returnValue(of({ data: 'mockData' }));
    service.getSigTemplate(v5sigId);
    expect(cmtgRestServiceMock.postDataBody).toHaveBeenCalledWith(`${apiPath}v5-sig-template-list`, v5sigId);
  });

  it('should call put method for addNewSig', () => {
    const mockSig: ISigTemplate = {
      v5sigid: '2',
      atten: 3,
      apa: true,
      plf: true,
      ds1flash: true,
      eoc: true,
      suppind: 3,
      plsdur: '2',
      mtrpn: true,
      lroa: 3,
      lrosfd: true,
      rngtype: 3,
      ssonhook: true
    };

    service.addNewSig(mockSig);

    expect(cmtgRestServiceMock.put).toHaveBeenCalledWith(`${apiPath}v5-sig-template`,
      mockSig
    );
  });

  it('should call postDataBody method for modifySig', () => {
    const mockSig: ISigTemplate = {
      v5sigid: '2',
      atten: 3,
      apa: true,
      plf: true,
      ds1flash: true,
      eoc: true,
      suppind: 3,
      plsdur: '2',
      mtrpn: true,
      lroa: 3,
      lrosfd: true,
      rngtype: 3,
      ssonhook: true
    };
    cmtgRestServiceMock.postDataBody.and.returnValue(of(null));

    service.modifySig(mockSig).subscribe(() => {
      expect(cmtgRestServiceMock.postDataBody).toHaveBeenCalledWith(`${apiPath}v5-sig-template`,
        mockSig
      );
    });
  });

  it('should call postDataBody method for deleteSig', () => {
    const v5SigId = '123';
    cmtgRestServiceMock.postDataBody.and.returnValue(of(null));

    service.deleteSig(v5SigId).subscribe(() => {
      expect(cmtgRestServiceMock.postDataBody).toHaveBeenCalledWith(`${apiPath}v5-sig-template-delete`, v5SigId);
    });
  });

  it('should call getDataBody for getInterfaceBrowserTemplateID', () => {
    cmtgRestServiceMock.getDataBody.and.returnValue(of({ data: 'mockData' }));

    service.getInterfaceBrowserTemplateID();

    expect(cmtgRestServiceMock.getDataBody).toHaveBeenCalledWith(`${apiPath}v5-all-interface`
    );
  });

  it('should call getDataBody method for getInterfaceBrowserTemplate', () => {
    const v5interfaceId = '123';
    cmtgRestServiceMock.getDataBody.and.returnValue(of({}));
    service.getInterfaceBrowserTemplate(v5interfaceId);

    expect(cmtgRestServiceMock.getDataBody).toHaveBeenCalledWith(`${apiPath}v5-interface/123`
    );
  });

  it('should call put method for addNewInterfaceBrowser', () => {
    const interfaceR = {
      siteGwcLoc: '2',
      gwcId: '2',
      v52InterfaceId: '2',
      linkMapTable: [{ linkId: 's', epGrp: 'a' }],
      maxlinesSelector: '2',
      maxlines: '2',
      v5ProvRef: '2',
      v5SigTableRef: '2',
      v5RingTableRef: '2'
    };
    service.addNewInterfaceBrowser(interfaceR);
    expect(cmtgRestServiceMock.put).toHaveBeenCalledWith(`${apiPath}v5-interface`,
      interfaceR
    );
  });

  it('should call postDataBody method for modifyInterfaceBrowser', () => {
    const interfaceR = {
      siteGwcLoc: '2',
      gwcId: '2',
      v52InterfaceId: '2',
      linkMapTable: [{ linkId: 's', epGrp: 'a' }],
      maxlinesSelector: '2',
      maxlines: '2',
      v5ProvRef: '2',
      v5SigTableRef: '2',
      v5RingTableRef: '2'
    };
    const identifier = '123';
    cmtgRestServiceMock.postDataBody.and.returnValue(of({}));

    service.modifyInterfaceBrowser(interfaceR, identifier).subscribe((data) => {
      expect(cmtgRestServiceMock.postDataBody).toHaveBeenCalledWith(`${apiPath}v5-interface/123`,
        interfaceR
      );
    });
  });

  it('should call deleteDataBody method for deleteInterfaceBrowser', () => {
    const v5SigId = '123';
    cmtgRestServiceMock.deleteDataBody.and.returnValue(of({}));
    service.deleteInterfaceBrowser(v5SigId);
    expect(cmtgRestServiceMock.deleteDataBody).toHaveBeenCalledWith(`${apiPath}v5-interface/123`
    );
  });

  it('should call getDataBody method for getProvTemplateId', () => {
    cmtgRestServiceMock.getDataBody.and.returnValue(of({}));
    service.getProvTemplateId();
    expect(cmtgRestServiceMock.getDataBody).toHaveBeenCalledWith(`${apiPath}v5-prov-all-template`
    );
  });

  it('should call getDataBody method for getProvTemplate', () => {
    const identifier = '123';
    cmtgRestServiceMock.getDataBody.and.returnValue(of({}));
    service.getProvTemplate(identifier);
    expect(cmtgRestServiceMock.getDataBody).toHaveBeenCalledWith(`${apiPath}v5-prov-template/123`
    );
  });

  it('should call put method for addProvTemplate', () => {
    service.addProvTemplate({});
    expect(cmtgRestServiceMock.put).toHaveBeenCalledWith(`${apiPath}v5-prov-template`,
      {}
    );
  });

  it('should call postDataBody method for modifyProvTemplate', () => {
    service.modifyProvTemplate({});
    expect(cmtgRestServiceMock.postDataBody).toHaveBeenCalledWith(`${apiPath}v5-prov-template`,
      {}
    );
  });

  it('should call deleteDataBody method for deleteProv', () => {
    const provId = '123';
    cmtgRestServiceMock.deleteDataBody.and.returnValue(of({}));
    service.deleteProv(provId);
    expect(cmtgRestServiceMock.deleteDataBody).toHaveBeenCalledWith(`${apiPath}v5-prov-template/123`
    );
  });

  it('should call postDataBody method for carrierInterfaceMapping', () => {
    const gwName = 'gw';
    const carrierName = 'carrier';
    const wildCard = true;

    service.carrierInterfaceMapping(gwName, carrierName, wildCard);

    expect(cmtgRestServiceMock.postDataBody).toHaveBeenCalledWith(`${apiPath}carrier-interface-mapping/gw/true`,
      carrierName
    );
  });
});
