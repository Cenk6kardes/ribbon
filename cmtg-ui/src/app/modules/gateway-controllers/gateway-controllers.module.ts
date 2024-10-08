import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GatewayControllersComponent } from './gateway-controllers.component';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { OrderListModule } from 'primeng/orderlist';
import { TooltipModule } from 'primeng/tooltip';
import {
  PageHeaderModule,
  PickListTableModule,
  FormToolbarModule,
  PanelMessagesModule
} from 'rbn-common-lib';
import { GatewayControllersRoutingModule } from './gateway-controllers-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { ProvisioningComponent } from './components/provisioning/provisioning.component';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { ControllerComponent } from './components/provisioning/controller/controller.component';
import { GatewaysComponent } from './components/provisioning/gateways/gateways.component';
import { LinesComponent } from './components/provisioning/lines/lines.component';
import { CarriersComponent } from './components/provisioning/carriers/carriers.component';
import { QosCollectorsComponent } from './components/provisioning/qos-collectors/qos-collectors.component';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputNumberModule } from 'primeng/inputnumber';
import { AssociateDialogComponent } from './components/associate-dialog/associate-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DetailDialogComponent } from './components/provisioning/gateways/detail-dialog/detail-dialog.component';
import { AddGwcNodeComponent } from './components/add-gwc-node/add-gwc-node.component';
import { PickListModule } from 'primeng/picklist';
import { SignalProtocolComponent } from './components/associate-media-gateway-components/signal-protocol/signal-protocol.component';
import { MultiSiteComponent } from './components/associate-media-gateway-components/multi-site/multi-site.component';
import { GwcBackupComponent } from './components/associate-media-gateway-components/gwc-backup/gwc-backup.component';
import { TgrpComponent } from './components/associate-media-gateway-components/tgrp/tgrp.component';
import { GrGatewayInfoComponent } from './components/associate-media-gateway-components/gr-gateway-info/gr-gateway-info.component';
import { LgrpLocationComponent } from './components/associate-media-gateway-components/lgrp-location/lgrp-location.component';
import { PepserverAlgComponent } from './components/associate-media-gateway-components/pepserver-alg/pepserver-alg.component';
// eslint-disable-next-line max-len
import { SignallingGatewayComponent } from './components/associate-media-gateway-components/signalling-gateway/signalling-gateway.component';
// eslint-disable-next-line max-len
import { GatewayInformationComponent } from './components/associate-media-gateway-components/gateway-information/gateway-information.component';
// eslint-disable-next-line max-len
import { AddGrGatewayInfoComponent } from './components/associate-media-gateway-components/gr-gateway-info/add-gr-gateway-info/add-gr-gateway-info.component';

const primeNGModules = [
  InputTextModule,
  AccordionModule,
  TooltipModule,
  OrderListModule,
  PanelModule,
  RadioButtonModule,
  DividerModule,
  TabViewModule,
  CheckboxModule,
  InputSwitchModule,
  OverlayPanelModule,
  InputNumberModule,
  PickListModule
];
const rbnCommonLibModules = [
  PageHeaderModule,
  PickListTableModule,
  FormToolbarModule,
  PanelMessagesModule,
  ConfirmDialogModule
];

@NgModule({
  declarations: [
    GatewayControllersComponent,
    MaintenanceComponent,
    ProvisioningComponent,
    ControllerComponent,
    GatewaysComponent,
    LinesComponent,
    CarriersComponent,
    QosCollectorsComponent,
    AssociateDialogComponent,
    DetailDialogComponent,
    AddGwcNodeComponent,
    GatewayInformationComponent,
    SignalProtocolComponent,
    MultiSiteComponent,
    GwcBackupComponent,
    SignallingGatewayComponent,
    TgrpComponent,
    GrGatewayInfoComponent,
    AddGrGatewayInfoComponent,
    LgrpLocationComponent,
    PepserverAlgComponent
  ],
  imports: [
    CommonModule,
    GatewayControllersRoutingModule,
    primeNGModules,
    rbnCommonLibModules,
    FormsModule,
    SharedModule
  ]
})
export class GatewayControllersModule {}
