import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { CommonService } from './common.service';
import { RbnMessageService } from 'rbn-common-lib';
import moment from 'moment';

describe('CommonService', () => {
  let service: CommonService;
  const rbnMessageService = jasmine.createSpyObj('rbnMessageService', ['showError', 'showInfo', 'showWarn', 'showSuccess', 'clear']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: RbnMessageService, useValue: rbnMessageService }
      ]
    });
    service = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getCurrentTime', () => {
    const format = 'HH:mm:ss';
    const time = service.getCurrentTime();
    expect(time).toEqual(moment().format(format));
  });

  it('should call formatTime', () => {
    const date = new Date();
    const formatType = 'HH:mm:ss';
    const time = service.formatTime(date, formatType);
    expect(time).toEqual(moment(date).format(formatType));
  });

  it('should call showAPIError', () => {
    const httpError = new HttpErrorResponse({
      error: {
        errrorCode: '400',
        message: 'Error'
      }
    });
    service.showAPIError(httpError);
    expect(rbnMessageService.showError).toHaveBeenCalledWith(httpError.error.message);
  });

  it('should call showErrorMessage', () => {
    const message = 'Error';
    service.showErrorMessage(message);
    expect(rbnMessageService.showError).toHaveBeenCalled();
  });

  it('should call showInfoMessage', () => {
    const message = 'Info';
    service.showInfoMessage(message);
    expect(rbnMessageService.showInfo).toHaveBeenCalled();
  });

  it('should call showWarnMessage', () => {
    const message = 'Warning';
    service.showWarnMessage(message);
    expect(rbnMessageService.showWarn).toHaveBeenCalled();
  });

  it('should call showSuccessMessage', () => {
    const message = 'Successfully';
    service.showSuccessMessage(message);
    expect(rbnMessageService.showSuccess).toHaveBeenCalled();
  });

  it('should call clearToastMessage', () => {
    service.clearToastMessage();
    expect(rbnMessageService.clear).toHaveBeenCalled();
  });
});
