import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthStateService } from './auth-state.service';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.isInitialized()) {
    if (authState.isAuthenticated()) {
      return of(true);
    }

    void router.navigate(['/login']);

    return of(false);
  }

  return authState.initializeSession().pipe(
    map(() => {
      if (authState.isAuthenticated()) {
        return true;
      }

      void router.navigate(['/login']);

      return false;
    }),
  );
};
