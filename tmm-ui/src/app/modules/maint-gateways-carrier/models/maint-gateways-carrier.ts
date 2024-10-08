export interface IEventPickList {
  source: Array<any>,
  target: Array<any>,
  pickListName: string
}

export interface IDataCarrier {
  CarrierNames: string,
  GatewayName: string,
  GWCName: string
}

export enum ECommandKey {
  QESByGatewayName = 'QESByGatewayName',
  PostByGatewayName = 'PostByGatewayName',
  BSYByGatewayName = 'BSYByGatewayName',
  RTSByGatewayName = 'RTSByGatewayName',
  FRLSByGatewayName = 'FRLSByGatewayName',
  INBByGatewayName = 'INBByGatewayName',
  GetCarriers = 'GetCarriers',
  GetGatewayNames = 'GetGatewayNames',
  QESByCarrier = 'QESByCarrier',
  PostByCarrier = 'PostByCarrier',
  BSYByCarrier = 'BSYByCarrier',
  RTSByCarrier = 'RTSByCarrier',
  FRLSByCarrier = 'FRLSByCarrier',
  INBByCarrier = 'INBByCarrier',
  GetTrunkCllisByGatewayName = 'GetTrunkCllisByGatewayName',
  IcotTest = 'ICOTTest',
  TrunkCLLI = 'TrunkClli',
  TrunkMember = 'TrunkMember',
  PostGroupDChannelByTrunkCLLI = 'PostGroupDChannelByTrunkCLLI'
}

export const CMaintenanceByGatewayOptionsData = {
  QES_BY_GATEWAY_NAME: {
    label: 'Query Endpoint State', value: ECommandKey.QESByGatewayName
  },
  POST_BY_GATEWAY_NAME: {
    label: 'Post Endpoints', value: ECommandKey.PostByGatewayName
  },
  BSY_BY_GATEWAY_NAME: {
    label: 'Busy Endpoints (BSY)', value: ECommandKey.BSYByGatewayName
  },
  RTS_BY_GATEWAY_NAME: {
    label: 'Return Endpoints to Service (RTS)', value: ECommandKey.RTSByGatewayName
  },
  FRLS_BY_GATEWAY_NAME: {
    label: 'Force Release Endpoints (FRLS)', value: ECommandKey.FRLSByGatewayName
  },
  INB_BY_GATEWAY_NAME: {
    label: 'Installation Busy Endpoints (BSY INB)', value: ECommandKey.INBByGatewayName
  }
};

export const CMaintenanceByCarrierOptionsData = {
  QES_BY_CARRIER: {
    label: 'Query Carrier States', value: ECommandKey.QESByCarrier
  },
  POST_BY_CARRIER: {
    label: 'Post Carrier', value: ECommandKey.PostByCarrier
  },
  BSY_BY_CARRIER: {
    label: 'Busy Carrier (BSY)', value: ECommandKey.BSYByCarrier
  },
  RTS_BY_CARRIER: {
    label: 'Return Carrier to Service (RTS)', value: ECommandKey.RTSByCarrier
  },
  FRLS_BY_CARRIER: {
    label: 'Force Release Carrier (FRLS)', value: ECommandKey.FRLSByCarrier
  },
  INB_BY_CARRIER: {
    label: 'Installation Busy Carrier (BSY INB)', value: ECommandKey.INBByCarrier
  }
};

export const CQueryingShowOptions = {
  ALL_STATES: { label: 'All States', value: 'ALL' },
  ONLY_CP_DELOAD: { label: 'Only CP Deload', value: 'CPD' },
  ONLY_IDLE: { label: 'Only Idle', value: 'IDL' },
  ONLY_MANUAL_BUSY: { label: 'Only Manual Busy', value: 'MB' },
  ONLY_UNEQUIPPED: { label: 'Only Unequipped', value: 'NEQ' },
  ONLY_INSTALLATION_BUSY: { label: 'Only Installation Busy', value: 'INB' },
  ONLY_NETWORK_BUSY: { label: 'Only Network Busy', value: 'NMB' },
  ONLY_PM_BUSY: { label: 'Only PM Busy', value: 'PMB' },
  ONLY_REMOTE_BUSY: { label: 'Only Remote Busy', value: 'RMB' },
  ONLY_SYSTEM_BUSY: { label: 'Only System Busy', value: 'SB' },
  ONLY_CALL_PROCESSING_BUSY: { label: 'Only Call Processing Busy', value: 'CPB' },
  ONLY_CARRIER_FAIL: { label: 'Only Carrier Fail', value: 'CFL' },
  ONLY_LOCKOUT: { label: 'Only Lockout', value: 'LO' },
  ONLY_DELOADED: { label: 'Only Deloaded', value: 'DEL' },
  ONLY_INITIALIZE: { label: 'Only Initialize', value: 'INI' },
  ONLY_RESTRICTED_IDLE: { label: 'Only Restricted Idle', value: 'RES' },
  ONLY_SEIZED: { label: 'Only Seized', value: 'SZD' },
  ONLY_DCHANNEL_MAN_BUSY: { label: 'Only D-Channel Man Busy', value: 'DMB' },
  ONLY_DCHANNEL_FAIL: { label: 'Only D-Channel Fail', value: 'DFL' },
  ONLY_DCHANNEL_SERVICE: { label: 'Only D-Channel In Service', value: 'INS' },
  ONLY_DCHANNEL_STANDBY: { label: 'Only D-Channel Standby', value: 'STB' },
  ONLY_UNKNOWN: { label: 'Only Unknown', value: 'UNKNOWN' }
};

//
export interface ISummaryData {
  query: {
    gatewayName: ItemSummary
    maintenanceAction: ItemSummary
    endpointRange: ItemSummary
    filterState: ItemSummary
    carriers: ItemSummary
    nodeNumber: ItemSummary
  }
  state: {
    totalEndpoint: ItemSummary
    values: IStatevalues[]
  }
}
export interface ItemSummary {
  label: string
  value: string | number,
  data?: any
}

export interface ITrunkClliEvent {
  label: string
  value: string
}

export interface IStatevalues {
  Value: any
  Count: number
};
//

export interface IMaintenance {
  [key: string]: {
    Header: {
      Summary?: {
        State: any
      }
      GatewayName: string
      FilterState: string
      EndpointRange: string
      NodeNumber: number
    },
    Members?: {
      Member: Member[]
    },
    Error?: {
      Number: number
      Message: string
      Severity?: string
      Param1?: string
    }
  }
}

export interface Member {
  Error?: {
    Number: number
    Message: string
    Severity: string
  },
  TerminalNumber?: number
  TrunkMember?: number
  TrunkCLLI?: string
  TrunkDirection?: string
  TrunkSignaling?: string
  TrunkSignalingPreHtml?: string
  EndpointName?: string
  State?: string
  ConnectedTo?: string
  PMTimeSlot?: number
  TrunkType?: string
  PMCarrier?: number
  PMNumber?: number
  PMType?: string
}

export interface IGatewayNames {
  [key: string]: {
    Gateway: {
      Names: string
    }
  }
}

export interface ICarriers {
  [key: string]: {
    Carriers: {
      CarrierNames: string
      GatewayName: string
      GWCName: string
    }[]
  }
}

export type ITypeMaintenance = 'BY_CARRIER' | 'BY_GATEWAYS';

export interface IDataConfirm {
  title: string,
  content: string
}
export interface IEmitActionTable {
  endpointNumbers: string,
  action: ECommandKey
}

// constants
export const actionsHaveParamSecurityInfo: ECommandKey[] = [
  ECommandKey.PostByGatewayName,
  ECommandKey.BSYByGatewayName,
  ECommandKey.RTSByGatewayName,
  ECommandKey.FRLSByGatewayName,
  ECommandKey.INBByGatewayName,
  ECommandKey.QESByCarrier,
  ECommandKey.PostByCarrier,
  ECommandKey.BSYByCarrier,
  ECommandKey.RTSByCarrier,
  ECommandKey.FRLSByCarrier,
  ECommandKey.INBByCarrier
];

export const actionsNeedCallQESByGatewayName: ECommandKey[] = [
  ECommandKey.BSYByGatewayName,
  ECommandKey.RTSByGatewayName,
  ECommandKey.FRLSByGatewayName,
  ECommandKey.INBByGatewayName
];

export const actionsNeedCallQESByCarrier: ECommandKey[] = [
  ECommandKey.BSYByCarrier,
  ECommandKey.RTSByCarrier,
  ECommandKey.FRLSByCarrier,
  ECommandKey.INBByCarrier
];

export type IRunType = ERunType.AUTO | ERunType.QUERIES | ERunType.TABLE | ERunType.ACTIONS_TABLE;

export enum ERunType {
  TABLE = 'TABLE',
  AUTO = 'AUTO',
  QUERIES = 'QUERIES',
  ACTIONS_TABLE = 'ACTIONS_TABLE'
};

export const TableNameStorage = {
  carrierTable: 'carrierTable',
  carrierTableDetailCols: 'carrierTable_DetailCols',
  gatewaysTable: 'gatewaysTable',
  gatewaysTableDetailCols: 'gatewaysTable_DetailCols'
};

export interface ILastRunQueryData {
  command: string,
  dataBody: any[],
  sSecurityInfo: string
}
