import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIdleModule } from '@ng-idle/core';

import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import {
  DialogLoaderModule,
  PageTopModule,
  SidebarModule,
  MessageToggleModule,
  ProfileModule
} from 'rbn-common-lib';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpLoaderFactory } from './shared/http-loader-factory';
import { RootViewComponent } from './root-view/root-view.component';
import { TopHeaderComponent } from './root-view/top-header/top-header.component';
import { PreferencesComponent } from './root-view/preferences/preferences.component';
import { DEFAULT_LANGUAGE } from './types/const';
import { LMMInterceptor } from './interceptors/lmm.interceptor';
import { HelpComponent } from './online-help/help.component';

const rbnCommonLibModules = [
  DialogLoaderModule,
  PageTopModule,
  SidebarModule,
  MessageToggleModule,
  ProfileModule
];

const primeNGModules = [
  DialogModule,
  ButtonModule,
  InputSwitchModule,
  DropdownModule,
  CheckboxModule
];

@NgModule({
  declarations: [
    AppComponent,
    RootViewComponent,
    TopHeaderComponent,
    PreferencesComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgIdleModule.forRoot(),
    primeNGModules,
    rbnCommonLibModules,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    MessageService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LMMInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

/*
initialize a default language translation at the angular app startup, other component can use:
translate.instant (Returns a translation instantly from the internal state of loaded translation.
All rules regarding the current language, the preferred language of even fallback languages will be used except any promise handling.)
*/

export function appInitializerFactory(translate: TranslateService) {
  return () => {
    const language = DEFAULT_LANGUAGE;
    sessionStorage.setItem('language', language);
    translate.setDefaultLang(language);
    return translate.use(language).toPromise();
  };
}
