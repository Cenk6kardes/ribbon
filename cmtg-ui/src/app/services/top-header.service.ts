import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CmtgRestService } from './api/cmtg-rest.service';

@Injectable({
  providedIn: 'root'
})
export class TopHeaderService {

  apiPath = environment.host + '/GwcemApi/gwcem/v1.0';

  constructor(private cmtgRestService: CmtgRestService) { }

  getSoftwareInfo() {
    return this.cmtgRestService.getStringDataBody(`${this.apiPath}/software-info`);
  }
}
