import { PageHeaderModule, PanelMessagesModule } from 'rbn-common-lib';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRoutingModule } from './help-routing.module';
import { AccordionModule } from 'primeng/accordion';
import { OverviewComponent } from './overview/overview.component';
import { NetworkConfigurationComponent } from './network-configuration/network-configuration.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ProvisioningComponent } from './provisioning/provisioning.component';
import { ControllerComponent } from './controller/controller.component';
import { GatewaysComponent } from './gateways/gateways.component';
import { LinesComponent } from './lines/lines.component';
import { CarriersComponent } from './carriers/carriers.component';
import { QosCollectorsComponent } from './qos-collectors/qos-collectors.component';
import { ProceduresComponent } from './procedures/procedures.component';
import { SharedModule } from '../shared/shared.module';
import { PanelModule } from 'primeng/panel';
import { ImageModule } from 'primeng/image';
import {TabViewModule} from 'primeng/tabview';
import { SearchComponent } from './search/search.component';
import { V52Component } from './v52/v52.component';
import { AuditComponent } from './audit/audit.component';

const primeNGModules = [
  AccordionModule,
  PanelModule,
  ImageModule,
  TabViewModule
];
const rbnCommonLibModules = [
  PanelMessagesModule,
  PageHeaderModule
];

@NgModule({
  declarations: [
    OverviewComponent,
    NetworkConfigurationComponent,
    MaintenanceComponent,
    ProvisioningComponent,
    ControllerComponent,
    GatewaysComponent,
    LinesComponent,
    CarriersComponent,
    QosCollectorsComponent,
    ProceduresComponent,
    V52Component,
    SearchComponent,
    AuditComponent
  ],
  imports: [
    CommonModule,
    HelpRoutingModule,
    primeNGModules,
    rbnCommonLibModules,
    SharedModule
  ]
})
export class HelpModule {}
