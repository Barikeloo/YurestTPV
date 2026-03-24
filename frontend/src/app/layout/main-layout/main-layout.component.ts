import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../core/auth/auth-state.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  protected readonly user = this.authState.user;
  protected readonly isAuthenticated = this.authState.isAuthenticated;

  protected onLogout(): void {
    this.authState.logout().subscribe(() => {
      void this.router.navigate(['/login']);
    });
  }
}
