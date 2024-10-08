import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintTrunkClliComponent } from './components/maint-trunk-clli/maint-trunk-clli.component';
import { MaintTrunkClliRoutingModule } from './maint-trunk-clli-routing.module';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { DChannelMaintComponent } from './components/d-channel-maint/d-channel-maint.component';
import { GeneralTrunkMaintComponent } from './components/general-trunk-maint/general-trunk-maint.component';
import { IsupCotTestComponent } from './components/isup-cot-test/isup-cot-test.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaintTrunkDetailsComponent } from './components/maint-trunk-details/maint-trunk-details.component';
import { MaintTrunkSummaryComponent } from './components/maint-trunk-summary/maint-trunk-summary.component';
import { TooltipModule } from 'primeng/tooltip';
import { PanelMessagesModule } from 'rbn-common-lib';

const primengModules = [
  PanelModule,
  TabViewModule,
  CheckboxModule,
  AccordionModule,
  InputTextModule,
  AccordionModule,
  TooltipModule
];

@NgModule({
  declarations: [
    MaintTrunkClliComponent,
    DChannelMaintComponent,
    GeneralTrunkMaintComponent,
    IsupCotTestComponent,
    MaintTrunkDetailsComponent,
    MaintTrunkSummaryComponent
  ],
  imports: [
    CommonModule,
    MaintTrunkClliRoutingModule,
    SharedModule,
    primengModules,
    PanelMessagesModule
  ]
})
export class MaintTrunkClliModule { }
