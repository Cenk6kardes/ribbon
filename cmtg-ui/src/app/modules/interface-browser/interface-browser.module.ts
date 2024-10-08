import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { ProvComponent } from './components/prov/prov.component';
import { SigComponent } from './components/sig/sig.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { InterfaceBrowserRoutingModule } from './interface-browser-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccordionModule } from 'primeng/accordion';
import { RingViewComponent } from './components/ring/ring-view/ring-view.component';
import { RingComponent } from './components/ring/ring-component/ring.component';
import { SigOptionsComponent } from './components/sig/sig-options/sig-options.component';
import { InterfaceInputsComponent } from './components/interface-browser/interface-inputs/interface-inputs.component';
import { InterfaceBrowserComponent } from './components/interface-browser/interface-browser.component';
import { InterfaceToCarrierComponent } from './components/maintenance/interface-to-carrier/interface-to-carrier.component';
import { TabViewModule } from 'primeng/tabview';
import { CarrierToInterfaceComponent } from './components/maintenance/carrier-to-interface/carrier-to-interface.component';
import { ProvViewComponent } from './components/prov/prov-view/prov-view.component';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    InterfaceBrowserComponent,
    ProvComponent,
    RingComponent,
    SigComponent,
    MaintenanceComponent,
    RingViewComponent,
    SigOptionsComponent,
    InterfaceInputsComponent,
    CarrierToInterfaceComponent,
    InterfaceToCarrierComponent,
    ProvViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InterfaceBrowserRoutingModule,
    ReactiveFormsModule,
    InputSwitchModule,
    AccordionModule,
    PanelModule,
    TabViewModule,
    TooltipModule,
    CheckboxModule
  ]
})
export class InterfaceBrowserModule {}
