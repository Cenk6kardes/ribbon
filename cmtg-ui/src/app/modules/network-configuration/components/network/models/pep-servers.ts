export interface IPepServer {
  name: string;
  ipAddress: string;
  boxType: number | string | null;
  maxConnections: number | null;
  protocol: number | null;
  protVersion: string;
}

export interface IEditPepServer {
  ipAddress: string;
  protVersion: string;
  maxConnections: number | null;
}
