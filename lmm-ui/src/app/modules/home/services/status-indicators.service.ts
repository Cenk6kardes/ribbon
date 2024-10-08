import { Injectable } from '@angular/core';
import { IStatusIndicators, Status } from 'rbn-common-lib';

@Injectable({
  providedIn: 'root'
})
export class StatusIndicatorsService {
  statusIndicators: IStatusIndicators[] = [
    { title: 'LMM Server', status: Status.UNKNOWN },
    { title: 'BMU', status: Status.UNKNOWN },
    { title: 'OSS Comms', status: Status.UNKNOWN },
    { title: 'DMA', status: Status.UNKNOWN }
  ];

  constructor() {}

  updateStatus(index: number, status: Status) {
    this.statusIndicators[index].status = status;
  }
}
