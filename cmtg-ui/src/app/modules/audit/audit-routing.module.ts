import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditResolver } from './services/audit.resolver';
import { ViewReportsComponent } from './components/view-reports/view-reports.component';
import { CurrentAuditComponent } from './components/current-audit/current-audit.component';
import { ScheduledAuditsComponent } from './components/scheduled-audits/scheduled-audits.component';
import { SelectAuditComponent } from './components/select-audit/select-audit.component';

const routes: Routes = [
  {
    path: 'c20-data-integrity',
    children: [
      {
        path: '', component: SelectAuditComponent, resolve: {
          data: AuditResolver
        }
      },
      {
        path: 'reports', component: ViewReportsComponent, resolve: {
          data: AuditResolver
        }
      }
    ]
  },
  {
    path: 'line-data-integrity',
    children: [
      {
        path: '', component: SelectAuditComponent, resolve: {
          data: AuditResolver
        }
      },
      {
        path: 'reports', component: ViewReportsComponent, resolve: {
          data: AuditResolver
        }
      }
    ]
  },
  {
    path: 'trunk-data-integrity',
    children: [
      {
        path: '', component: SelectAuditComponent, resolve: {
          data: AuditResolver
        }
      },
      {
        path: 'reports', component: ViewReportsComponent, resolve: {
          data: AuditResolver
        }
      }
    ]
  },
  {
    path: 'v52-data-integrity',
    children: [
      {
        path: '', component: SelectAuditComponent, resolve: {
          data: AuditResolver
        }
      },
      {
        path: 'reports', component: ViewReportsComponent, resolve: {
          data: AuditResolver
        }
      }
    ]
  },
  {
    path: 'small-line-data-integrity',
    children: [
      {
        path: '', component: SelectAuditComponent, resolve: {
          data: AuditResolver
        }
      },
      {
        path: 'reports', component: ViewReportsComponent, resolve: {
          data: AuditResolver
        }
      }
    ]
  },
  {
    path: 'current-audit',
    children: [
      {
        path: '', component: CurrentAuditComponent
      }
    ]
  },
  {
    path: 'scheduled-audits',
    children: [
      {
        path: '', component: ScheduledAuditsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRoutingModule { }
