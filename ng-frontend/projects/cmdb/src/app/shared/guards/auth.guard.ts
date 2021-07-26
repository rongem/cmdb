import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { JwtLoginService } from 'backend-access';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private jwt: JwtLoginService, private router: Router, private route: ActivatedRoute) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.jwt.validLogin.pipe(
            take(1),
            tap(value => console.log(value)),
            map(valid => valid ? true : this.router.createUrlTree(['log-in'])),
        );
    }
}
