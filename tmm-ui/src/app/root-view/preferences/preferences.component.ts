import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';

import { PreferencesService } from 'src/app/services/preferences.service';
import { StorageService } from 'src/app/services/storage.service';
import { IPreferences } from 'src/app/types';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit, OnDestroy {
  @Input() isShowPreferences = false;
  @Output() hidePreferences = new EventEmitter();

  seconds: SelectItem[];

  isDisabledTermination = false;
  preferences: IPreferences;

  constructor(
    private preferencesService: PreferencesService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.preferences = this.preferencesService.getPreferences();
    this.initDropdownOption();
    this.preferencesService.doAutoRefresh();
  }

  initDropdownOption() {
    this.seconds = this.setOptionSeconds(5, 60);
  }

  setOptionSeconds(start: number, end: number): SelectItem[] {
    const rs = [];
    for (let i = start; i <= end; i++) {
      const item = {
        label: i.toString(),
        value: i
      };
      rs.push(item);
    }
    return rs;
  }

  onHide() {
    this.preferences = this.preferencesService.getPreferences();
    this.hidePreferences.emit();
  }

  onSave() {
    this.storageService.preferences = this.preferences;
    this.preferencesService.doAutoRefresh();
    this.isShowPreferences = false;
  }

  ngOnDestroy(): void {
    this.preferencesService.stopAutoRefresh();
  }
}
