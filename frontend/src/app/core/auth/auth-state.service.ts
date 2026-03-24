import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ApiClientService } from '../infrastructure/api/api-client.service';
import type { LoginUserRequest, LoginUserResponse } from '../../shared/models/user-api.models';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly api = inject(ApiClientService);

  private readonly userSignal = signal<LoginUserResponse | null>(null);
  private readonly initializedSignal = signal(false);

  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly isInitialized = computed(() => this.initializedSignal());

  initializeSession(): Observable<boolean> {
    if (this.initializedSignal()) {
      return of(this.isAuthenticated());
    }

    return this.api.getMe().pipe(
      tap({
        next: (user) => {
          this.userSignal.set(user);
          this.initializedSignal.set(true);
        },
        error: () => {
          this.userSignal.set(null);
          this.initializedSignal.set(true);
        },
      }),
      catchError(() => of(false)),
      map(() => true),
    );
  }

  login(credentials: LoginUserRequest): Observable<LoginUserResponse> {
    return this.api.loginUser(credentials).pipe(
      tap((user) => {
        this.userSignal.set(user);
        this.initializedSignal.set(true);
      }),
    );
  }

  logout(): Observable<void> {
    return this.api.logout().pipe(
      tap(() => {
        this.userSignal.set(null);
        this.initializedSignal.set(true);
      }),
      map(() => undefined),
    );
  }
}
