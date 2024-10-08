import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrunkDataIntegrityAuditComponent } from './trunk-data-integrity-audit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditModule } from '../../../audit.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import TRANSLATIONS_EN from '../../../../../../assets/i18n/cmtg_en.json';
import { AuditSubjectService } from '../../../services/audit-subject.service';

describe('TrunkDataIntegrityAuditComponent', () => {
  let component: TrunkDataIntegrityAuditComponent;
  let fixture: ComponentFixture<TrunkDataIntegrityAuditComponent>;
  const translateService = {
    translateResults: {
      AUDIT: TRANSLATIONS_EN.AUDIT
    }
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrunkDataIntegrityAuditComponent],
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

    fixture = TestBed.createComponent(TrunkDataIntegrityAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});