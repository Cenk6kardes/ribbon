import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodecProfileComponent } from './codec-profile.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CodecProfileComponent', () => {
  let component: CodecProfileComponent;
  let fixture: ComponentFixture<CodecProfileComponent>;
  const translate = {
    translateResults: {
      CODEC_PROFILE: {
        HEADER: {
          TITLE: 'Codec Profile',
          GENERAL_NETWORK_SETTING: 'General Network Setting'
        }
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodecProfileComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CodecProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize page header', () => {
    spyOn(component, 'initPageHeader');

    component.ngOnInit();

    expect(component.initPageHeader).toHaveBeenCalled();
    expect(component.headerData.title).toBe(
      translate.translateResults.CODEC_PROFILE.HEADER.TITLE
    );
  });

  it('should closeGeneralNetworkSettings()', () => {
    component.closeGeneralNetworkSettings();

    expect(component.showSettingsTab).toBeFalse();
  });
});
