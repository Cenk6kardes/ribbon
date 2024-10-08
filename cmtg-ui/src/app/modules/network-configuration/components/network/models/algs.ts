export interface IALGs {
  'name': string,
  'ipAddress': string,
  'port': number | null,
  'protocol': number | null
};

export interface IEditSelectedALG {
  'ipAddress': string,
  'port': number | null,
  'protocol': number | null
};
