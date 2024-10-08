export interface IPermissionInfo {
  principals: { name: string }[]
  readOnly: boolean
  publicCredentials: any[]
  privateCredentials: any[]
}
