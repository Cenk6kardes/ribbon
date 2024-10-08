// IInformationGWElement
export interface IInformationGWElement {
  identifier: string;
  profile: string;
  hardwareType: IValue;
  serviceTypes: IValue[];
  gwc: string;
  category: IValue;
  emdata: IEmdata;
  nodeName: any;
  nodeNumber: string;
  toneinfo: IToneinfo;
  maxRsvdEndpoints: any;
  other_info: any;
}

export interface IValue {
  __value: number;
}

export interface IServiceTypes {
  type: number;
}

export interface ICategory {
  category: number;
}

export interface IEmdata {
  emID: any;
  neID: any;
  subnetManagerID: any;
  physicalMG: any;
}

export interface IToneinfo {
  location: any;
  owner: any;
}

export interface IGatewayControllerData {
  identifier: string;
  cs: string;
  emID: string;
  types: string[];
  capacities: number[];
  nodeName: any;
  nodeNumber: any;
  activeIP: any;
  profile: string;
}
