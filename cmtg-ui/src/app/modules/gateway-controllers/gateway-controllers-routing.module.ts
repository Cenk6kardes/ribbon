import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GatewayControllersComponent } from './gateway-controllers.component';
import { GatewayControllersDirectoryComponent } from './components/gateway-controllers-directory/gateway-controllers-directory.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: GatewayControllersComponent },
      { path: 'gateway-controllers-directory', component: GatewayControllersDirectoryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GatewayControllersRoutingModule {}
