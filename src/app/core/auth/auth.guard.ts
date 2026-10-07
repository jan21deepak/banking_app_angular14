import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.check(state.url);
  }

  canLoad(route: Route): boolean | UrlTree {
    return this.check(`/${route.path ?? ''}`);
  }

  private check(returnUrl: string): boolean | UrlTree {
    return this.auth.isAuthenticated ? true : this.router.createUrlTree(['/login'], { queryParams: { returnUrl } });
  }
}
