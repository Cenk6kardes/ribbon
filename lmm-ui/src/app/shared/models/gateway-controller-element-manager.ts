export interface IGateway {
  name: string;
  ipAddress: string;
  type: string;
  extNodeNumber: number;
  protocol: string;
  protVers: string;
  protPort: number;
  heartbeat: number;
  connSel: string;
  profile: number;
  pepServerName: string;
  middleBoxName: string;
  itransRootMiddleboxNames: any[];
  algName: string;
  defaultDomainName: string;
  applicationData: any[];
};
export interface IGateWay {
  name: string;
}
export interface IGateWayController {
  gwcAlias: string;
  gwcStatus: boolean;
}
export interface IProperties {
  key: string;
  value: string;
};

export interface IEndpointSearchResult {
  epData: IEndpointDataList[]
  count: number | null;
}

export interface 	IEndpointDataList {
  gwcID: string
  gatewayName: string
  gwHostname: string
  gwDefaultDomain: string
  endpointName: string
  extNodeNumber: string
  extTerminalNumber: string
  endpointStatus: string
  iid: string
  endpointTNType: string
}

export interface ILMMLineGatewayNames {
  name: string;
};
