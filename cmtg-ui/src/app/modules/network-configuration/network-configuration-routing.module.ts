import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkConfigurationComponent } from './components/network/network-configuration.component';
import { CodecProfileComponent } from './components/codec-profile/codec-profile.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: NetworkConfigurationComponent },
      { path: 'codec-profile', component: CodecProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkConfigurationRoutingModule { }
