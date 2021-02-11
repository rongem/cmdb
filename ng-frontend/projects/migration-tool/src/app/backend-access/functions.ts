import { HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './app-config/app-config.service';

export function getUrl(service: string) {
    if (service.endsWith('/')) {
        service = service.slice(0, -1);
    }
    return AppConfigService.settings.backend.url + service;
}

export function getHeader(suppressContentType = false) {
    return new HttpHeaders({'Content-Type': suppressContentType ? undefined : 'application/json'});
}

