import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { GetInformationService } from './get-information.service';

describe('GetInformationService', () => {
  let service: GetInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(GetInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be call getInformation', () => {
    const data = { project: 'LINE MAINTENANCE MANAGER', version: '', banner: '' };
    const result = service.getInformation();
    result.subscribe(res => {
      expect(res).toEqual(new HttpResponse({ body: data }));
    });
  });

  it('should be call parseProject', () => {
    const res: any = { body: { project: 'LMM' } };
    const result = service.parseProject(res);
    expect(result).toEqual('LMM');
  });

  it('should be call parseVersion', () => {
    const res: any = { body: { version: '1.0' } };
    const result = service.parseVersion(res);
    expect(result).toEqual('1.0');
  });

  it('should be call parseBanner', () => {
    const res: any = { body: { banner: '' } };
    const result = service.parseBanner(res);
    expect(result).toEqual('');
  });
});
