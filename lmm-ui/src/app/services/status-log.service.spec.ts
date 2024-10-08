import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CommonService } from './common.service';
import { StatusLogService } from './status-log.service';
import { RbnMessageService } from 'rbn-common-lib';
import { MessageService } from 'primeng/api';
import { IStatusLog } from '../types';

// Define a mock TranslateLoader
export class TranslateLoaderMock implements TranslateLoader {
  getTranslation(lang: string): any {
    return {};
  }
}

describe('StatusLogService', () => {
  let statusLogService: StatusLogService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        StatusLogService,
        CommonService,
        RbnMessageService,
        MessageService
      ]
    });

    statusLogService = TestBed.inject(StatusLogService);
    commonService = TestBed.inject(CommonService);
  });

  it('should push logs', () => {
    const message = 'Test log message';
    const currentTime = new Date().getTime().toString();
    spyOn(commonService, 'getCurrentTime').and.returnValue(currentTime);

    statusLogService.pushLogs(message);

    expect(statusLogService.logs.length).toBe(1);
    expect(statusLogService.logs[0].message).toBe(message);
    expect(statusLogService.logs[0].time).toBe(currentTime);
  });

  it('should clear all logs', () => {
    statusLogService.logs = [
      { message: 'Log 1', time: '12345' },
      { message: 'Log 2', time: '67890' }
    ] as IStatusLog[];
    statusLogService.clearAllLogs();

    expect(statusLogService.logs.length).toBe(0);
  });

  it('should emit changesLogs$ when logs are pushed', () => {
    const message = 'Test log message';
    spyOn(statusLogService.changesLogs$, 'next');

    statusLogService.pushLogs(message);

    expect(statusLogService.changesLogs$.next).toHaveBeenCalledWith(statusLogService.logs);
  });

  it('should emit changesLogs$ when logs are cleared', () => {
    statusLogService.logs = [
      { message: 'Log 1', time: '12345' },
      { message: 'Log 2', time: '67890' }
    ] as IStatusLog[];
    spyOn(statusLogService.changesLogs$, 'next');

    statusLogService.clearAllLogs();

    expect(statusLogService.changesLogs$.next).toHaveBeenCalledWith(statusLogService.logs);
  });
});
