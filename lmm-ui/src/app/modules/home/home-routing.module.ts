import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BulkDetailsComponent } from './components/bulk-details/bulk-details.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'bulk/details', component: BulkDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
