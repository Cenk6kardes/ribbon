import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { ImageModule } from 'primeng/image';

import { OverviewComponent } from './components/overview/overview.component';
import { SecurityComponent } from './components/security/security.component';
import { HelpRoutingModule } from './help-routing.module';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TroubleshootingComponent } from './components/troubleshooting/troubleshooting.component';
import { PageHeaderModule } from 'rbn-common-lib';

const primeNGModules = [
  AccordionModule,
  TooltipModule,
  PanelModule,
  DividerModule,
  TabViewModule,
  ImageModule
];

const rbnCommonLibModules = [
  PageHeaderModule
];

@NgModule({
  declarations: [
    OverviewComponent,
    SecurityComponent,
    ConfigurationComponent,
    MaintenanceComponent,
    ReportsComponent,
    TroubleshootingComponent
  ],
  imports: [
    CommonModule,
    primeNGModules,
    rbnCommonLibModules,
    HelpRoutingModule
  ]
})
export class HelpModule { }
