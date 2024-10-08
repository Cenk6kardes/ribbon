import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient): any {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/rbn_', suffix: '.json' },
    { prefix: './assets/i18n/cmtg_', suffix: '.json' }
  ]);
}

