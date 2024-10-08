export enum EDataIntegrity {
  C20_DATA_INTEGRITY_AUDIT = 'C20 Data Integrity Audit',
  LINE_DATA_INTEGRITY_AUDIT = 'Line Data Integrity Audit',
  TRUNK_DATA_INTEGRITY_AUDIT = 'Trunk Data Integrity Audit',
  V52_DATA_INTEGRITY_AUDIT = 'V5.2 Data Integrity Audit',
  SMALL_LINE_DATA_INTEGRITY_AUDIT = 'Small Line Data Integrity Audit'
}

export const CTypeDataIntegrity = {
  c20DataIntegrityAudit: {
    stateUrl: 'c20-data-integrity',
    type: EDataIntegrity.C20_DATA_INTEGRITY_AUDIT
  },
  lineDataIntegrityAudit: {
    stateUrl: 'line-data-integrity',
    type: EDataIntegrity.LINE_DATA_INTEGRITY_AUDIT
  },
  trunkDataIntegrityAudit: {
    stateUrl: 'trunk-data-integrity',
    type: EDataIntegrity.TRUNK_DATA_INTEGRITY_AUDIT
  },
  V52DataIntegrityAudit: {
    stateUrl: 'v52-data-integrity',
    type: EDataIntegrity.V52_DATA_INTEGRITY_AUDIT
  },
  smallLineDataIntegrityAudit: {
    stateUrl: 'small-line-data-integrity',
    type: EDataIntegrity.SMALL_LINE_DATA_INTEGRITY_AUDIT
  }
};

export const CSidebarPathAudit = {
  c20DataIntegrityAudit: 'audit/' + CTypeDataIntegrity.c20DataIntegrityAudit.stateUrl,
  lineDataIntegrityAudit: 'audit/' + CTypeDataIntegrity.lineDataIntegrityAudit.stateUrl,
  trunkDataIntegrityAudit: 'audit/' + CTypeDataIntegrity.trunkDataIntegrityAudit.stateUrl,
  currentAudit: 'audit/current-audit',
  scheduledAudits: 'audit/scheduled-audits',
  V52DataIntegrityAudit: 'audit/v52-data-integrity',
  smallLineDataIntegrityAudit: 'audit/' + CTypeDataIntegrity.smallLineDataIntegrityAudit.stateUrl
};

export const C20AuditComponentOptions = [
  { label: 'C20 call server data integrity audit', value: 'C20', type: 4, disabled: false },
  { label: 'AS data integrity audit', value: 'MCS', type: 5, disabled: false }
];

export const COptionsLineDataIntegrity = [
  { name: 'Integrity Audit', value: 'Integrity Audit' },
  { name: 'Fragmentation', value: 'Fragmentation' }
];

export interface IPutAudit {
  returnCode: boolean
  numProblemsRecorded: number,
  notFoundAuditName?: '';
}

export interface INodeNameNumber {
  count: number
  list: [
    {
      gwcID: string
      nodeName: string
      nodeNN: number
      nodeType: string
    }
  ]
}

export interface IGranularLineTree {
  type: number
  gwcId: string
  gwName: string
}

export enum EGranularLineType {
  LGRP = 2,
  SmallLine = 0,
  LargeLine = 1
}

export const CGranularLineTreeInitData = {
  key: '0',
  label: 'Granular Line Audit',
  children: [
    {
      key: '0-0',
      label: 'GWC',
      children: [
        {
          key: '0-0-0',
          label: 'Small Line',
          children: [
          ]
        },
        {
          key: '0-0-1',
          label: 'Large Line',
          children: [
          ]
        }
      ]
    },
    {
      key: '0-1',
      label: 'LGRP',
      children: [
      ]
    }
  ]
};

export interface IAuditState {
  auditProcess: string
  proportion: number
  completed: number
}

export enum ERunAuditSumary {
  STATE = 'State',
  START_TIME = 'Start Time',
  END_TIME = 'End Time',
  TOTAL_TIME = 'Total Time',
  PROBLEM_FOUND = 'Problem Found'
}

export interface IAuditSumary {
  showAuditSummary: boolean,
  auditName: string,
  progressBarData: IProgressBarData,
  summary: { label: string, value: any }[]
}

export interface IProgressBarData {
  proportionProgressBar: number,
  auditProcessTitle: string,
  completed: number,
}

export const C20DataIntegrityType = 3;
export const DefaultTypePutAudit = 0;

export interface IGroupedKeysLargeLineNode {
  [key: string]: IGranularLineTree[]
}

export interface IConfirmRunAudit {
  title: string
  content: string
  isShowConfirmDialog: boolean
  titleAccept: string
  titleReject: string
  handleAccept: (isAccept: boolean) => void
  hideReject?: boolean
}

export interface IAuditConfig {
  enabled: boolean
  timeToRun: string
  once: boolean
  daily: boolean
  weekly: boolean
  monthly: boolean
  sunday: boolean
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  day: string
  interval: number
  granularAuditData: IGranularAuditData
}

export interface IGranularAuditData {
  data: {
    data: string, type: number
  }[],
  type: number
  count: number
  options: number
}

export const daysOfTheWeekOptionsData = [
  { 'label': 'Monday', 'value': 'Monday' }, { 'label': 'Tuesday', 'value': 'Tuesday' }, { 'label': 'Wednesday', 'value': 'Wednesday' },
  { 'label': 'Thursday', 'value': 'Thursday' }, { 'label': 'Friday', 'value': 'Friday' }, { 'label': 'Saturday', 'value': 'Saturday' },
  { 'label': 'Sunday', 'value': 'Sunday' }
];

export const keyDaysOfTheWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const EScheduleType = {
  OnceTimeOnly: 'OnceTimeOnly',
  Daily: 'Daily',
  Weekly: 'Weekly',
  Monthly: 'Monthly',
  Now: 'Now'
};

export const EScheduledAuditsFrequency = {
  OnceTimeOnly: 'Once',
  Daily: 'Daily',
  Weekly: 'Weekly',
  Monthly: 'Monthly'
};

export const CAuditConfigInit = {
  enabled: true,
  timeToRun: '',
  once: false,
  daily: false,
  weekly: false,
  monthly: false,
  sunday: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  day: '',
  interval: 1,
  granularAuditData: {
    data: [],
    type: 0,
    count: 0,
    options: 0
  }
};

export interface IDialogConfirm {
  title: string,
  content: string,
  isShowConfirmDialog: boolean,
  titleAccept: string,
  titleReject: string,
  data?: any
}

export interface IReportList {
  reportName: string,
  reportType: {
    __value: number
  },
  fileURL: string,
  fileSize: number
}

export interface IAuditReport {
  problemID: number,
  status: {
    __value: number
  },
  problemDescription: string,
  possibleActions: {
    correctiveAction: number,
    correctiveTitle: string,
    correctiveDescription: string,
  }[],
}

export interface IAuditReportMap {
  problemID: string,
  status: {
    __value: number
  },
  problemDescription: string,
  possibleActions: {
    correctiveAction: number,
    correctiveTitle: string,
    correctiveDescription: string,
  }[],
  children?: Array<any>,
  index: string,
  statusText: string
}

export enum EStatusTextReport {
  PROBLEM_EXISTS = 'Problem Exists',
  PROBLEM_CORRECTED = 'Problem Corrected',
  CORRECTION_FAILED = 'Correction Failed',
  UNKNOWN = 'Unknown'
}

export interface ICurrentAudit {
  auditName: string
  startTime: string
  userID: string
  host: string
  auditProcess: string
  completionState: number | string
}

export interface IScheduledAudit {
  auditType: string
  frequency: string
  day: string
  time: string
  scheduleDefault: IAuditConfig | undefined
}

export const CExportReportFileOption = [
  { label: 'Export txt', value: 'EP_TXT' },
  { label: 'Export csv', value: 'EP_CSV' }
];

export const CInitAuditProcessTitle = 'AuditIdle';

export const CReportsAuditTakeActions = [
  EDataIntegrity.C20_DATA_INTEGRITY_AUDIT,
  EDataIntegrity.V52_DATA_INTEGRITY_AUDIT,
  EDataIntegrity.SMALL_LINE_DATA_INTEGRITY_AUDIT
];

export interface IGranularAuditDataOfAudit {
  auditName: string,
  granularAudit: IGranularAuditData,
  scheduleDefault: IAuditConfig
}

export interface IResDeleteMgUIName {
  operation: {
    __value: number
  },
  rc: {
    __value: number
  },
  responseMsg: string,
  responseData: {
    ___gwcResp: any,
    ___gwcListResp: any,
    ___gwcPListResp: any,
    ___mgResp: any,
    ___mgListResp: any,
    ___a_MGResp: any,
    ___no_data: string,
    ___siteListResp: any,
    ___a_GWResp: any,
    ___c_MGResp: any,
    ___bearnetsListResp: any,
    ___lineEPListResp: any,
    __discriminator: {
      __value: number
    },
    __uninitialized: boolean
  }
};
