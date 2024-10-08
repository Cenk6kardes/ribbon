import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

import { DialogLoaderModule, RbnCommonTableModule, ConfirmDialogModule, PageHeaderModule } from 'rbn-common-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const angularFormModules = [
  ReactiveFormsModule,
  FormsModule
];

import { HttpLoaderFactory } from './http-loader-factory';

const primeNGModules = [
  DropdownModule,
  ButtonModule,
  DialogModule
];

const rbnCommonLibModules = [
  DialogLoaderModule,
  RbnCommonTableModule,
  ConfirmDialogModule,
  PageHeaderModule
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    primeNGModules,
    rbnCommonLibModules,
    angularFormModules,
    TranslateModule
  ]
})
export class SharedModule { }
