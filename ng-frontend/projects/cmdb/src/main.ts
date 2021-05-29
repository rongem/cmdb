import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => {
    const errorMsgElement = document.querySelector('#errorMsgElement');
    let message = 'Konnte Anwendung nicht starten: ';
    if (err) {
        if (err.message) {
            message = message + ': ' + err.message;
        } else {
            if (err.startsWith('error: Http failure response for http') && err.endsWith(': 0 Unknown Error')) {
              err = 'Das Backend steht nicht zur Verfügung. Bitte informieren Sie Ihren Administrator. ' + err;
            }
            message = message + ': ' + err;
        }
    }
    errorMsgElement.textContent = message;
  });
