import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { StatusLogComponent } from './components/status-log/status-log.component';
import { DirectoryTableComponent } from './components/directory-table/directory-table.component';
import { PostCommandComponent } from './components/post-command/post-command.component';
import { TooltipModule } from 'primeng/tooltip';
import { OrderListModule } from 'primeng/orderlist';
import { BulkDetailsComponent } from './components/bulk-details/bulk-details.component';

const primeNGModules = [
  InputTextModule,
  AccordionModule,
  TooltipModule,
  OrderListModule
];

@NgModule({
  declarations: [
    HomeComponent,
    DirectoryTableComponent,
    StatusLogComponent,
    PostCommandComponent,
    BulkDetailsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    primeNGModules,
    SharedModule
  ]
})
export class HomeModule { }
