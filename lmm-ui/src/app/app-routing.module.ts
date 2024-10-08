import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PREFIX_URL } from './types/const';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { HomeModule } from './modules/home/home.module';
import { ReportsModule } from './modules/reports/reports.module';
import { RootViewComponent } from './root-view/root-view.component';
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
    canActivate: [ AuthGuard ],
    children: [
      {
        path: 'reports',
        loadChildren: () => ReportsModule
      },
      {
        path: 'home',
        loadChildren: () => HomeModule
      },
      {
        path: '**',
        redirectTo: 'home',
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
export class AppRoutingModule { }
