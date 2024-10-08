export interface ITrunkClliNames {
  [key: string]: {
    TrunkClli: string[];
    Error: {
      Message: string;
      Number: number;
      Param1: string;
      Severity: string;
    };
  };
}

export enum ECommandKey {
  PostByTrunkCLLI = 'PostByTrunkCLLI',
  BSYByTrunkCLLI = 'BSYByTrunkCLLI',
  RTSByTrunkCLLI = 'RTSByTrunkCLLI',
  FRLSByTrunkCLLI = 'FRLSByTrunkCLLI',
  INBByTrunkCLLI = 'INBByTrunkCLLI'
}

export enum EErrorKey {
  NOT_VALID = 5303
}

export const CMaintenanceByTrunkClliOptionsData = {
  POST_BY_TRUNKS: {
    label: 'Post Trunks',
    value: ECommandKey.PostByTrunkCLLI
  },
  BSY_BY_TRUNKS: {
    label: 'Busy Trunks (BSY)',
    value: ECommandKey.BSYByTrunkCLLI
  },
  RTS_BY_TRUNKS: {
    label: 'Return Trunks to Service (RTS)',
    value: ECommandKey.RTSByTrunkCLLI
  },
  FRLS_BY_TRUNKS: {
    label: 'Force Release Trunks (FRLS)',
    value: ECommandKey.FRLSByTrunkCLLI
  },
  INB_BY_TRUNKS: {
    label: 'Installation Busy Trunks (BSY INB)',
    value: ECommandKey.INBByTrunkCLLI
  }
};

export interface IMaintenance {
  [key: string]: {
    Header: ITrunkResponse
    Members?: {
      Member: Member[] | Member
    }
    Error?: {
      Message: string
    }
  }
}

export interface Member {
  Error?: {
    Number: number,
    Message: string,
    Severity: string,
  },
  TrunkCLLI?: string,
  TrunkType?: string,
  ConnectedTo?: string,
  EndpointName?: string,
  GatewayName?: string,
  NodeNumber?: number,
  PMCarrier?: number,
  PMNumber?: number,
  PMTimeSlot?: number,
  PMType?: string,
  State?: string,
  TerminalNumber?: number,
  TrunkDirection?: string,
  TrunkMember?: number,
  TrunkSignaling?: string
  AdditionalInfo?: string;
  CallID?: string;
  ContinuityCondition?: string;
  TestResult?: string;
}

export interface ISupCotTest {
  [key: string]: {
    Header: ITrunkResponse;
    Members: {
      Member: Member
    };
    Error?: {
      Number: number,
      Message: string,
      Severity: string,
    };
  }
}
export interface ITrunkResponse {
  [key: string]: string;
}

export enum EBulkKey {
  PostGroupDChannelByTrunkCLLI = 'PostGroupDChannelByTrunkCLLI',
  BSYDChannelByTid = 'BSYDChannelByTid',
  RTSDChannelByTid = 'RTSDChannelByTid',
  INBDChannelByTid = 'INBDChannelByTid',
  PostByTrunkCLLI = 'PostByTrunkCLLI'
}

export const DChannelBulkActionOptionsData = {
  REFRESH: {
    label: 'Refresh',
    value: EBulkKey.PostGroupDChannelByTrunkCLLI
  },
  BSY_BY_TRUNKS: {
    label: 'Force Busy D-Channel',
    value: EBulkKey.BSYDChannelByTid
  },
  RTS_BY_TRUNKS: {
    label: 'RTS D-Channel',
    value: EBulkKey.RTSDChannelByTid
  },
  INB_BY_TRUNKS: {
    label: 'INB D-Channel',
    value: EBulkKey.INBDChannelByTid
  }
};

export const TableNameStorage = {
  generalTrunkMaintenanceTable: 'generalTrunkMaintenanceTable',
  dChannelMaintenanceTable: 'dChannelMaintenanceTable'
};

export const enum ETabIndex{
  GeneralTrunkMaintenance,
  DChannelMaintenance
}

export type IRunType = ERunType.AUTO | ERunType.QUERIES | ERunType.TABLE | ERunType.ACTIONS_TABLE;

export enum ERunType {
  TABLE = 'TABLE',
  AUTO = 'AUTO',
  QUERIES = 'QUERIES',
  ACTIONS_TABLE = 'ACTIONS_TABLE'
};
