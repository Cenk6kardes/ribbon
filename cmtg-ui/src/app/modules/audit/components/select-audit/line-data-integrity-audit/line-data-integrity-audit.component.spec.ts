import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineDataIntegrityAuditComponent } from './line-data-integrity-audit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditModule } from '../../../audit.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import TRANSLATIONS_EN from '../../../../../../assets/i18n/cmtg_en.json';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { AuditService } from '../../../services/audit.service';
import { of } from 'rxjs';
import { COptionsLineDataIntegrity } from '../../../models/audit';
import { AuditSubjectService } from '../../../services/audit-subject.service';

describe('LineDataIntegrityAuditComponent', () => {
  let component: LineDataIntegrityAuditComponent;
  let fixture: ComponentFixture<LineDataIntegrityAuditComponent>;
  const translateService = {
    translateResults: {
      AUDIT: TRANSLATIONS_EN.AUDIT,
      COMMON: TRANSLATIONS_EN.COMMON
    }
  };

  const auditFormTest = new FormGroupDirective([], []);
  auditFormTest.form = new FormGroup({
    auditName: new FormControl(),
    auditDescription: new FormControl(),
    auditConfiguration: new FormGroup({
      treePick: new FormControl(),
      options: new FormControl()
    })
  });

  const auditService = jasmine.createSpyObj('auditService', [
    'getNodeNameNumber',
    'getGranularLineTree'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineDataIntegrityAuditComponent],
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
        { provide: FormGroupDirective, useValue: auditFormTest },
        { provide: AuditService, useValue: auditService },
        { provide: AuditSubjectService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LineDataIntegrityAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  beforeAll(() => {
    auditService.getNodeNameNumber.and.returnValue(of({
      'count': 1, 'list': [{
        'gwcID': 'GWC-1',
        'nodeName': 'CO39  00 0', 'nodeNN': 168, 'nodeType': 'C'
      }]
    }));
    auditService.getGranularLineTree.and.returnValue(of([{ 'type': 1, 'gwcId': 'GWC-0', 'gwName': 'sipvmgco39' }]));
  });

  it('should create', () => {
    const changeData = {
      'auditName': 'Line Data Integrity Audit',
      'granularAudit': {
        'data': [
          { 'data': 'GWC-0', 'type': 0 }, { 'data': 'GWC-1', 'type': 0 }
        ], 'type': 1, 'count': 2, 'options': 0
      }, scheduleDefault: {
        'enabled': true, 'timeToRun': '16:00', 'once': false,
        'daily': false, 'weekly': true, 'monthly': false,
        'sunday': false, 'monday': true, 'tuesday': false,
        'wednesday': false, 'thursday': false, 'friday': false,
        'saturday': false, 'day': '', 'interval': 1,
        'granularAuditData': { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 }
      }
    };
    component.auditSubjectService.granularAuditDataChangeSubject.next(changeData);
    expect(component).toBeTruthy();
  });

  it('should call getAllNodeLeafDataSource', () => {
    spyOn(component.treePickListComponent, 'getAllNodeLeafDataSource');
    component.getAllNodeLeafDataSource();
    expect(component.treePickListComponent.getAllNodeLeafDataSource).toHaveBeenCalled();
  });

  it('should call handleChangeSelectedGroupChk case accept = true', () => {
    spyOn(component.confirmIntegrityAudit, 'handleAccept');
    component.selectedGroupChk = [COptionsLineDataIntegrity[0].value];
    component.handleChangeSelectedGroupChk(true, true, COptionsLineDataIntegrity[0].value);
    component.confirmIntegrityAudit.handleAccept(true);
    component.confirmIntegrityAudit.handleAccept(true);
    expect(component.confirmIntegrityAudit.isShowConfirmDialog).toBeFalsy();
  });

  it('should call handleChangeSelectedGroupChk case accept = false', () => {
    spyOn(component.confirmIntegrityAudit, 'handleAccept');
    component.selectedGroupChk = [COptionsLineDataIntegrity[0].value];
    component.handleChangeSelectedGroupChk(true, true, COptionsLineDataIntegrity[0].value);
    component.confirmIntegrityAudit.handleAccept(false);
    component.confirmIntegrityAudit.handleAccept(true);
    expect(component.confirmIntegrityAudit.isShowConfirmDialog).toBeFalsy();
  });

  it('should call handleConfirm case accept = true', () => {
    spyOn(component, 'setValueFieldTreePick');
    component.confirmDialogData.data = {
      nodeLeafSelectedItemsSource: []
    };
    component.handleConfirm(true);
    expect(component.setValueFieldTreePick).toHaveBeenCalled();
  });

  it('should call handleConfirm case accept = false', () => {
    spyOn(component, 'setValueFieldTreePick');
    component.confirmDialogData.data = {
      nodeLeafSelectedItemsSource: []
    };
    component.handleConfirm(false);
    expect(component.setValueFieldTreePick).toHaveBeenCalled();
  });
});
