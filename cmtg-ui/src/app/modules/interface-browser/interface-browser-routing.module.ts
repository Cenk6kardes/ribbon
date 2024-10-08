import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvComponent } from './components/prov/prov.component';
import { SigComponent } from './components/sig/sig.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { RingViewComponent } from './components/ring/ring-view/ring-view.component';
import { InterfaceBrowserComponent } from './components/interface-browser/interface-browser.component';
import { RootResolver } from 'src/app/services/root.resolver';
import { V52Guard } from 'src/app/auth/v52guard/v52.guard';

const routes: Routes = [
  {
    resolve: {
      data: RootResolver
    },
    canActivate: [V52Guard],
    path: '',
    children: [
      { path: '', component: InterfaceBrowserComponent},
      { path: 'prov', component: ProvComponent},
      { path: 'ring', component: RingViewComponent},
      { path: 'sig', component: SigComponent },
      { path: 'maintenance', component: MaintenanceComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterfaceBrowserRoutingModule {}
