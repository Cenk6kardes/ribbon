import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PREFIX_URL } from './types/const';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { RootViewComponent } from './root-view/root-view.component';
import { MaintGatewaysCarrierModule } from './modules/maint-gateways-carrier/maint-gateways-carrier.module';
import { MaintTrunkClliModule } from './modules/maint-trunk-clli/maint-trunk-clli.module';
import { HelpModule } from './online-help/help.module';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => AuthModule
  },
  {
    path: 'help',
    loadChildren: () => HelpModule
  },
  {
    path: PREFIX_URL,
    component: RootViewComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => MaintGatewaysCarrierModule
      },
      {
        path: 'maintenance-by-trunk-clli',
        loadChildren: () => MaintTrunkClliModule
      },
      {
        path: '**',
        redirectTo: 'maintenance-by-gateways',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
