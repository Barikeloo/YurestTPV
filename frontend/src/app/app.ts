import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStateService } from './core/auth/auth-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly authState = inject(AuthStateService);

  protected readonly title = signal('training-frontend');

  constructor() {
    this.authState.initializeSession().subscribe();
  }
}
