import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AccordionModule } from 'primeng/accordion';

import { StatusLogComponent } from './status-log.component';
import { StatusLogService } from 'src/app/services/status-log.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { Subject } from 'rxjs';

describe('StatusLogComponent', () => {
  let component: StatusLogComponent;
  let fixture: ComponentFixture<StatusLogComponent>;
  const commonService = jasmine.createSpyObj('commonService', ['showSuccessMessage', 'showErrorMessage']);
  const statusLogService = jasmine.createSpyObj('statusLogService', [
    'pushLogs',
    'clearAllLogs',
    'logs',
    'changesLogs$'
  ]);
  statusLogService.changesLogs$ = new Subject<boolean>();
  statusLogService.logs = [];
  const translateService = {
    translateResults: {
      HOME : {}
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusLogComponent],
      imports: [
        SharedModule,
        HttpClientModule,
        AccordionModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: StatusLogService, useValue: statusLogService },
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translateService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StatusLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    statusLogService.changesLogs$.next('DN is posted');
    expect(component).toBeTruthy();
  });

  it('should call clearStatusLogs', () => {
    component.clearStatusLogs();
    expect(statusLogService.clearAllLogs).toHaveBeenCalled();
  });
});
