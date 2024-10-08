export interface IRingTemplate {
  v5ringid: string;
  std: string;
  r01: string;
  r02: string;
  r03: string;
  r04: string;
  r05: string;
  r06: string;
  r07: string;
  r08: string;
  r09: string;
  r10: string;
  r11: string;
  r12: string;
  r13: string;
  r14: string;
  r15: string;
}
export interface ISigTemplate {
  v5sigid: string;
  atten: number;
  apa: boolean;
  plf: boolean;
  ds1flash: boolean;
  eoc: boolean;
  suppind: number;
  plsdur: string;
  mtrpn: boolean;
  lroa: number;
  lrosfd: boolean;
  rngtype: number;
  ssonhook: boolean;
}

export interface IInterfaceBrowser {
  siteGwcLoc: string;
  gwcId: string;
  v52InterfaceId: string;
  linkMapTable: Array<IlinkMapTable>;
  maxlinesSelector: string;
  maxlines: string;
  v5ProvRef: string;
  v5SigTableRef: string;
  v5RingTableRef: string;
}

export interface IlinkMapTable {
  linkId: string;
  epGrp: string;
}

export interface IOptionsForInterfaceBrowser {
  ringIds: Array<string>;
  provIds: Array<string>;
  sigIds: Array<string>;
  maxlinesSelector: Array<string>;
  interfaceBrowserIds: Array<string>;
}

export const AttenOptionsData = {
  NONE: {
    label: 'V5_NONE',
    value: 0
  },
  DIGITAL: {
    label: 'V5_DIGITAL',
    value: 1
  },
  ANALOG: {
    label: 'V5_ANALOG',
    value: 2
  }
};

export const SuppindOptionsData = {
  NO_SUPP: {
    label: 'NO_SUPP',
    value: 0
  },
  LE_SUPP: {
    label: 'LE_SUPP',
    value: 1
  },
  TE_SUPP: {
    label: 'TE_SUPP',
    value: 2
  },
  LE_TE_SUPP: {
    label: 'LE_TE_SUPP',
    value: 3
  }
};

export const RngtypeOptionsData = {
  C6F: {
    label: 'C6F',
    value: 0
  },
  C3D: {
    label: 'C3D',
    value: 1
  },
  C3C: {
    label: 'C3C',
    value: 2
  }
};

export const LroaOptionsData = {
  N: {
    label: 'N',
    value: 0
  },
  Y: {
    label: 'Y',
    value: 1
  },
  CHKLN: {
    label: 'CHKLN',
    value: 2
  }
};

export const TrueFalseOptions = {
  N: {
    label: 'N',
    value: false
  },
  Y: {
    label: 'Y',
    value: true
  }
};

export const CPATHOptions = [
  { label: 'CTRL', value: 'CTRL' },
  { label: 'PSTN', value: 'PSTN' },
  { label: 'ISDD', value: 'ISDD' },
  { label: 'ISDF', value: 'ISDF' },
  { label: 'ISDP', value: 'ISDP' },
  { label: 'PSET', value: 'PSET' }
];


export interface IConfirm {
  title: string;
  content: string;
  isShowConfirmDialog: boolean;
  titleAccept: string;
  titleReject: string;
  handleAccept: (isAccept: boolean) => void;
}
