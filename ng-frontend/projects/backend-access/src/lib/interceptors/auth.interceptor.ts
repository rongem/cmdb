import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config/app-config.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (AppConfigService.settings && AppConfigService.settings.backend) {
      if (AppConfigService.settings.backend.authMethod === 'ntlm') {
        req = req.clone({
            withCredentials: true
        });
      } else if (AppConfigService.settings.backend.authMethod === 'jwt' && !!AppConfigService.authentication) {
        req = req.clone({
          // tslint:disable-next-line: object-literal-key-quotes
          setHeaders: {'Authorization': AppConfigService.authentication}
        });
      }
    }
    // console.log(req);
    return next.handle(req);
  }
}
