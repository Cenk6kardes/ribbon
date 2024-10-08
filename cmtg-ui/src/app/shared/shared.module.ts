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
import { FormFooterComponent } from './components/form-footer/form-footer.component';
import { SafePipe } from './pipes/safe.pipe';

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
  declarations: [
    FormFooterComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    primeNGModules,
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
    TranslateModule,
    FormFooterComponent,
    SafePipe
  ]
})
export class SharedModule { }
