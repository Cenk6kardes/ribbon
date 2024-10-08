export interface IDQoSConfData {
  dsField: number;
  t1Value: number;
  t2Value?: number;
  keepAliveTimer: number;
  t7Value: number;
  t8Value: number;
}

export interface IDQoSTableData {
  dsField?: string | null;
  t1Value: number | null;
  t2Value?: number | null;
  keepAliveTimer: number | null;
  t7Value: number | null;
  t8Value: number | null;
}

export interface DsFieldDataKey {
  [key: number]: string;
};

export interface DsFieldStringDataKey {
  [key: string]: number;
};

export const mapDsFieldToName: DsFieldDataKey = {
  0: 'Default (Best Effort) Forwarding - CS0 and DE (000 000)',
  8: 'Class of Service - CS1 (001000)',
  10: 'Assured Forwarding - AF11 (001010)',
  12: 'Assured Forwarding - AF12 (001100)',
  14: 'Assured Forwarding - AF13 (001110)',
  16: 'Class of Service - CS2 (010000)',
  18: 'Assured Forwarding - AF21 (010010)',
  20: 'Assured Forwarding - AF22 (010100)',
  22: 'Assured Forwarding - AF23 (010110)',
  24: 'Class of Service - CS3 (011000)',
  26: 'Assured Forwarding - AF31 (011010)',
  28: 'Assured Forwarding - AF32 (011100)',
  30: 'Assured Forwarding - AF33 (011110)',
  32: 'Class of Service - CS4 (100000)',
  34: 'Assured Forwarding - AF41 (100010)',
  36: 'Assured Forwarding - AF42 (100100)',
  38: 'Assured Forwarding - AF43 (100110)',
  40: 'Class of Service - CS5 (101000)',
  46: 'Expedited Forwarding - EF (101110)',
  48: 'Class of Service - CS6 (110000)',
  56: 'Class of Service - CS7 (111000)'
};

export const mapDsFieldToNumber: DsFieldStringDataKey = {
  'Default (Best Effort) Forwarding (000 000)': 0,
  'Class of Service - CS1 (001000)': 8,
  'Assured Forwarding - AF11 (001010)': 10,
  'Assured Forwarding - AF12 (001100)': 12,
  'Assured Forwarding - AF13 (001110)': 14,
  'Class of Service - CS2 (010000)': 16,
  'Assured Forwarding - AF21 (010010)': 18,
  'Assured Forwarding - AF22 (010100)': 20,
  'Assured Forwarding - AF23 (010110)': 22,
  'Class of Service - CS3 (011000)': 24,
  'Assured Forwarding - AF31 (011010)': 26,
  'Assured Forwarding - AF32 (011100)': 28,
  'Assured Forwarding - AF33 (011110)': 30,
  'Class of Service - CS4 (100000)': 32,
  'Assured Forwarding - AF41 (100010)': 34,
  'Assured Forwarding - AF42 (100100)': 36,
  'Assured Forwarding - AF43 (100110)': 38,
  'Class of Service - CS5 (101000)': 40,
  'Expedited Forwarding - EF (101110)': 46,
  'Class of Service - CS6 (110000)': 48,
  'Class of Service - CS7 (111000)': 56
};

