import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { StorageService } from 'src/app/services/storage.service';
import { PreferencesService } from 'src/app/services/preferences.service';

import { AppModule } from 'src/app/app.module';
import { PreferencesComponent } from './preferences.component';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;
  let preferences: IPreferences;
  const storageService = jasmine.createSpyObj('storageService', ['setPreferences']);
  const preferencesService = jasmine.createSpyObj('preferencesService',
    ['startWithCondition', 'startAutoTermiation', 'autoTerminationEmit$','handlePreferencesStorage']
  );
  preferencesService.autoTerminationEmit$ = new Subject<void>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferencesComponent ],
      imports: [
        HttpClientTestingModule,
        AppModule
      ],
      providers: [
        { provide: StorageService, useValue: storageService },
        { provide: PreferencesService, useValue: preferencesService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PreferencesComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();

    preferences = {
      refresh: { checked: true, second: 10 },
      termination: { checked: true, hour: 0, minute: 10 },
      cpdRequest: false
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'initDropdownOption');
    spyOn(component, 'checkTerminationValue');
    component.ngOnInit();
    expect(component.initDropdownOption).toHaveBeenCalled();
    expect(component.checkTerminationValue).toHaveBeenCalled();
  });

  it('should call ngAfterViewInit', () => {
    storageService.preferences = preferences;
    component.preferences = preferences;
    component.ngAfterViewInit();
    preferencesService.autoTerminationEmit$.next();
    expect(component.preferences.refresh.checked).toBe(false);
    expect(component.preferences.termination.checked).toBe(false);
    expect(component.isDisabledTermination).toBe(true);
  });

  it('should call initDropdownOption', () => {
    component.initDropdownOption();
    expect(component.hours).toEqual(component.setOption(9));
    expect(component.minutes).toEqual(component.setOption(59, 1));
    expect(component.seconds ).toEqual(component.setOption(56, 5));
  });

  it('should call handleHourChange', () => {
    component.preferences = preferences;
    preferences.termination.hour = 0;
    component.handleHourChange();
    expect(component.minutes).toEqual(component.setOption(59, 1));

    preferences.termination.hour = 8;
    component.preferences = preferences;
    component.handleHourChange();
    expect(component.minutes).toEqual(component.setOption(1));

    preferences.termination.hour = 1;
    component.preferences = preferences;
    component.handleHourChange();
    expect(component.minutes).toEqual(component.setOption(60));
  });

  it('should call checkTerminationValue', () => {
    preferences.refresh.checked = false;
    component.preferences = preferences;
    component.checkTerminationValue();
    expect(component.preferences.termination.checked).toBe(false);
    expect(component.isDisabledTermination).toBe(true);

    preferences.refresh.checked = true;
    component.preferences = preferences;
    component.checkTerminationValue();
    expect(component.isDisabledTermination).toBe(false);
  });

  it('should call onShow', () => {
    spyOn(component, 'checkTerminationValue');
    component.onShow();
    expect(component.checkTerminationValue).toHaveBeenCalled();
  });

  it('should call onHide', () => {
    spyOn(component.hidePreferences, 'emit');
    component.onHide();
    expect(component.hidePreferences.emit).toHaveBeenCalled();
  });

  it('should call onSave', () => {
    spyOn(component, 'handleLogsOnSave');
    storageService.preferences = preferences;
    component.onSave();
    expect(preferencesService.preferences).toEqual(null);
    expect(component.handleLogsOnSave).toHaveBeenCalled();
    expect(preferencesService.startWithCondition).toHaveBeenCalled();
    expect(component.isShowPreferences).toBeFalse();
  });

  it('should call handleLogsOnSave', () => {
    component.preferences = {
      refresh: { checked: true, second: 10 },
      termination: { checked: true, hour: 0, minute: 10 },
      cpdRequest: false
    };

    preferences.refresh.second = 5;
    component.handleLogsOnSave(preferences);

    preferences.termination.minute = 15;
    preferences.termination.hour = 1;
    component.handleLogsOnSave(preferences);

    component.preferences.refresh.checked = false;
    component.handleLogsOnSave(preferences);
  });

});
