import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PREFIX_HELP_URL, PREFIX_URL } from './types/const';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { RootViewComponent } from './root-view/root-view.component';
import { NetworkConfigurationModule } from './modules/network-configuration/network-configuration.module';
import { GatewayControllersModule } from './modules/gateway-controllers/gateway-controllers.module';
import { AuditModule } from './modules/audit/audit.module';
import { InterfaceBrowserModule } from './modules/interface-browser/interface-browser.module';
import { RootResolver } from './services/root.resolver';
import { HelpModule } from './online-help/help.module';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => AuthModule
  },
  {
    path: PREFIX_URL,
    component: RootViewComponent, resolve: {
      data: RootResolver
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'gateway-controllers',
        loadChildren: () => GatewayControllersModule
      }, {
        path: 'network-configuration',
        loadChildren: () => NetworkConfigurationModule
      },
      {
        path: 'audit',
        loadChildren: () => AuditModule
      },
      {
        path: 'interface-browser',
        loadChildren: () => InterfaceBrowserModule
      },
      {
        path: '**',
        redirectTo: 'gateway-controllers',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: PREFIX_HELP_URL,
    loadChildren: () => HelpModule
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
export class AppRoutingModule { }
