import { Injectable } from '@angular/core';
import { CmtgRestService } from 'src/app/services/api/cmtg-rest.service';
import {
  IInterfaceBrowser,
  IRingTemplate,
  ISigTemplate
} from '../models/interface-browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterfaceBrowserService {
  apiPath = environment.host + '/v5cfgmgrApi/v5cfgmgr/v1.0/';

  constructor(private cmtgRestService: CmtgRestService) {}

  getRingTemplateId() {
    const url = `${this.apiPath}v5-ring-all-template`;
    return this.cmtgRestService.getDataBody(url);
  }

  getRingTemplate(v5RingId: string) {
    const url = `${this.apiPath}v5-ring-template-list`;
    return this.cmtgRestService.postDataBody(url,v5RingId);
  }

  addNewRing(newRing: IRingTemplate) {
    const url = `${this.apiPath}v5-ring-template`;
    return this.cmtgRestService.put(url, newRing);
  }

  deleteRing(v5RingId: string) {
    const url = `${this.apiPath}v5-ring-template-delete`;
    return this.cmtgRestService.postDataBody(url,v5RingId);
  }

  modifyRing(ring: IRingTemplate) {
    const url = `${this.apiPath}v5-ring-template`;
    return this.cmtgRestService.postDataBody(url, ring);
  }

  getSigTemplateId() {
    const url = `${this.apiPath}v5-sig-all-template-sync`;
    return this.cmtgRestService.getDataBody(url);
  }

  getSigTemplate(v5sigId: string) {
    const url = `${this.apiPath}v5-sig-template-list`;
    return this.cmtgRestService.postDataBody(url, v5sigId);
  }

  addNewSig(newSig: ISigTemplate) {
    const url = `${this.apiPath}v5-sig-template`;
    return this.cmtgRestService.put(url, newSig);
  }

  modifySig(sig: ISigTemplate) {
    const url = `${this.apiPath}v5-sig-template`;
    return this.cmtgRestService.postDataBody(url, sig);
  }

  deleteSig(v5SigId: string) {
    const url = `${this.apiPath}v5-sig-template-delete`;
    return this.cmtgRestService.postDataBody(url, v5SigId);
  }

  getInterfaceBrowserTemplateID() {
    const url = `${this.apiPath}v5-all-interface`;
    return this.cmtgRestService.getDataBody(url);
  }

  getInterfaceBrowserTemplate(v5interfaceId: string) {
    const url = `${this.apiPath}v5-interface/${v5interfaceId}`;
    return this.cmtgRestService.getDataBody(url);
  }

  addNewInterfaceBrowser(v5interface: IInterfaceBrowser) {
    const url = `${this.apiPath}v5-interface`;
    return this.cmtgRestService.put(url, v5interface);
  }

  modifyInterfaceBrowser(v5interface: any, identifier: string) {
    const url = `${this.apiPath}v5-interface/${identifier}`;
    return this.cmtgRestService.postDataBody(url, v5interface);
  }

  deleteInterfaceBrowser(v5SigId: string) {
    const url = `${this.apiPath}v5-interface/${v5SigId}`;
    return this.cmtgRestService.deleteDataBody(url);
  }

  getProvTemplateId() {
    const url = `${this.apiPath}v5-prov-all-template`;
    return this.cmtgRestService.getDataBody(url);
  }

  getProvTemplate(identifier: string) {
    const url = `${this.apiPath}v5-prov-template/${identifier}`;
    return this.cmtgRestService.getDataBody(url);
  }

  addProvTemplate(newProv: any) {
    const url = `${this.apiPath}v5-prov-template`;
    return this.cmtgRestService.put(url, newProv);
  }

  modifyProvTemplate(newProv: any) {
    const url = `${this.apiPath}v5-prov-template`;
    return this.cmtgRestService.postDataBody(url, newProv);
  }

  deleteProv(provId: string) {
    const url = `${this.apiPath}v5-prov-template/${provId}`;
    return this.cmtgRestService.deleteDataBody(url);
  }
  carrierInterfaceMapping(
    gwName: string,
    carrierName: string,
    wildCard: boolean
  ) {
    const url = `${this.apiPath}carrier-interface-mapping/${gwName}/${wildCard}`;
    return this.cmtgRestService.postDataBody(url, carrierName);
  }
}
