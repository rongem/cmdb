import { HttpHeaders } from '@angular/common/http';

export function getUrl(service: string) {
    if (service.endsWith('/')) {
        service = service.slice(0, -1);
    }
    return 'http://localhost:51717/API/REST.svc/' + service;
}

export function getHeader() {
    return new HttpHeaders({ 'Content-Type': 'application/json'});
}
