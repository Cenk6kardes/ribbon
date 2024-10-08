import { Injectable } from '@angular/core';
import { IPreferences } from '../types';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private sessionKeyName = 'sessionId';
  private userIDKey = 'userID';
  private clliKey = 'clli';
  private preferencesKey = 'tmm_preferences';

  private sessionIdValue = '';
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
