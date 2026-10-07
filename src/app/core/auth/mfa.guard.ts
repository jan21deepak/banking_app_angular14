import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

/** Only allows the MFA step when an SSO challenge is in flight. */
@Injectable({ providedIn: 'root' })
export class MfaGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.auth.pendingChallenge ? true : this.router.createUrlTree(['/login']);
  }
}
