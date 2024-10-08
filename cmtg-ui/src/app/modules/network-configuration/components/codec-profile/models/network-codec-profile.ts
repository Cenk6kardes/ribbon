export interface INcpListData {
  name: string;
  bearerPath: {
    __value: number
  };
  defaultCodec: {
    __value: number
  };
  preferredCodec: {
    __value: number
  };
  alternativeCodec: {
    __value: number
  };
  packetizationRate: {
    __value: number
  };
  t38: {
    __value: number
  };
  rfc2833: {
    __value: number
  };
  comfortNoise: {
    __value: number
  };
  bearerTypeDefault: {
    __value: number
  };
  networkDefault: {
    __value: number
  };
}

export interface INetworkCodecProfile {
  count: number;
  ncpList: INcpListData[];
}

export interface INtwkCodecProfileTableData {
  name: string;
  bearerPath: string;
  codecSelection: string;
  packetizationRate: string;
  t38: string;
  rfc2833: string;
  comfortNoise: string;
  bearerTypeDefault: string;
  networkDefault: string;
}

export interface INtwkCodecProfileRequestData {
  name: string;
  bearerPath: number;
  bearerTypeDefault: number;
  packetizationRate: number;
  t38: number;
  rfc2833: number;
  comfortNoise: number;
  networkDefault: number;
  preferredCodec: number;
  defaultCodec: number;
  alternativeCodec: number;
}

export interface IDataCodec {
  name: string
}

export interface NetworkNumberDataKey {
  [key: number]: string;
}
export interface NetworkStringDataKey {
  [key: string]: number;
}

export const mapCodecSelectionToName: NetworkNumberDataKey = {
  0: '<none>',
  1: 'PCMU',
  2: 'PCMA',
  3: 'G.726-32',
  4: 'G.729',
  5: 'AMR',
  6: 'G.723-1',
  7: 'EVRC',
  8: 'EVRC0',
  9: 'AAL2-G726-32',
  10: 'BV16',
  11: 'G726-24'
};
export const mapCodecSelectionToNumber: NetworkStringDataKey = {
  '<none>': 0,
  'PCMU' : 1,
  'PCMA': 2,
  'G.726-32': 3,
  'G.729': 4,
  'AMR': 5,
  'G.723-1': 6,
  'EVRC': 7,
  'EVRC0': 8,
  'AAL2-G726-32': 9,
  'BV16': 10,
  'G726-24': 11
};

export const mapPacketizationRateToName: NetworkNumberDataKey = {
  0: '<none>',
  1: '10 ms',
  2: '20 ms',
  3: '30 ms',
  4: '40 ms'
};

export const mapPacketizationRateToNumber: NetworkStringDataKey = {
  '<none>': 0,
  '10 ms' : 1,
  '20 ms': 2,
  '30 ms': 3,
  '40 ms': 4
};

export const mapT38ToName: NetworkNumberDataKey = {
  0: 'OFF',
  1: 'ON (Strict)',
  2: 'LOOSE'
};

export const mapT38ToNumber: NetworkStringDataKey = {
  'OFF': 0,
  'ON (Strict)' : 1,
  'LOOSE': 2
};

export const mapRfc2833andComfortNoiseToName: NetworkNumberDataKey = {
  0: 'Disabled',
  1: 'Enabled'
};

export const mapRfc2833andComfortNoiseToNumber: NetworkStringDataKey = {
  'Disabled': 0,
  'Enabled' : 1
};

export const mapBearerTypeDefaultandNetworkDefaultToName: NetworkNumberDataKey = {
  0: 'No',
  1: 'Yes',
  2: 'Disabled'
};

export const mapBearerTypeDefaultandNetworkDefaultToNumber: NetworkStringDataKey = {
  'No': 0,
  'Yes' : 1,
  'Disabled': 2
};

export const mapBearerPathToName: NetworkNumberDataKey = {
  0: '<none>',
  1: 'IP',
  2: 'AAL1',
  3: 'AAL2'
};
