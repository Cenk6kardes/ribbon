import { TemplateRef } from '@angular/core';

export interface ILineValidateResponseInfo {
  cm_dn: string;
  cm_len: string;
  cm_lcc: string;
  cm_tid: string;
  cm_gwc_name: string;
  cm_gwc_address: string;
  cm_clli: string;
  gw_name: string;
  gw_address: string;
  gw_type: string;
  endpoint_name: string;
  cm_rc: string;
  gw_rc: string;
};

export interface ILinePostResponseInfo {
  cm_line_state: string;
  cm_connected_party: string;
  cm_dn: string;
  endpoint_state: string;
  cm_rc: string;
  gw_rc: string;
  agcf_state: string;
};

export interface IGatewayEndpointInfo {
  epState: string;
  epInfo: string;
  op_rc: string;
  epCallState: string;
  epTerminalType: string;
  epStateDescription: string;
}

export interface ILineRequest {
  cm_clli: string;
  cm_tid: string;
  gw_name: string;
  gw_address: string;
  endpoint_name: string;
};

export interface IReportsList {
  fileDisplay: string;
  fileName: string;
  scheduled: boolean;
  scheduledText?: REPORT_TYPE;
  fileLMTimeInMillis?: string;
  fileLMTimeInMillisPreHtml?: TemplateRef<any>;
};

export interface IGeneralReport {
  gwcName: string;
  queryResult: string;
  numberOfGW: number;
};

export interface IDetailedReport {
  gwName: string;
  errorMessage: string;
};

export interface IQueryConfiguration {
  enabled: boolean;
  timeToRun: string;
  daily: boolean;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

export interface IResponseStatus {
  code: boolean;
  message: string;
}

export interface ILineMtcResponseInfo {
  mtc_rc: string;
}

export interface IQueryDirectoryNumberResponse {
  dn: string;
  type: string;
  snpa: string;
  sig: string;
  lnattidx: string;
}

export interface IPropertyDetailInfo {
  cm_dn: string;
  clli: string;
  cl_len: string;
  cm_lcc: string;
  ground_start: string;
  cm_nn: string;
  cm_tn: string;
  cm_gwc_name: string;
  cm_gwc_address: string;
  gw_name: string;
  gw_address: string;
  middle_box: string;
  alg_name: string;
  endpoint_name: string;
}

export interface IQdnQsipDetailInfo {
  cm_dn: string;
  data: any;
}

export enum REPORT_TYPE {
  SCHEDULED = 'Scheduled',
  ON_DEMAND = 'On Demand'
}
