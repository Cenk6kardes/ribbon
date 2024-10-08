import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CmtgRestService } from 'src/app/services/api/cmtg-rest.service';
import { environment } from 'src/environments/environment';
import { IQOSCollectors } from '../components/network/models/qos-collectors';
import { HttpParams } from '@angular/common/http';
import { IALGs, IEditSelectedALG } from '../components/network/models/algs';
import { IGRGWs } from '../components/network/models/gr-gateways';
import { IEditPepServer, IPepServer } from '../components/network/models/pep-servers';
import { INtwkCodecProfileRequestData } from '../components/codec-profile/models/network-codec-profile';
import { IDQoSConfData } from '../components/codec-profile/models/dqos-configuration';

@Injectable({
  providedIn: 'root'
})
export class NetworkConfigurationService {
  apiPath = environment.host + '/GwcemApi/gwcem/v1.0';

  constructor(private cmtgRestService: CmtgRestService) { }

  // QoS Collectors
  getQoSCollectors(): Observable<any> {
    const url = `${this.apiPath}/qos-collector`;
    return this.cmtgRestService.getDataBody(url);
  }

  addQoSCollector(body: IQOSCollectors): Observable<any> {
    const url = `${this.apiPath}/qos-collector`;
    const params = new HttpParams();
    return this.cmtgRestService.putDataParamBody(url, params, body);
  }

  deleteQosCollector(force: boolean, body: IQOSCollectors): Observable<any> {
    const url = `${this.apiPath}/qos-collector-del/${force}`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  // ALG
  getAlgs() {
    const url = `${this.apiPath}/alg`;
    return this.cmtgRestService.getDataBody(url);
  }

  addAlg(body: IALGs) {
    const url = `${this.apiPath}/alg`;
    const params = new HttpParams();
    return this.cmtgRestService.putDataParamBody(url, params, body);
  }

  editAlg(body: IEditSelectedALG, algName: string) {
    const url = `${this.apiPath}/alg/${algName}`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  deleteAlg(algName: string): Observable<any> {
    const url = `${this.apiPath}/alg/${algName}`;
    return this.cmtgRestService.deleteDataBody(url);
  }

  // GR-834 GWs
  getGRGWs(): Observable<any> {
    const url = `${this.apiPath}/g6mlt-info`;
    return this.cmtgRestService.getDataBody(url);
  }

  getGWType() {
    const url = `${this.apiPath}/gr834-gw-types`;
    return this.cmtgRestService.getDataBody(url);
  }

  addGRGW(body: IGRGWs) {
    const url = `${this.apiPath}/g6mlt-info`;
    const params = new HttpParams();
    return this.cmtgRestService.putDataParamBody(url, params, body);
  }

  isGRGWUsed(name: string): Observable<any> {
    const url = `${this.apiPath}/is-gr834-gw-used/${name}`;
    return this.cmtgRestService.getDataBody(url);
  }

  deleteGRGW(force: boolean, body: IGRGWs): Observable<any> {
    const url = `${this.apiPath}/g6mlt-info-del/${force}`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  editGRGW(body: IGRGWs) {
    const url = `${this.apiPath}/g6mlt-info`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  // Pep Servers
  getPepServers(): Observable<any> {
    const url = `${this.apiPath}/pep-server`;
    return this.cmtgRestService.getDataBody(url);
  }

  addPepServer(body: IPepServer): Observable<any> {
    const url = `${this.apiPath}/pep-server`;
    const params = new HttpParams();
    return this.cmtgRestService.putDataParamBody(url, params, body);
  }

  deletePepServer(pepName: string): Observable<any> {
    const url = `${this.apiPath}/pep-server/${pepName}`;
    return this.cmtgRestService.deleteDataBody(url);
  }

  editPepServer(body: IEditPepServer, pepName: string) {
    const url = `${this.apiPath}/pep-server/${pepName}`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  // General Network Settings
  getCallAgentIP(): Observable<any> {
    const url = `${this.apiPath}/list-of-csips`;
    return this.cmtgRestService.getDataBody(url);
  }

  getGWCDomainName(): Observable<any> {
    const url = `${this.apiPath}/gwc-domain-name`;
    return this.cmtgRestService.getStringDataBody(url);
  }

  updateGWCDomainName(body: string) {
    const url = `${this.apiPath}/gwc-domain-name`;
    const params = new HttpParams();
    return this.cmtgRestService.putDataParamBody(url, params, body);
  }

  // Codec Profile //

  // Network Codec Profile

  getNtwkCodecProfile(): Observable<any> {
    const url = `${this.apiPath}/ntwk-codec-profile`;
    return this.cmtgRestService.getDataBody(url);
  }

  addNwkCodecProfile(body: INtwkCodecProfileRequestData) {
    const url = `${this.apiPath}/ntwk-codec-profile`;
    const params = new HttpParams();
    return this.cmtgRestService.putDataParamBody(url, params, body);
  }

  deleteNwkCodecProfile(profileName: string): Observable<any> {
    const url = `${this.apiPath}/ntwk-codec-profile/${profileName}`;
    return this.cmtgRestService.deleteDataBody(url);
  }

  editNwkCodecProfile(body: INtwkCodecProfileRequestData) {
    const url = `${this.apiPath}/ntwk-codec-profile`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  // DQoS Configuration
  getDQoSConf(): Observable<any> {
    const url = `${this.apiPath}/dqos-system-policy`;
    return this.cmtgRestService.getDataBody(url);
  }

  saveDQoSConf(body: IDQoSConfData): Observable<any> {
    const url = `${this.apiPath}/dqos-system-policy`;
    const params = new HttpParams();
    return this.cmtgRestService.putDataParamBody(url, params, body);
  }
}
