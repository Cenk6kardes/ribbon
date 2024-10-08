import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { PageHeaderModule } from 'rbn-common-lib';
import { ImageModule } from 'primeng/image';

import { HelpRoutingModule } from './help-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { GatewayNameComponent } from './gateway-name/gateway-name.component';
import { CarrierComponent } from './carrier/carrier.component';
import { TrunkComponent } from './trunk/trunk.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { LaunchComponent } from './launch/launch.component';

const primeNGModules = [
  AccordionModule,
  TooltipModule,
  PanelModule,
  DividerModule,
  TabViewModule,
  ImageModule
];

const rbnCommonLibModules = [PageHeaderModule];

@NgModule({
  declarations: [
    OverviewComponent,
    GatewayNameComponent,
    CarrierComponent,
    TrunkComponent,
    PreferencesComponent,
    LaunchComponent
  ],
  imports: [
    CommonModule,
    primeNGModules,
    HelpRoutingModule,
    rbnCommonLibModules
  ]
})
export class HelpModule {}
