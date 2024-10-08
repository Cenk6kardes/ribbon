import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help.component';
import { OverviewComponent } from './overview/overview.component';
import { GatewayNameComponent } from './gateway-name/gateway-name.component';
import { CarrierComponent } from './carrier/carrier.component';
import { TrunkComponent } from './trunk/trunk.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { LaunchComponent } from './launch/launch.component';

const routes: Routes = [
  {
    path: '',
    component: HelpComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'gateway-name', component: GatewayNameComponent },
      { path: 'carrier', component: CarrierComponent},
      { path: 'trunk', component: TrunkComponent},
      { path: 'preferences', component: PreferencesComponent},
      { path: 'launch', component: LaunchComponent},
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
