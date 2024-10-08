import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CmtgRestService } from 'src/app/services/api/cmtg-rest.service';
import { environment } from 'src/environments/environment';
import {
  IAssociateRequestBody,
  IGwUnitsInfo,
  IStatusDataResponse
} from '../models/gwControllers';
import { HttpParams } from '@angular/common/http';
import { IProvisioningListData, IProvisioningQoSCollectionStatusRes } from '../models/qosCollectors';

@Injectable({
  providedIn: 'root'
})
export class GatewayControllersService {
  gwcPath = environment.host + '/DataEngineApi/dataengine/v1.0';

  apiPath = environment.host + '/GwcemApi/gwcem/v1.0';

  carrierPath = environment.host + '/EndptGrpProvApi/endptGrpProv/v1.0';

  constructor(private cmtgRestService: CmtgRestService) {}

  getGwcList(): Observable<string> {
    return this.cmtgRestService.getDataBody(
      `${this.gwcPath}/topology-entries/Gateway Controller/500`
    );
  }

  getUnitStatus(gwc: string): Observable<IGwUnitsInfo> {
    return this.cmtgRestService.getDataBody(`${this.apiPath}/gwc-info/${gwc}`);
  }

  getStatusData_e(unitID: string): Observable<IStatusDataResponse> {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/status-data/${unitID}`
    );
  }

  getGWCLoadName2(gwcIP: string, fromDevice: boolean) {
    return this.cmtgRestService.getStringDataBody(
      `${this.apiPath}/gwc-load-name/${gwcIP}/${fromDevice}`
    );
  }

  getLoadNameVersion(gwcIP: string, fromDevice: boolean) {
    return this.cmtgRestService.getStringDataBody(
      `${this.apiPath}/gwc-hw-version/${gwcIP}/${fromDevice}`
    );
  }

  getGWCNodesByFilter_v1(gwc: string): Observable<any> {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/gwc-node-by-name/${gwc}`
    );
  }

  getGWCNodeByName_v1(gwc: string): Observable<any> {
    return this.cmtgRestService.getDataBody(`${this.apiPath}/gwc-node/${gwc}`);
  }

  getGWEStatistics(gwc: string): Observable<any> {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/gwc-statistics/${gwc}`
    );
  }

  getGWCMtcControlData(gwc: string): Observable<any> {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/gwc-mtc-control-data/${gwc}`
    );
  }

  postGWCMtcControlData(body: any): Observable<any> {
    const url = `${this.apiPath}/gwc-mtc-control-data`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  postConfigureGWCService(gwc: string, codecProfile: string): Observable<any> {
    const url = `${this.apiPath}/gwc-service-configuration/${gwc}/${codecProfile}/false`;
    return this.cmtgRestService.postDataBody(url);
  }

  getQueryNtwkCodecProfilesByFilter_v1(): Observable<string> {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/ntwk-codec-profile`
    );
  }

  getProfiles(gwc: string): Observable<any> {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/compatible-profiles/${gwc}`
    );
  }

  getFlowthroughStatus(profileName: string) {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/is-flowthrough-gwc/${profileName}`
    );
  }

  postControllerProfileCallAgentPanelSave(
    gwcId: number,
    clli: string,
    body: any
  ) {
    const url =
      environment.host +
      `/cs2kcfgApi/cs2kcfg/v1.0/gwc-to-cs/${clli}/${gwcId}/60`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  getGatewayDataSearchRetrive(
    gwcID: string,
    searchString: string,
    maxReturnRows: number
  ) {
    // Retrive button
    const url = `${this.apiPath}/gateway-data-search/${gwcID}/${maxReturnRows}`;
    return this.cmtgRestService.postDataBody(url, searchString);
  }

  getGatewayDataSearchRetriveAll(gwcID: string) {
    // Retrive All button
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/all-gateway-data/${gwcID}/30000`
    );
  }

  deleteDisAssocMGsync(gwName: string) {
    const url = environment.host + `/cs2kcfgApi/cs2kcfg/v1.0/mg/${gwName}/180`;
    return this.cmtgRestService.deleteDataBody(url);
  }

  deleteGWCfrmCSsync(gwcUIName: string, body: string) {
    const url =
      environment.host + `/cs2kcfgApi/cs2kcfg/v1.0/gwc-to-cs/${gwcUIName}/180`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  deleteGWCfrmCSsync_v2(gwcUIName: string, body: string) {
    const url =
      environment.host +
      `/cs2kcfgApi/cs2kcfg/v1.0/gwc-to-cs-v2/${gwcUIName}/true/180`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  getSignalingGwInfo(gwName: string) {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/signaling-gw-info/${gwName}`
    );
  }

  getGwApplicationData(gwName: string) {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/gateway-application-data/${gwName}`
    );
  }

  getGrGwName(gwName: string) {
    return this.cmtgRestService.getStringDataBody(
      `${this.apiPath}/gr834-gw-name/${gwName}`
    );
  }

  getLabMode() {
    return this.cmtgRestService.getDataBody(`${this.apiPath}/lab-mode`);
  }

  getGWCsConfiguredOnShelf(labMode: boolean) {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/gwcs-configured-on-shelf/${labMode}`
    );
  }

  addGWCtoCSsync(
    body: { gwcUnitNumber: string; profileName: string; codecProfile: string },
    gatewayDefaultDomainName: string = '',
    termTypes: string[],
    execData: string[]
  ) {
    return this.cmtgRestService.put(
      // eslint-disable-next-line max-len
      `${environment.host}/cs2kcfgApi/cs2kcfg/v1.0/gwc-to-cs/${body.gwcUnitNumber}/${body.profileName}/none/0.0.0.0/0/NET_IP/IP/${body.codecProfile}/180`,
      {
        gwDefaultDomainName: gatewayDefaultDomainName,
        addressNaturalKey: '',
        termTypes: termTypes,
        execs: execData
      }
    );
  }

  addGwctoCSsync_v2(
    body: { gwcUnitNumber: string; profileName: string; codecProfile: string },
    gatewayDefaultDomainName: string = '',
    addressNaturalKey = '',
    termTypes: string[],
    execData: string[]
  ) {
    return this.cmtgRestService.put(
      // eslint-disable-next-line max-len
      `${environment.host}/cs2kcfgApi/cs2kcfg/v1.0/gwc-to-cs-v2/${body.gwcUnitNumber}/${body.profileName}/none/0.0.0.0/0/NET_IP/IP/${body.codecProfile}/180`,
      {
        gwDefaultDomainName: gatewayDefaultDomainName,
        addressNaturalKey: addressNaturalKey,
        termTypes: termTypes,
        execs: execData
      }
    );
  }

  getAlg() {
    return this.cmtgRestService.getDataBody(`${this.apiPath}/alg`);
  }

  getPepServer() {
    return this.cmtgRestService.getDataBody(`${this.apiPath}/pep-server`);
  }

  getGwCapacity_Profiles(profileName: string) {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/gateway-profile-by-name/${profileName}`
    );
  }

  getLgrpType(gatewayName: string) {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/gateway-profile-by-name/${gatewayName}`
    );
  }

  getGrGwTypeByProfile(profileName: string) {
    return this.cmtgRestService.getStringDataBody(
      `${this.apiPath}/gr834-gw-type-by-profile/${profileName}`
    );
  }

  getGrGwNamesByType(type: string) {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/gr834-gw-names-by-type/${type}`
    );
  }

  isSupportMlt(profileName: string) {
    return this.cmtgRestService.getStringDataBody(
      `${this.apiPath}/is-support-mlt/${profileName}`
    );
  }

  isGrGwSet(gatewayName: string) {
    return this.cmtgRestService.getStringDataBody(
      `${this.apiPath}/gr834-gw-name/${gatewayName}`
    );
  }

  isLblSupported(body: string) {
    const url = `${this.apiPath}/is-lbl-supported`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  postEdit(gatewayControllerName: string, gatewayName: string, body: any) {
    const url = `${this.apiPath}/gateway/${gatewayControllerName}/${gatewayName}/false`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  saveLgrpType(gwcId: string, gatewayName: string) {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/gateways-by-filter/${gwcId}/${gatewayName}`
    );
  }

  postLgrpType(body: any) {
    const url = environment.host + '/cs2kcfgApi/cs2kcfg/v1.0/mg/60';
    return this.cmtgRestService.postDataBody(url, body);
  }

  postGrGw(gatewayName: string, body?: string) {
    const url = `${this.apiPath}/vmg-to-gr834-gw/${gatewayName}`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  postSignalingGwInfo(gwcId: string, body: any) {
    const url = `${this.apiPath}/signaling-gw-info/${gwcId}`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  getTableCache() {
    const url = environment.host + '/cs2kcfgApi/cs2kcfg/v1.0/table-cache';
    return this.cmtgRestService.getDataBody(url);
  }

  // Lines Tab
  getLinesDataRetrive(
    gwcID: string,
    searchString: string,
    maxReturnRows: number
  ) {
    // Retrive
    const url = `${this.apiPath}/endpoint-data/${gwcID}/${maxReturnRows}`;
    return this.cmtgRestService.postDataBody(url, searchString);
  }

  getLinesDataRetriveAll(ip: string) {
    // Retrive All
    return this.cmtgRestService.getDataBody(`${this.apiPath}/all-endpoint-data/${ip}`);
  }

  // Gateways Tab
  getGatewaySiteName(): Observable<string[]> {
    const url = environment.host + '/cs2kcfgApi/cs2kcfg/v1.0/table-cache';
    return this.cmtgRestService.getDataBody(url);
  }

  getGwCapacityPickList(gwcId: string, searchString: string) {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/endpoint-group-data/${gwcId}/${searchString}/-99`
    );
  }

  postGwCapacityPickList(body: any, timeout: number) {
    const url = environment.host + `/cs2kcfgApi/cs2kcfg/v1.0/mg/${timeout}`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  getTgrp(gwc: string): Observable<string[]> {
    const url = environment.host + `/cs2kcfgApi/cs2kcfg/v1.0/tgrp-cache/${gwc}`;
    return this.cmtgRestService.getDataBody(url);
  }

  getEditProfiles(gatewayName: string) {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/compatible-profile-list/${gatewayName}`
    );
  }

  // Carriers
  checkV52Supported() {
    return this.cmtgRestService.getDataBody(`${this.apiPath}/is-v52-supported`);
  }

  getCarriersDataRetrive(
    unit0Id: string,
    searchString: string,
    maxReturnRows: number
  ) {
    // Retrive
    const url = `${this.apiPath}/carrier-data/${unit0Id}/${maxReturnRows}`;
    return this.cmtgRestService.postDataBody(url, searchString);
  }

  getCarriersDataRetriveAll(unit0Id: string) {
    // Retrive All
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/all-carrier-data/${unit0Id}`
    );
  }

  getDisplayCarriersData(
    unit0Id: string,
    gatewayName: string,
    endpointName: string
  ) {
    const url = `${this.apiPath}/carrier-expansion/${unit0Id}/${gatewayName}`;
    return this.cmtgRestService.postDataBody(url, endpointName);
  }

  getNodeNumber(gwcId: string) {
    const url = `${this.apiPath}/gwc-node-by-name/${gwcId}`;
    return this.cmtgRestService.getDataBody(url);
  }

  addCarrier(body: object, gwcId: string, srvcType: number) {
    const url = `${this.apiPath}/carrier/${gwcId}/${srvcType}`;
    return this.cmtgRestService.put(url, body);
  }

  deleteCarrier(gatewayName: string, body: string) {
    // const url = `${this.apiPath}/carrier/${gwcId}/${gatewayName}`;
    const url = `${this.carrierPath}/carrier-sync/${gatewayName}/3000`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  // QoS Collectors Tab
  getQosCollectors(gwcId: string) {
    const url = `${this.apiPath}/qos-collector-filter/${gwcId}`;
    return this.cmtgRestService.getDataBody(url);
  }

  getAvailableAssociationList(gwcId: string) {
    const url = `${this.apiPath}/not-associated/${gwcId}`;
    return this.cmtgRestService.getDataBody(url);
  }

  associateQoSCollector(gwcId: string, body: IProvisioningListData) {
    const url = `${this.apiPath}/qos-collector-association/${gwcId}`;
    const params = new HttpParams();
    return this.cmtgRestService.putDataParamBody(url, params, body);
  }

  getQosCollectionStatus(gwcId: string) {
    const url = `${this.apiPath}/qos-collection-status/${gwcId}`;
    return this.cmtgRestService.getDataBody(url);
  }

  postQosCollectionStatus(gwcId: string, body: IProvisioningQoSCollectionStatusRes) {
    const url = `${this.apiPath}/qos-collection-status/${gwcId}`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  disassociateQoSCollector( gwcId: string, body: object ) {
    const url = `${this.apiPath}/qos-collector-dissacociation/${gwcId}`;
    return this.cmtgRestService.postDataBody(url, body);
  }

  getEnhRepStatus(gwcId: string) {
    const url = `${this.apiPath}/gwc-version-supported-info/${gwcId}`;
    return this.cmtgRestService.getDataBody(url);
  }

  checkRtcpxrSupported(gwcProfile: string) {
    const url = `${this.apiPath}/is-qos-collection-supported/${gwcProfile}/1`;
    return this.cmtgRestService.getDataBody(url);
  }

  getQoSCollector() {
    const url = `${this.apiPath}/qos-collector`;
    return this.cmtgRestService.getDataBody(url);
  }

  // Gateways Tab
  putAssociateMediaGateway(
    requestBody: IAssociateRequestBody[],
    timeout: number
  ) {
    const url =
      environment.host + `/cs2kcfgApi/cs2kcfg/v1.0/gw-association/${timeout}`;
    return this.cmtgRestService.put(url, requestBody);
  }

  getIpAddressProtocolPort(
    profileName: string,
    IpAddress: string,
    portNumber: string
  ) {
    return this.cmtgRestService.getDataBody(
      `${this.apiPath}/ip-address-protocol-port/${profileName}/${IpAddress}/${portNumber}`
    );
  }
}
