export interface IGwControllersListResponseInfo {
  community: string;
  contextID: string;
  contextName: string;
  devEquipmentName: string;
  devType: string;
  devicePort: string;
  ipAddress: string;
  mpModel: string;
  retryCount: string;
  securityLevel: string;
  securityModel: string;
  timeout: string;
}
export interface IGwUnitsInfo {
  unit0ID: string;
  unit0IPAddr: string;
  unit0Port: number;
  unit1ID: string;
  unit1IPAddr: string;
  unit1Port: number;
}

export interface IStatusDataResponse {
  adminState: string;
  usageState: string;
  operState: string;
  standbyState: string;
  activityState: string;
  swactState: string;
  isolationState: string;
  alarmState: string;
  availState: string;
  faultState: string;
  readyState: string;
  haState: string;
}
export interface GWCNode {
  gwcId: string;
  callServer: {
    name: string;
    cmMsgIpAddress: string;
  };
  elementManager: {
    ipAddress: string;
    trapPort: number;
  };
  serviceConfiguration: {
    gwcNodeNumber: number;
    activeIpAddress: string;
    inactiveIpAddress: string;
    unit0IpAddress: string;
    unit1IpAddress: string;
    gwcProfileName: string;
    capabilities: Capability[];
    bearerNetworkInstance: string;
    bearerFabricType: string;
    codecProfileName: string;
    execDataList: ExecData[];
    defaultGwDomainName: string;
  };
  deviceList: any[];
}

export interface GWCNodeResponse {
  count: number;
  nodeList: GWCNode[];
}

export interface Capability {
  capability: {
    __value: number;
  };
  capacity: number;
}

export interface ExecData {
  name: string;
  termtype: string;
}

export interface GWCNodeKey {
  [key: number]: string;
}

export const gwcNodeCapability: GWCNodeKey = {
  1: 'Lines',
  2: 'Trunks',
  3: 'Audio',
  4: 'Anchor Packet Gateway',
  5: 'DPT',
  6: 'Dynamic Quality of Service',
  7: 'Small Gateways',
  8: 'Large Gateways',
  9: 'Audio Gateways',
  10: 'APG Gateways',
  11: 'SIPT',
  12: 'VRDN',
  13: 'RA',
  14: 'BCT',
  15: 'IP Security',
  16: 'Kerberos',
  17: 'V5.2',
  18: 'Conferences',
  19: 'Announcements',
  20: 'RMGC Gateways',
  21: 'H.323',
  22: 'DPL',
  23: 'VoIP VPN'
};

export const gwcNodeUnits: GWCNodeKey = {
  1: 'ports',
  2: 'ports',
  3: 'ports',
  4: 'ports',
  5: 'ports',
  6: 'connections',
  7: 'gateways',
  8: 'gateways',
  9: 'gateways',
  10: 'gateways',
  11: ' ',
  12: ' ',
  13: ' ',
  14: ' ',
  15: ' ',
  16: ' ',
  17: ' ',
  18: ' ',
  19: ' ',
  20: 'gateways',
  21: 'ports',
  22: ' ',
  23: ' '
};

export interface IControllerProfileTable {
  capability: string;
  capacity: number;
  units: string;
}

export interface GatewayDataSearchResponse {
  count: number;
  gwData: IProvisioningGatewaysTable[];
}

export interface IProvisioningGatewaysTable {
  gwcID: string;
  name: string;
  ipAddress: string;
  mgcsecipAddress: string;
  secipAddress: string;
  profileName: string;
  maxTerms: number;
  resTerms: number;
  protocol: string;
  protVers: string;
  protPort: number;
  pepServerName: string;
  middleBoxName: string;
  algName: string;
  nodeName: string;
  nodeNumber: number;
  frame: string;
  shelf: string;
  slot: string;
  locality: string;
  cac: number | string;
  defaultDomainName: string;
  lgrptype: string;
  isShared: string;
  extStTerm: number;
}

export interface IConfirm {
  title: string;
  content: string;
  isShowConfirmDialog: boolean;
  titleAccept: string;
  titleReject: string;
  handleAccept: (isAccept: boolean) => void;
}

export interface IDisassociateDeleteNodeResponse {
  operation: {
    __value: number;
  };
  rc: {
    __value: number;
  };
  responseMsg: string;
  responseData: {
    ___gwcResp: any;
    ___gwcListResp: any;
    ___gwcPListResp: any;
    ___mgResp: any;
    ___mgListResp: any;
    ___a_MGResp: any;
    ___no_data: string;
    ___siteListResp: any;
    ___a_GWResp: any;
    ___c_MGResp: any;
    ___bearnetsListResp: any;
    ___lineEPListResp: any;
    __discriminator: {
      __value: number;
    };
    __uninitialized: boolean;
  };
}

export interface DetailDynamicDialog {
  title: string;
  rows: { label: string; value: string }[];
  subtitle?: string;
  subRows?: { label: string; value: string }[];
}

export interface IGwApplicationData {
  globalId: number;
  keyValuePairs: { name: string; value: string }[];
}

export interface IGwCapacity {
  name: string;
  owner: string;
  maxEndpoints: number;
  typeList: string[];
  category: {
    __value: number;
  };
  gwcProfileNumber: number;
  compatibleGWProfiles: string[];
  supportedProtocols: {
    protocol: {
      __value: number;
    };
    port: number;
    version: string;
  }[];
  endpointType: {
    __value: number;
  };
  inventoryType: string;
  inventoryRole: string;
  bearerFabricRestList: any[];
  generateLGRP: string;
  resvTermMandatory: string;
  changeIPAvailable: string;
  dispPhyLocation: string;
  multiSiteNamesSupported: string;
  fqdnSupported: string;
  gwAppDataDefinitionList: any[];
  lgrpType: string;
  lgrpSize: number;
  solutionRestList: any[];
}

export interface ILgrpType {
  name: string;
  owner: string;
  maxEndpoints: number;
  typeList: string[];
  category: {
    __value: number;
  };
  gwcProfileNumber: number;
  compatibleGWProfiles: string[];
  supportedProtocols: {
    protocol: {
      __value: number;
    };
    port: number;
    version: string;
  }[];
  endpointType: {
    __value: number;
  };
  inventoryType: string;
  inventoryRole: string;
  bearerFabricRestList: any[];
  generateLGRP: string;
  resvTermMandatory: string;
  changeIPAvailable: string;
  dispPhyLocation: string;
  multiSiteNamesSupported: string;
  fqdnSupported: string;
  gwAppDataDefinitionList: any[];
  lgrpType: string;
  lgrpSize: number;
  solutionRestList: any[];
}

export interface ILblProfileData {
  identifier: string;
  serviceTypes: ServiceType[];
  category: ServiceType;
  maxRsvdEndpoints: number;
  gwcProfileNumber: number;
}
export interface ServiceType {
  __value: number;
}

export const defaultPostBody = {
  ipAddress: '',
  mgcsecipAddress: '',
  secipAddress: '',
  nodeName: '',
  nodeNumber: -99,
  protocol: {
    protocol: 0,
    port: -99,
    version: ''
  },
  profileName: '',
  pepServerName: '',
  middleBoxName: '',
  itransRootMiddleboxNames: [],
  algName: '',
  reservedEndpoints: -99,
  physicalMG: '',
  neId: -99,
  subnetManagerId: '',
  otherInfo: '',
  frame: '',
  shelf: '',
  slot: '',
  locality: '',
  cac: -1,
  defaultDomainName: '',
  applicationData: [],
  lgrpType: '',
  isShared: '',
  extStTerm: -99
};

export function resetDefaultPostBody() {
  Object.assign(defaultPostBody, {
    ipAddress: '',
    mgcsecipAddress: '',
    secipAddress: '',
    nodeName: '',
    nodeNumber: -99,
    protocol: {
      protocol: 0,
      port: -99,
      version: ''
    },
    profileName: '',
    pepServerName: '',
    middleBoxName: '',
    itransRootMiddleboxNames: [],
    algName: '',
    reservedEndpoints: -99,
    physicalMG: '',
    neId: -99,
    subnetManagerId: '',
    otherInfo: '',
    frame: '',
    shelf: '',
    slot: '',
    locality: '',
    cac: -1,
    defaultDomainName: '',
    applicationData: [],
    lgrpType: '',
    isShared: '',
    extStTerm: -99
  });
}

export interface Protocol {
  protocol: {
    __value: number;
  };
  port: number;
  version: string;
}

export interface ApplicationData {
  name: string;
  value: string;
}

export interface Configuration {
  ipAddress: string;
  mgcsecipAddress: string | null;
  secipAddress: string | null;
  nodeName: string;
  nodeNumber: number;
  protocol: Protocol;
  profileName: string;
  pepServerName: string;
  middleBoxName: string;
  itransRootMiddleboxNames: string[];
  algName: string;
  reservedEndpoints: number;
  physicalMG: string;
  neId: number;
  subnetManagerId: string;
  otherInfo: string;
  frame: string;
  shelf: string;
  slot: string;
  locality: string;
  cac: number;
  defaultDomainName: string;
  applicationData: ApplicationData[];
  lgrpType: string;
  isShared: string;
  extStTerm: number;
}

export interface Gateway {
  gwcId: string;
  gatewayName: string;
  configuration: Configuration;
}

export interface GatewayListResponse {
  count: number;
  gatewayList: Gateway[];
}

export enum ACTION_TYPES {
  CHANGE_PROFILE = 1
}

export const gwcCapability: GWCNodeKey = {
  1: 'LINES',
  2: 'TRUNKS',
  3: 'AUDIO',
  4: 'APG',
  5: 'DPT',
  6: 'DQOS',
  7: 'Small GWs',
  8: 'Large GWs',
  9: 'Audio GWs',
  10: 'APG GWs',
  11: 'SIPT',
  12: 'VRDN',
  13: 'RA',
  14: 'BCT',
  15: 'IPSEC',
  16: 'KERBEROS',
  17: 'V522',
  18: 'CONFERENCES',
  19: 'ANNOUNCEMENTS',
  20: 'RMGC GWs',
  21: 'H.323'
};

export interface IAddGwcOptions {
  controllerName: string[];
  gwcProfiles: string[];
  codecProfiles: string[];
}

export interface IGwCapacityList {
  name: string;
}
export interface GatewayInformationOptions {
  gatewayControllerName: string[];
  gatewayProfileName: string[];
  siteName: string[];
}

export interface IMultiSiteSelection {
  name: string;
}

interface ProtocolValue {
  __value: number;
}
export interface SupportedProtocols {
  port: number;
  protocol: ProtocolValue;
  version: string;
}

export interface ProtocolInfo {
  protocolType: string;
  protocolPort: string;
  protocolValue: number;
  version?: string;
}

export const protocolInfoList: ProtocolInfo[] = [
  { protocolValue: 1, protocolType: 'NCS (1)', protocolPort: '2427' },
  { protocolValue: 2, protocolType: 'ASPEN (2)', protocolPort: '2427' },
  { protocolValue: 3, protocolType: 'DSMCC (3)', protocolPort: '13818' },
  { protocolValue: 4, protocolType: 'MEGACO (4)', protocolPort: '2944' },
  { protocolValue: 5, protocolType: 'MGCP (5)', protocolPort: '2427' },
  { protocolValue: 6, protocolType: 'H.323 (6)', protocolPort: '' },
  { protocolValue: 7, protocolType: 'TGCP (7)', protocolPort: '2427' },
  { protocolValue: 8, protocolType: 'GCP (8)', protocolPort: '7060' }
];

export const serviceTypeMapping: GWCNodeKey = {
  0: 'Line',
  1: 'Trunk',
  2: 'Audio',
  3: 'APG',
  4: 'DQOS',
  5: 'ITRANS',
  6: 'H323',
  7: 'ITRANS_ROAM',
  8: 'ALG',
  9: 'VOIP_VPN'
};

export const categoryMapping: GWCNodeKey = {
  0: 'Niltype',
  1: 'Large',
  2: 'Small',
  3: 'Audio',
  4: 'APG'
};
export interface IMultiSide {
  timeout: number;
  selectedSiteNames: string[];
}

export interface IAssociateRequestBody{
  tag: string,
  value: string
}

export enum EOperationName {
  ALG = 'Change ALG',
  PEP_SERVER = 'Change Pep Server',
  GATEWAY_CAPACITY = 'Change Gateway Capacity',
  PROFILE = 'Change Profile',
  LGRP_TYPE = 'Change Gateway LGRP Type',
  GR_834 = 'Change GR-834 Gateway',
  IP_ADDRESS = 'Change Gateway IP Address',
  SIGNALING = 'Change Signaling Gateway',
  LBL_INFO = 'Change LBL Info',
  REMOVE_LBL = 'Remove LBL Info',
  PROFILE_BULK = 'Change Profile Multi'
}

export enum EMaintenanceState {
  GWC_NOT_FOUND = 'could not be found in the database',
  UNKNOWN_STATE = '<unknown>',
  IN_SERVICE = 'inService(1)',
  OUT_OF_SERVICE = 'outOfService(2)',
  ACTIVE_UNIT = 'active(1)'
}

export enum EOverallStatus {
  InService = 'In Service',
  OutOfService = 'Out Of Service',
  Degraded = 'Degraded',
  Unknown = '<unknown>'
}

export enum EStatusProfileChange {
  SUCCESS = `Profile change successful.\n
  \nPlease perform bsy/rts action on this GWC\n
  in order for the change to take effect.`,
  RC_0 = `\nWarning: RMGC resource profile used for this GWC
  via GENiUS CLI must align with the profile selected in this operation.`,
  RC_56 = 'Profile change failed registration with the XA-Core.',
  RC_57 = 'Profile change failed registration with the GWCEM.',
  RC_58 = 'Profile change failed registration with the Service Broker.',
  RC_59 = 'Profile change failed rollback.',
  RC_4 = 'Precheck failed!',
  RC_108 = 'Flow through GWC data to MCS failed!'
}
