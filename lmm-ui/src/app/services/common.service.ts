import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';

import { RbnMessageService } from 'rbn-common-lib';
import { IRestErrorResponse } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private rbnMessageService: RbnMessageService
  ) { }

  getCurrentTime(format = 'HH:mm:ss'): string {
    return moment().format(format);
  }

  formatTime(time: Date, formatType: string): string {
    return moment(time).format(formatType);
  }

  showAPIError(httpError: HttpErrorResponse, defaultMessage = '') {
    if (!defaultMessage) {
      defaultMessage = 'Failed to perform the operation';
    }
    let error: IRestErrorResponse = httpError?.error;
    if (error && typeof(error) === 'string') {
      error = JSON.parse(error);
    }
    const mess = (error && error.message) ? error.message : defaultMessage;
    this.rbnMessageService.showError(mess);
  }

  showErrorMessage(erorMessage: string, summary?: string) {
    this.rbnMessageService.showError(erorMessage, summary);
  }

  showInfoMessage(message: string, summary?: string) {
    this.rbnMessageService.showInfo(message, summary);
  }

  showWarnMessage(message: string, summary?: string) {
    this.rbnMessageService.showWarn(message, summary);
  }

  showSuccessMessage(message: string, summary?: string) {
    this.rbnMessageService.showSuccess(message, summary);
  }

  clearToastMessage() {
    this.rbnMessageService.clear();
  }
}
