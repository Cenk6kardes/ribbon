import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help.component';
import { OverviewComponent } from './components/overview/overview.component';
import { SecurityComponent } from './components/security/security.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TroubleshootingComponent } from './components/troubleshooting/troubleshooting.component';

const routes: Routes = [
  {
    path: '',
    component: HelpComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'configuration', component: ConfigurationComponent},
      { path: 'maintenance', component: MaintenanceComponent},
      { path: 'reports', component: ReportsComponent},
      { path: 'troubleshooting', component: TroubleshootingComponent},
      {
        path: '**',
        redirectTo: 'overview',
        pathMatch: 'full'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule {}
