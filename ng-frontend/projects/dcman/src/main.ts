import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
  .catch(err => {
    const errorMsgElement = document.querySelector('#errorMsgElement');
    let message = 'Could not start application: ';
    if (err) {
        if (err.message) {
            message = message + ': ' + err.message;
        } else {
            if (err.startsWith('error: Http failure response for http') && err.endsWith(': 0 Unknown Error')) {
              err = 'The backend is not available. Please inform your administrator. ' + err;
            }
            message = message + ': ' + err;
        }
    }
    errorMsgElement.textContent = message;
  });
