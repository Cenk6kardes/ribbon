import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreePickListComponent } from './tree-pick-list.component';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TreePickListComponent
  ],
  imports: [
    CommonModule,
    PanelModule,
    ButtonModule,
    TreeModule,
    FormsModule
  ],
  exports: [
    TreePickListComponent
  ]
})
export class TreePickListModule { }
