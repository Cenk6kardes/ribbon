import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageService } from 'src/app/services/storage.service';
import { PreferencesService } from 'src/app/services/preferences.service';

import { AppModule } from 'src/app/app.module';
import { PreferencesComponent } from './preferences.component';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;
  const storageService = jasmine.createSpyObj('storageService', ['setPreferences', 'preferences']);
  const preferencesService = jasmine.createSpyObj('preferencesService',
    ['getPreferences', 'doAutoRefresh', 'stopAutoRefresh', 'getPreferencesRefreshTime', 'showAutoRefreshWarning']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreferencesComponent],
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'initDropdownOption');
    component.ngOnInit();
    expect(component.initDropdownOption).toHaveBeenCalled();
    expect(preferencesService.doAutoRefresh).toHaveBeenCalled();
  });

  it('should call initDropdownOption', () => {
    component.initDropdownOption();
    expect(component.seconds).toEqual(component.setOptionSeconds(5, 60));
  });

  it('should call onHide', () => {
    spyOn(component.hidePreferences, 'emit');
    component.onHide();
    expect(component.hidePreferences.emit).toHaveBeenCalled();
  });

  it('should call onSave', () => {
    component.onSave();
    expect(preferencesService.doAutoRefresh).toHaveBeenCalled();
    expect(component.isShowPreferences).toBeFalsy();
  });

  it('should handle ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(preferencesService.stopAutoRefresh).toHaveBeenCalled();
  });
});
