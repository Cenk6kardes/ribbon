export interface IDirectoryTable {
  cm_dn: string
  clli: string
  time: string
  cm_line_state: string
  endpoint_state: string
  profile: string
  [name: string]: any
  gw_address: string
  gw_name: string
  endpoint_name: string
  cm_tid: string
  cm_gwc_address: string
  getGatewayProtocol?: string // Only keep value to re-use when refresh data
}

export interface IDirectoryPostForm {
  type: string,
  postValue: string
}

export enum EDirectoryValue {
  NOT_AVAILABLE = 'Not_Available',
  LEGACY_LINE = 'Legacy_Line',
  SIPVOICE = 'SIPVOICE',
  UNSUPPORTED_GW = 'Unsupported GW',
  LOADING = 'loading...',
  EMPTY = ''
}

export interface IBulkActionsDirectory {
  label: string,
  value: string,
  description: string,
  type: number
}

export enum REFRESH_TYPE {
  ROW = 'row',
  TABLE = 'table',
  AUTO = 'auto'
}

export interface IRefreshDNEmit {
  data: Array<IDirectoryTable>,
  refreshType: REFRESH_TYPE
}

export enum CM_RC_VALUE {
  DN_NOT_EXIST = '2',
  OSSDI_TIMED_OUT = '13',
  DN_VALID = '0',
  DMA_FAULT = '14'
}

export enum DISPLAY_INFO_TYPE {
  TOAST = 'toast',
  DIALOG = 'dialog',
  LOGS = 'logs'
}

export enum POST_TYPE {
  POST_DN = 'POST_DN',
  POST_GATEWAY = 'POST_GATEWAY',
  SELECT_GATEWAY_TO_POST = 'SELECT_GATEWAY_TO_POST'
};

export const protocolsSupported = ['ncsprotocol', 'mgcp'];


export enum ACTION_TYPES {
  MAINTENANCE_TYPE = 1,
  QDN_TYPE = 2,
  QSIP_TYPE = 3,
  PROPERTIES_TYPE = 4,
  CLEAR = 5
}

export enum GWC_ADDRESS {
  ZERO = '0.0.0.0'
}

export enum SET_TYPE {
  NOT_SET = 'NOT_SET',
  NONE = '<None>'
}

export enum LINE_LIMIT {
  LIMIT = 10
}
