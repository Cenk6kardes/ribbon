import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAuditComponent } from './summary-audit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditModule } from '../../../audit.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import TRANSLATIONS_EN from '../../../../../../assets/i18n/cmtg_en.json';
import { Router } from '@angular/router';
import { SimpleChange } from '@angular/core';

describe('SummaryAuditComponent', () => {
  let component: SummaryAuditComponent;
  let fixture: ComponentFixture<SummaryAuditComponent>;
  const translateService = {
    translateResults: {
      AUDIT: TRANSLATIONS_EN.AUDIT
    }
  };

  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryAuditComponent],
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
        { provide: TranslateInternalService, useValue: translateService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SummaryAuditComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call closeDialog case disabledBtnAbort = true', () => {
    spyOn(component.eventAbort, 'emit');
    component.disabledBtnAbort = true;
    component.closeDialog();
    expect(component.eventAbort.emit).toHaveBeenCalledWith(false);
  });

  it('should call closeDialog case disabledBtnAbort = false', () => {
    spyOn(component.eventAbort, 'emit');
    component.disabledBtnAbort = false;
    component.closeDialog();
    expect(component.eventAbort.emit).toHaveBeenCalledWith(true);
  });

  it('should closeDialog case disabledBtnAbort = false', () => {
    spyOn(router, 'navigate');
    component.doViewReport();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call ngOnchange', () => {
    const mock = { 'proportionProgressBar': 100, 'auditProcessTitle': 'label 0', 'completed': 0 };
    const changesObj1 = {
      processData: new SimpleChange(null, mock, true)
    };
    component.processData = mock;
    component.ngOnChanges(changesObj1);
    expect(component.disabledBtnAbort).toBeTrue();
  });
});
