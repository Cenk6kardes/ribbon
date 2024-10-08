import { Component, OnDestroy } from '@angular/core';
import { TranslateInternalService } from './services/translate-internal.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  loading = false;
  subject = new Subject<void>();

  constructor(
    private translateInternalService: TranslateInternalService,
    private router: Router) {
    this.translateInternalService.initTranslateResults();
    this.router.events
      .pipe(takeUntil(this.subject))
      .subscribe((routerEvent) => {
        this.checkRouterEvent(routerEvent as RouterEvent);
      });
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.subject.next();
    if (this.subject) {
      this.subject.unsubscribe();
    }
  }
}
