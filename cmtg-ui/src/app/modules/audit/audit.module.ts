import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditRoutingModule } from './audit-routing.module';
import { SelectAuditComponent } from './components/select-audit/select-audit.component';
import { CurrentAuditComponent } from './components/current-audit/current-audit.component';
import { ViewReportsComponent } from './components/view-reports/view-reports.component';
import { ScheduledAuditsComponent } from './components/scheduled-audits/scheduled-audits.component';
import { PanelModule } from 'primeng/panel';
import { SharedModule } from 'src/app/shared/shared.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { RbnTimePickerModule } from 'rbn-common-lib';

import { C20DataIntegrityAuditComponent } from './components/select-audit/c20-data-integrity-audit/c20-data-integrity-audit.component';
import { TreePickListModule } from 'src/app/shared/modules/tree-pick-list/tree-pick-list.module';
import { LineDataIntegrityAuditComponent } from './components/select-audit/line-data-integrity-audit/line-data-integrity-audit.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule, PanelMessagesModule } from 'rbn-common-lib';
import { SummaryAuditComponent } from './components/select-audit/summary-audit/summary-audit.component';
import { ScheduleForLaterComponent } from './components/select-audit/schedule-for-later/schedule-for-later.component';
import { AccordionModule } from 'primeng/accordion';
import { TrunkDataIntegrityAuditComponent } from
  './components/select-audit/trunk-data-integrity-audit/trunk-data-integrity-audit.component';
import { IntegrityTakeActionsReportsComponent } from
  './components/view-reports/integrity-take-actions-reports/integrity-take-actions-reports.component';
import { SmallLineDataIntegrityAuditComponent } from
  './components/select-audit/small-line-data-integrity-audit/small-line-data-integrity-audit.component';


@NgModule({
  declarations: [
    SelectAuditComponent,
    CurrentAuditComponent,
    ViewReportsComponent,
    ScheduledAuditsComponent,
    C20DataIntegrityAuditComponent,
    LineDataIntegrityAuditComponent,
    SummaryAuditComponent,
    ScheduleForLaterComponent,
    TrunkDataIntegrityAuditComponent,
    IntegrityTakeActionsReportsComponent,
    SmallLineDataIntegrityAuditComponent
  ],
  imports: [
    CommonModule,
    AuditRoutingModule,
    PanelModule,
    RadioButtonModule,
    InputTextareaModule,
    TreePickListModule,
    CheckboxModule,
    SharedModule,
    ProgressBarModule,
    ConfirmDialogModule,
    PanelMessagesModule,
    DropdownModule,
    MultiSelectModule,
    RbnTimePickerModule,
    AccordionModule
  ]
})
export class AuditModule { }
