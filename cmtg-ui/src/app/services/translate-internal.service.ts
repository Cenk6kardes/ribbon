import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class TranslateInternalService {
  translateResults: any;
  constructor(private translate: TranslateService) {}

  initTranslateResults() {
    const lang = this.translate.currentLang;
    const result = this.translate.translations[lang];
    this.translateResults = result;
  }
}
