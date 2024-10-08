import { Injectable } from '@angular/core';
import {
  C20AuditComponentOptions, C20DataIntegrityType,
  COptionsLineDataIntegrity, DefaultTypePutAudit, EDataIntegrity, EGranularLineType, IAuditConfig, IGranularAuditData
} from '../models/audit';
import { ITreeNodePickList } from 'src/app/shared/modules/tree-pick-list/models/tree-pick-list';
import { FormGroup } from '@angular/forms';
import { SideBar } from 'rbn-common-lib/lib/models/sidebar';
import momentTZ from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class AuditUtilitiesService {
  registeredAudits: string[] = [];
  itemsSideBarAudit: SideBar[] = [];
  // the timeZoneName is got from API /AuditApi/audit/v1.0/time-zone, the default value is the local computer.
  timeZoneName = momentTZ.tz.guess();
  timeFormat = 'YYYY-MM-DD HH:mm:ss [GMT]ZZ';

  constructor() { }
  getGranularAuditData(auditForm: FormGroup): IGranularAuditData {
    const getFormFieldAuditName = auditForm.get('auditName');
    const getFormFieldAuditComponent = auditForm.get('auditComponent');
    const getFormFieldAuditConfiguration = auditForm.get('auditConfiguration');
    const getFormFieldAuditConfigurationOptions = getFormFieldAuditConfiguration?.get('options');
    const getFormFieldAuditConfigurationTreePick = getFormFieldAuditConfiguration?.get('treePick');

    let dataBody: IGranularAuditData;
    const name = getFormFieldAuditName?.value;
    switch (name) {
      case EDataIntegrity.C20_DATA_INTEGRITY_AUDIT: {
        const valueComponent = getFormFieldAuditComponent?.value;
        dataBody = { data: [], type: DefaultTypePutAudit, count: 0, options: 0 };
        if (valueComponent && valueComponent.length === 1) {
          if (valueComponent[0] === C20AuditComponentOptions[0].value) {
            dataBody.data.push({ data: C20AuditComponentOptions[0].value, type: C20AuditComponentOptions[0].type });
            dataBody.type = C20DataIntegrityType;
            dataBody.count = dataBody.data.length;
            dataBody.options = 0;
          } else if (valueComponent[0] === C20AuditComponentOptions[1].value) {
            dataBody.data.push({ data: C20AuditComponentOptions[1].value, type: C20AuditComponentOptions[1].type });
            dataBody.type = C20DataIntegrityType;
            dataBody.count = dataBody.data.length;
            dataBody.options = 0;
          }
        }
      }
        break;
      case EDataIntegrity.LINE_DATA_INTEGRITY_AUDIT: {
        dataBody = { data: [], type: DefaultTypePutAudit, count: 0, options: 0 };
        const configurationOptions = getFormFieldAuditConfigurationOptions?.value as Array<string>;
        const fragmentationSelected = configurationOptions.indexOf(COptionsLineDataIntegrity[1].value) > -1;
        dataBody.options = fragmentationSelected ? 1 : 0;
        const configurationTreePick =
          getFormFieldAuditConfigurationTreePick?.value as Array<ITreeNodePickList<{ type: number }>>;
        configurationTreePick.map((itemTree) => {
          if (itemTree.data) {
            dataBody.data.push({
              data: itemTree.label,
              type: itemTree.data.type
            });
          }
        });
        dataBody.count = dataBody.data.length;
        if (dataBody.data.length > 0) {
          if (dataBody.data[0].type === EGranularLineType.SmallLine || dataBody.data[0].type === EGranularLineType.LargeLine) {
            dataBody.type = EGranularLineType.LargeLine;
          }
          if (dataBody.data[0].type === EGranularLineType.LGRP) {
            dataBody.type = EGranularLineType.LGRP;
          }
        }
      }
        break;
      case EDataIntegrity.TRUNK_DATA_INTEGRITY_AUDIT: {
        dataBody = { data: [], type: DefaultTypePutAudit, count: 0, options: 0 };
      }
        break;
      default: {
        dataBody = { data: [], type: DefaultTypePutAudit, count: 0, options: 0 };
      }
    }
    return dataBody;
  }

  isScheduledAuditAvailable(scheduledData: IAuditConfig) {
    if (scheduledData.enabled === false) {
      return false;
    }
    if (scheduledData.timeToRun) {
      const check = (scheduledData.once === false
        && scheduledData.daily === false
        && scheduledData.weekly === false
        && scheduledData.monthly === false);
      return !check;
    }
    return false;
  }
}
