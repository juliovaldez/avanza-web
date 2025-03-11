import { Inject, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthService } from '../core/auth.service';

export const AuthGuardService: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authenticated().pipe(
    map((isAuthenticated) => {
      console.log(state.url);
      const authForms = [
        /^\/login-form$/,
        /^\/reset-password$/,
        /^\/change-password\/[^/]+$/,
      ];
      const isAuthForm = authForms.some((pattern) => pattern.test(state.url));
      console.log('isAuthenticated', isAuthenticated);
      console.log('route', isAuthForm);

      if (isAuthenticated && isAuthForm) {
        return router.createUrlTree(['/home']);
      }
      if (isAuthenticated || isAuthForm) {
        return true;
      }
      return router.createUrlTree(['/login-form']);
    })
  );
};
