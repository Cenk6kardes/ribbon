import { Injectable } from '@angular/core';
import { IDirectoryPostForm, IDirectoryTable } from '../modules/home/models/home';
import { IPreferences } from '../types';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private sessionKeyName = 'sessionId';
  private cBMgIpKey = 'cBMgIP';
  private clliKey = 'clli';
  private preferencesKey = 'preferences';
  private postCommandKey = 'postCommandData';

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

  set tableDNData(data: IDirectoryTable[]) {
    sessionStorage.setItem('tableDNData', JSON.stringify(data));
  }

  get tableDNData(): IDirectoryTable[] {
    const jsonValue = sessionStorage.getItem('tableDNData');
    return jsonValue ? JSON.parse(jsonValue) : [];
  }

  set postCommandData(data: IDirectoryPostForm[]) {
    sessionStorage.setItem(this.postCommandKey, JSON.stringify(data));
  }

  get postCommandData(): IDirectoryPostForm[] {
    const jsonValue = sessionStorage.getItem(this.postCommandKey);
    return jsonValue ? JSON.parse(jsonValue) : [];
  }

  removeStorageData() {
    this.sessionId = '';
    sessionStorage.clear();
  }

}
