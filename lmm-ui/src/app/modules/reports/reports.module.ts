import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormToolbarModule, PageHeaderModule, PanelMessagesModule, PickListTableModule } from 'rbn-common-lib';

import { PanelModule } from 'primeng/panel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { ProgressBarModule } from 'primeng/progressbar';

import { ViewReportComponent } from './reports/view-report/view-report.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { SharedModule } from '../../shared/shared.module';

import { CreateOnDemandReportComponent } from './reports/create-on-demand-report/create-on-demand-report.component';
import { ReportSchedulingOptionsComponent } from './reports/report-scheduling-options/report-scheduling-options.component';

const primeNGModules = [
  PanelModule,
  InputSwitchModule,
  CheckboxModule,
  CalendarModule,
  ProgressBarModule
];

const rbnCommonLibModules = [
  PageHeaderModule,
  PickListTableModule,
  FormToolbarModule,
  PanelMessagesModule
];
@NgModule({
  declarations: [
    ReportsComponent,
    ViewReportComponent,
    CreateOnDemandReportComponent,
    ReportSchedulingOptionsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    primeNGModules,
    rbnCommonLibModules,
    SharedModule
  ]
})
export class ReportsModule { }
