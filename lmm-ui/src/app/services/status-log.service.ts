import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CommonService } from './common.service';
import { IStatusLog } from '../types';

@Injectable({
  providedIn: 'root'
})
export class StatusLogService {

  logs: IStatusLog[] = [];
  public changesLogs$ = new Subject<any[]>();

  constructor(
    private commonService: CommonService
  ) {
    this.changesLogs$.next(this.logs);
  }

  pushLogs(message: string) {
    this.logs.unshift({ message: message, time: this.commonService.getCurrentTime()});
    this.changesLogs$.next(this.logs);
  }

  clearAllLogs() {
    this.logs = [];
    this.changesLogs$.next(this.logs);
  }
}
