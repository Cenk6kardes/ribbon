import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { LoginModule } from 'rbn-common-lib';
import { AuthRoutingModule } from './auth-routing.module';

import { DEFAULT_LANGUAGE } from '../types/const';
import { HttpLoaderFactory } from '../shared/http-loader-factory';

import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login.service';
import { GetInformationService } from './services/get-information.service';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginModule,
    AuthRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: 'LoginInterfaceService', useClass: LoginService },
    { provide: 'GetInfoInterfaceService', useClass: GetInformationService }
  ]
})
export class AuthModule {
  constructor(translate: TranslateService) {
    const defaultLanguage = sessionStorage.getItem('language') || DEFAULT_LANGUAGE;
    translate.setDefaultLang(defaultLanguage);
    translate.use(defaultLanguage);
  }
}

