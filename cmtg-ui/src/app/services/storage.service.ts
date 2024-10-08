import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private sessionKeyName = 'sessionId';
  private userIDKey = 'userID';
  private cBMgIpKey = 'cBMgIP';
  private clliKey = 'clli';
  private preferencesKey = 'cmtg_preferences';
  private hostNameKey = 'hostName';

  private sessionIdValue = '';
  private cBMgIpValue = '';
  private clliValue = '';
  private preferencesValue: IPreferences | null;

  constructor() { }

  set sessionId(id: string) {
    sessionStorage.setItem(this.sessionKeyName, id);
    this.sessionIdValue = id;
  }

  get sessionId(): string {
    this.sessionIdValue = sessionStorage.getItem(this.sessionKeyName) || '';
    return this.sessionIdValue;
  }

  set userID(id: string) {
    sessionStorage.setItem(this.userIDKey, id);
  }

  get userID(): string {
    const userIDValue = sessionStorage.getItem(this.userIDKey) || '';
    return userIDValue;
  }

  set hostName(name: string) {
    sessionStorage.setItem(this.hostNameKey, name);
  }

  get hostName(): string {
    const name = sessionStorage.getItem(this.hostNameKey) || '';
    return name;
  }

  set cBMgIP(value: string) {
    sessionStorage.setItem(this.cBMgIpKey, value);
    this.cBMgIpValue = value;
  }

  get cBMgIP(): string {
    this.cBMgIpValue = sessionStorage.getItem(this.cBMgIpKey) || '';
    return this.cBMgIpValue;
  }

  set clli(value: string) {
    sessionStorage.setItem(this.clliKey, value);
    this.clliValue = value;
  }

  get clli(): string {
    this.clliValue = sessionStorage.getItem(this.clliKey) || '';
    return this.clliValue;
  }

  set preferences(value: any) {
    sessionStorage.setItem(this.preferencesKey, JSON.stringify(value));
    this.preferencesValue = value;
  }

  get preferences(): IPreferences | null {
    const jsonValue = sessionStorage.getItem(this.preferencesKey);
    this.preferencesValue = jsonValue ? JSON.parse(jsonValue) : null;
    return this.preferencesValue;
  }

  removeStorageData() {
    this.sessionId = '';
    sessionStorage.clear();
  }

}
