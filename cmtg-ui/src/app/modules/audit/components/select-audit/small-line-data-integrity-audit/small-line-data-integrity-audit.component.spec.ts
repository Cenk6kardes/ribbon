import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallLineDataIntegrityAuditComponent } from './small-line-data-integrity-audit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditModule } from '../../../audit.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/shared/http-loader-factory';
import TRANSLATIONS_EN from '../../../../../../assets/i18n/cmtg_en.json';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { AuditSubjectService } from '../../../services/audit-subject.service';

describe('SmallLineDataIntegrityAuditComponent', () => {
  let component: SmallLineDataIntegrityAuditComponent;
  let fixture: ComponentFixture<SmallLineDataIntegrityAuditComponent>;
  const translateService = {
    translateResults: {
      AUDIT: TRANSLATIONS_EN.AUDIT
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmallLineDataIntegrityAuditComponent],
      imports: [
        SharedModule,
        AuditModule,
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        { provide: TranslateInternalService, useValue: translateService },
        { provide: AuditSubjectService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SmallLineDataIntegrityAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
