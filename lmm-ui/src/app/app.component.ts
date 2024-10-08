import { Component } from '@angular/core';
import { TranslateInternalService } from './services/translate-internal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private translateInternalService: TranslateInternalService) {
    this.translateInternalService.initTranslateResults();
  }
}
