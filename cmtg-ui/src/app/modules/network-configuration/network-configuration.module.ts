import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetworkConfigurationRoutingModule } from './network-configuration-routing.module';
import { NetworkConfigurationComponent } from './components/network/network-configuration.component';
import { CodecProfileComponent } from './components/codec-profile/codec-profile.component';
import { QosCollectorsComponent } from './components/network/qos-collectors/qos-collectors.component';

import { SharedModule } from 'src/app/shared/shared.module';

import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { OrderListModule } from 'primeng/orderlist';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { PickListModule } from 'primeng/picklist';

import { PickListTableModule, FormToolbarModule, PanelMessagesModule } from 'rbn-common-lib';
import { AlgsComponent } from './components/network/algs/algs.component';
import { GrGatewaysComponent } from './components/network/gr-gateways/gr-gateways.component';
import { PepServersComponent } from './components/network/pep-servers/pep-servers.component';
import { NetworkCodecProfileComponent } from './components/codec-profile/network-codec-profile/network-codec-profile.component';
import { DqosConfigurationComponent } from './components/codec-profile/dqos-configuration/dqos-configuration.component';
import { GeneralNetworkSettingsComponent } from './components/general-network-settings/general-network-settings.component';

const primeNGModules = [
  InputTextModule,
  AccordionModule,
  TooltipModule,
  OrderListModule,
  PanelModule,
  TabViewModule,
  InputSwitchModule,
  CheckboxModule,
  PickListModule
];
const rbnCommonLibModules = [
  PickListTableModule,
  FormToolbarModule,
  PanelMessagesModule
];
@NgModule({
  declarations: [
    NetworkConfigurationComponent,
    CodecProfileComponent,
    QosCollectorsComponent,
    AlgsComponent,
    GrGatewaysComponent,
    PepServersComponent,
    NetworkCodecProfileComponent,
    DqosConfigurationComponent,
    GeneralNetworkSettingsComponent
  ],
  imports: [
    CommonModule,
    NetworkConfigurationRoutingModule,
    primeNGModules,
    rbnCommonLibModules,
    SharedModule
  ]
})
export class NetworkConfigurationModule { }
