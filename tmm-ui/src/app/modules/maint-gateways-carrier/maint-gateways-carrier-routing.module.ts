import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintGatewaysCarrierComponent } from './components/maint-gateways-carrier/maint-gateways-carrier.component';
import { MaintGatewaysCarrierResolver } from './services/maint-gateways-carrier.resolver';


const routes: Routes = [
  {
    path: 'maintenance-by-carrier', component: MaintGatewaysCarrierComponent, resolve: {
      data: MaintGatewaysCarrierResolver
    }
  },
  {
    path: 'maintenance-by-gateways', component: MaintGatewaysCarrierComponent, resolve: {
      data: MaintGatewaysCarrierResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintGatewaysCarrierRoutingModule { }
