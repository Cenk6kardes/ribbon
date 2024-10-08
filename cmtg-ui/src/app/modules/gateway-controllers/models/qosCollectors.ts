export interface IProvisioningGWCInfoRes {
  unit0ID: string;
  unit0IPAddr: string;
  unit0Port: number;
  unit1ID: string;
  unit1IPAddr: string;
  unit1Port: number;
}

export interface IProvisioningQoSCollectorsRes {
  count: number;
  list: IProvisioningListData[];
}

export interface IProvisioningListData {
  qosName: string;
  ipAddress: string;
  port: string;
}

export interface IProvisioningQoSCollectionStatusRes {
  qosReporting: number;
  currentBaseMetrics: number;
  rtpBaseRemoteMetrics: number;
  extraBaseMetrics: number;
  codecMetrics: number;
  rtcpxrReporting: number;
  rtcpxrBlocks: string[];
}

export interface IProvisioningAssociateDropdownData {
  selectedQosCollector: string;
}

export interface IQOSCollectors {
  qosName: string;
  ipAddress: string;
  port: string;
};

export interface IProvisioningCheckSmallLineGWCRes {
  count: number;
  nodeList: IProvisioningCheckSmallLineData[];
}

export interface IProvisioningCheckSmallLineData {
  gwcID: string;
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
    capabilities: [
      {
        capability: { __value: number };
        capacity: number;
      }
    ];
    bearerNetworkInstance: string;
    bearerFabricType: string;
    codecProfileName: string;
    execDataList: [
      {
        name: string;
        termtype: string;
      }
    ];
    defaultGwDomainName: string;
  };
  deviceList: [];
}
export interface IProvisioningFormData {
  qosReporting: boolean;
  currentBaseMetrics: boolean;
  rtpBaseRemoteMetrics: boolean;
  extraBaseMetrics: boolean;
  codecMetrics: boolean;
  rtcpxrReporting: boolean;
  disableRtcpxrNegotiation: boolean;
  localVoiceQualityMonitorMetric: boolean;
  remoteVoiceQualityMonitorMetric: boolean;
  localVoiceQualityDebugMetric: boolean;
  remoteVoiceQualityDebugMetric: boolean;
  localLossDebugMetric: boolean;
  remoteLossDebugMetric: boolean;
  localUnitStimSpecificMetric: boolean;
  localJitterDebugMetric: boolean;
  remoteJitterDebugMetric: boolean;
}
