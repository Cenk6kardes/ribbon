import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { NetworkConfigurationComponent } from './network-configuration/network-configuration.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ProvisioningComponent } from './provisioning/provisioning.component';
import { ControllerComponent } from './controller/controller.component';
import { GatewaysComponent } from './gateways/gateways.component';
import { LinesComponent } from './lines/lines.component';
import { CarriersComponent } from './carriers/carriers.component';
import { QosCollectorsComponent } from './qos-collectors/qos-collectors.component';
import { ProceduresComponent } from './procedures/procedures.component';
import { HelpComponent } from './help.component';
import { SearchComponent } from './search/search.component';
import { V52Component } from './v52/v52.component';
import { AuditComponent } from './audit/audit.component';

const routes: Routes = [
  {
    path: '',
    component:HelpComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      {
        path: 'network-configuration',
        component: NetworkConfigurationComponent
      },
      { path: 'maintenance', component: MaintenanceComponent },
      { path: 'provisioning', component: ProvisioningComponent },
      { path: 'controller', component: ControllerComponent },
      { path: 'gateways', component: GatewaysComponent },
      { path: 'lines', component: LinesComponent },
      { path: 'carriers', component: CarriersComponent },
      { path: 'qos-collectors', component: QosCollectorsComponent },
      { path: 'search', component: SearchComponent },
      { path: 'procedures', component: ProceduresComponent },
      { path: 'v52', component: V52Component},
      { path: 'audit', component: AuditComponent},
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
