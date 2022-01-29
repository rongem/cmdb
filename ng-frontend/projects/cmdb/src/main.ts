import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => {
    const errorMsgElement = document.querySelector('#errorMsgElement');
    let message = 'Konnte Anwendung nicht starten: ';
    if (err) {
        console.error(err);
        if (err.message) {
            if (err.message.startsWith('error: Http failure response for http') && err.message.endsWith(': 504 Gateway Timeout')) {
                message += ': ' +  'Das Backend steht nicht zur Verfügung. Bitte informieren Sie Ihren Administrator. ' + err.message;
            }
            else {
                message += ': ' + err.message;
            }
        } else {
            if (err.startsWith('error: Http failure response for http') && err.endsWith(': 0 Unknown Error')) {
                err = 'Das Backend steht nicht zur Verfügung. Bitte informieren Sie Ihren Administrator. ' + err;
            }
            message = message + ': ' + err;
        }
    }
    errorMsgElement.textContent = message;
});
