import { TestBed } from '@angular/core/testing';

import { TmmRestService } from './tmm-rest.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

describe('TmmRestService', () => {
  let service: TmmRestService;
  let httpMock: HttpTestingController;
  let apiUrl: string;
  let requestData: any;
  let responseData: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TmmRestService]
    });
    apiUrl = 'https://example.com/api/data';
    requestData = { id: 1, name: 'John' };
    responseData = { id: 1, name: 'John Doe' };
    service = TestBed.inject(TmmRestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getDataBody', () => {
    service.getDataBody(apiUrl).subscribe(data => {
      expect(data).toEqual(responseData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(responseData);
  });

  it('should call getStringDataBody', () => {
    const response = '{"id":1,"name":"John Doe"}';
    service.getStringDataBody(apiUrl).subscribe(data => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(responseData);
  });

  it('should call postDataBody', () => {
    service.postDataBody(apiUrl, requestData).subscribe(data => {
      expect(data).toEqual(responseData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestData);
    req.flush(responseData);
  });

  it('should call putDataBody', () => {
    service.putDataBody(apiUrl, requestData).subscribe();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(requestData);
    req.flush(responseData);
  });

  it('should call putDataParamBody', () => {
    const requestParams = new HttpParams().set('param', 'value');
    service.putDataParamBody(apiUrl, requestParams, requestData).subscribe(data => {
      expect(data).toEqual(responseData);
    });

    const req = httpMock.expectOne(`${apiUrl}?param=value`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(requestData);
    req.flush(responseData);
  });
});
