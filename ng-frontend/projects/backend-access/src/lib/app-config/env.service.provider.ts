/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { Provider } from '@angular/core';
import { EnvService } from './env.service';

interface EnvWindow extends Window {
    __env?: {
        backendBaseUrl?: string;
    };
}

export const EnvServiceFactory = () => {
    // Create env
    const env = new EnvService();

    // Read environment variables from browser window
    const browserWindow = window as EnvWindow;
    if (browserWindow.__env) {
        const browserWindowEnv: any = browserWindow.__env || {};
        console.log(browserWindowEnv);
        env.backendBaseUrl = browserWindow.__env.backendBaseUrl ?? env.backendBaseUrl;
    } else {
        console.log(browserWindow);
    }

  return env;
};

export const EnvServiceProvider: Provider = {
  provide: EnvService,
  useFactory: EnvServiceFactory,
  deps: [],
};
