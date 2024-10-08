import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ERunType, IRunType, ITrunkResponse } from '../models/maint-trunk-clli';
import { Icols } from 'rbn-common-lib';

@Injectable({
  providedIn: 'root'
})
export class MaintTrunkClliService {
  apiPath = environment.host + '/TmmApi/tmm/v1.0';
  summaryDetails = new BehaviorSubject<ITrunkResponse>({});
  tableCols = new BehaviorSubject<{trunkResponse: ITrunkResponse[], runType?: IRunType, colsDefault?: Icols[]}>({trunkResponse: []});
  refreshTable$: Subject<number> = new Subject();

  constructor() { }

  handleTableData(data: any, runType: IRunType = ERunType.QUERIES, colsDefault?: Icols[]) {
    const lastData: ITrunkResponse[] = [];
    if (data !== '' && data !== undefined) {
      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (item.Error) {
            item.State = item.Error.Message;
            delete item.Error;
            lastData.push(item);
          } else {
            lastData.push(item);
          }
        });
      } else {
        if ('Error' in data) {
          data.State = data.Error.Message;
          delete data.Error;
          lastData.push(data);
        } else {
          lastData.push(data);
        }
      }
      this.tableCols.next({trunkResponse: lastData, runType: runType, colsDefault: colsDefault});
    } else {
      this.tableCols.next({trunkResponse: []});
    }

  }

  resetSummaryAndTable() {
    this.summaryDetails.next({});
    this.handleTableData('');
  }
}
