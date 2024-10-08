export interface IProvisioningGWCInfoRes {
  unit0ID: string;
  unit0IPAddr: string;
  unit0Port: number;
  unit1ID: string;
  unit1IPAddr: string;
  unit1Port: number;
}

export interface IProvisioningLinesRes {
  count: number;
  epData: IProvisioningLinesData[];
}

export interface IProvisioningLinesData {
  gwcID: string;
  gatewayName: string;
  gwHostname: string;
  gwDefaultDomain: string;
  endpointName: string;
  extNodeNumber: number;
  extTerminalNumber: number;
  endpointStatus: string;
  iid: number;
  endpointTNType: number;
}

export interface IProvisioningLinesTableData {
  endpointName: string;
  gatewayName: string;
  gwDefaultDomain: string;
  extNodeNumber: number;
  extTerminalNumber: number;
  endpointTNType: string;
}

export interface IProvisioningLinesResponseData {
  endpointName: string;
  gatewayName: string;
  gwDefaultDomain: string;
  extNodeNumber: number;
  extTerminalNumber: number;
  endpointTNType: number;
}

export interface EndpointType {
  [key: number]: string;
}

export const mapEndpointTNType: EndpointType = {
  0: 'undefined(0)',
  1: 'bri(1)',
  2: 'pots(2)',
  3: 'ebs(3)',
  4: 'pri(4)',
  5: 'isup(5)',
  6: 'strunk(6)'
};
