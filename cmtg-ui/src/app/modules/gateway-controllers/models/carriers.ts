export interface IProvisioningGWCInfoRes {
  unit0ID: string;
  unit0IPAddr: string;
  unit0Port: number;
  unit1ID: string;
  unit1IPAddr: string;
  unit1Port: number;
}

export interface IProvisioningCarriersRes {
  count: number;
  crData: IProvisioningCarriersData[];
}

export interface IProvisioningCarriersData {
  gatewayName: string;
  gwHostname: string;
  gwDefaultDomain: string;
  carrierName: string;
  nodeNo: number;
  firstTn: number;
  noOfPorts: number;
  v52InterfaceId?: number;
  v52LinkId?: number;
  v5UALinkId?: number;
  priInterfaceId: number;
  priIUAInterfaceId: number;
  dataExpand: [];
}

export interface IProvisioningCarriersTableData {
  gatewayName: string;
  gwHostname: string;
  gwDefaultDomain: string;
  carrierName: string;
  nodeNo: number;
  firstTn: number;
  noOfPorts: number;
  v52InterfaceId?: number | string;
  v52LinkId?: number | string;
  v5UALinkId?: number | string;
  priInterfaceId: number | string;
  priIUAInterfaceId: number | string;
}

export interface IProvisioningDisplayCarriersRes {
  count: number;
  epData: IProvisioningDisplayCarriersTableData[];
}

export interface IProvisioningDisplayCarriersTableData {
  gwcID?: string;
  gatewayName?: string;
  gwHostname?: string;
  gwDefaultDomain?: string;
  endpointName: string;
  extNodeNumber?: number;
  extTerminalNumber: number;
  endpointStatus?: string;
  iid?: number;
  endpointTNType?: number;
}
export interface IProvisioningGetNodeNumberRes {
  count: number;
  nodeList: IProvisioningGetNodeNumberData[];
}

export interface IProvisioningGetNodeNumberData {
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

export interface IProvisioningDeleteCarrierData {
  gatewayName: string;
  carrierName: string;
}

export interface CarrierErrorType {
  [key: number]: string | null ;
}

export const mapCarrierErrorType: CarrierErrorType = {
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: 'Error processing carrier operation.',
  8: 'Carrier operation timed out.',
  9: 'Trunks are in service.'
};
