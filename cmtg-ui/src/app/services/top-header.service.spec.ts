import { TestBed } from '@angular/core/testing';

import { TopHeaderService } from './top-header.service';
import { CmtgRestService } from './api/cmtg-rest.service';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

describe('TopHeaderService', () => {
  let service: TopHeaderService;

  const cmtgRestServiceMock = jasmine.createSpyObj('CmtgRestService', [
    'getStringDataBody'
  ]);

  const gwcPath = environment.host + '/GwcemApi/gwcem/v1.0/software-info';

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [
      TopHeaderService,
      { provide: CmtgRestService, useValue: cmtgRestServiceMock }
    ]});
    service = TestBed.inject(TopHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getStringDataBody with correct URL when getSoftwareInfo is called', () => {
    const expectedUrl = environment.host + '/GwcemApi/gwcem/v1.0/software-info';
    cmtgRestServiceMock.getStringDataBody.and.returnValue(of(''));

    service.getSoftwareInfo();

    expect(cmtgRestServiceMock.getStringDataBody).toHaveBeenCalledWith(gwcPath);
  });
});
