import { Component, OnInit } from '@angular/core';
import { StatusLogService } from 'src/app/services/status-log.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { IStatusLog } from 'src/app/types';

@Component({
  selector: 'app-status-log',
  templateUrl: './status-log.component.html',
  styleUrls: ['./status-log.component.scss']
})
export class StatusLogComponent implements OnInit {
  logs: IStatusLog[] = [];
  translateResults: any = {};
  accordionOpened = false;

  constructor(
    private statusLogService: StatusLogService,
    private commonService: CommonService,
    private translateInternalService: TranslateInternalService
  ) {
    this.translateResults = this.translateInternalService.translateResults.HOME;
  }
  ngOnInit(): void {
    this.logs = this.statusLogService.logs;
    this.statusLogService.changesLogs$.subscribe({
      next: (rs) => {
        this.logs = rs;
      }
    });
  }

  clearStatusLogs() {
    this.statusLogService.clearAllLogs();
  }

  onOpen() {
    this.accordionOpened = true;
  }
  onClose() {
    this.accordionOpened = false;
  }

  handleCopy() {
    const statusLogsText = this.logs
      .map((log) => `${log.time}: ${log.message}`)
      .join('\n');
    const dummyEl = document.createElement('textarea');
    document.body.appendChild(dummyEl);
    dummyEl.value = statusLogsText;
    dummyEl.select();
    document.execCommand('copy');
    document.body.removeChild(dummyEl);
    this.commonService.showSuccessMessage(
      this.translateResults.STATUS_LOG_COPPY_SUCCESS
    );
  }
}
