import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CmtgRestService } from './cmtg-rest.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkViewService {
  apiPath = environment.host + '/NvApi/nv/v1.0';

  constructor(private restService: CmtgRestService) {}

  getCMCLLI(): Observable<string> {
    return this.restService.getStringDataBody(`${this.apiPath}/cm-clli`);
  }

  getAllGwc(): Observable<string> {
    return this.restService.getDataBody(`${this.apiPath}/all-gwc`);
  }

  getGatewayControllerProfiles() {
    return this.restService.getDataBody(`${this.apiPath}/available-profiles`);
  }

  getGatewayControllerProfileData(profile: string) {
    return this.restService.getDataBody(
      `${this.apiPath}/profile-data/${profile}`
    );
  }

  getProfileData(profileName: string) {
    return this.restService.getDataBody(`${this.apiPath}/gateway-profile-data/"${profileName}"`);
  }

  getAllSupportedGatewayProfiles(): Observable<string[]> {
    return this.restService.getDataBody(
      `${this.apiPath}/supported-profile-list`
    );
  }

  getGWCNames(): Observable<string[]> {
    return this.restService.getDataBody(`${this.apiPath}/all-gwc`);
  }
}
