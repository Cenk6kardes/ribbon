import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintTrunkClliComponent } from './components/maint-trunk-clli/maint-trunk-clli.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: MaintTrunkClliComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintTrunkClliRoutingModule { }
