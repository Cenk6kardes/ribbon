import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintGatewaysCarrierRoutingModule } from './maint-gateways-carrier-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { PickListTableModule, PanelMessagesModule } from 'rbn-common-lib';

import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { MaintGatewaysCarrierComponent } from './components/maint-gateways-carrier/maint-gateways-carrier.component';
import { SummaryComponent } from './components/summary/summary.component';
import { DetailsTableComponent } from './components/details-table/details-table.component';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    MaintGatewaysCarrierComponent,
    SummaryComponent,
    DetailsTableComponent
  ],
  imports: [
    CommonModule,
    CheckboxModule,
    AccordionModule,
    MaintGatewaysCarrierRoutingModule,
    PickListTableModule,
    TooltipModule,
    InputTextModule,
    SharedModule,
    PanelMessagesModule,
    OverlayPanelModule
  ]
})
export class MaintGatewaysCarrierModule { }
