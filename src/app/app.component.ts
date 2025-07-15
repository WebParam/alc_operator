import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { LoadingService } from './services/loading.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  loading = false;
  constructor(
    private router: Router,
    private zone: NgZone,
    private _loading: LoadingService
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
        console.log('loading', this.loading);
      });
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const domain = 'ops.luxury.avis.co.za';

        console.log(event.url);
        const slug = event.url.split(domain).pop();
        console.log(slug);
        
        if (slug) {
          this.router.navigateByUrl(slug);
        }
        // If no match, do nothing - let regular routing
        // logic take over
      });
    });
  }
}
