import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateOnDemandReportComponent } from './reports/create-on-demand-report/create-on-demand-report.component';
import { ReportSchedulingOptionsComponent } from './reports/report-scheduling-options/report-scheduling-options.component';
import { ReportsComponent } from './reports/reports.component';
import { ViewReportComponent } from './reports/view-report/view-report.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ReportsComponent },
      { path: 'detail/:reportName', component: ViewReportComponent },
      { path: 'createDemandReport', component: CreateOnDemandReportComponent },
      { path: 'reportSchedulingOptions', component: ReportSchedulingOptionsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
