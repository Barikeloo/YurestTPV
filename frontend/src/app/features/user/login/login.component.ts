import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../core/auth/auth-state.service';
import { ValidationMessagesService } from '../../../core/validation/validation-messages.service';
import type { ApiValidationError } from '../../../shared/models/api-error.models';
import type { LoginUserRequest } from '../../../shared/models/user-api.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly validationMessages = inject(ValidationMessagesService);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected submitting = false;
  protected formLevelMessage = '';
  protected readonly loggedUser = this.authState.user;

  protected getFieldError(field: string): string {
    return this.validationMessages.getControlMessage(this.form.get(field), field);
  }

  private clearServerErrors(): void {
    for (const key of ['email', 'password']) {
      const control = this.form.get(key);
      const errors = control?.errors;

      if (errors && 'serverError' in errors) {
        const { serverError: _, ...rest } = errors;
        control.setErrors(Object.keys(rest).length > 0 ? rest : null);
      }
    }
  }

  protected onSubmit(): void {
    this.formLevelMessage = '';
    this.clearServerErrors();

    if (this.submitting) {
      return;
    }

    this.form.updateValueAndValidity();
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.cdr.detectChanges();

      return;
    }

    const value = this.form.getRawValue() as LoginUserRequest;
    this.submitting = true;

    this.authState.login(value).subscribe({
      next: (response) => {
        this.submitting = false;
        this.formLevelMessage = '';
        this.snackBar.open(`Bienvenido, ${response.name}.`, 'Cerrar', { duration: 5000 });
        void this.router.navigate(['/backoffice']);
      },
      error: (err) => {
        this.submitting = false;

        const apiError = err.error as ApiValidationError | undefined;
        if (apiError?.fieldErrors && Object.keys(apiError.fieldErrors).length > 0) {
          for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
            const control = this.form.get(field);
            const firstMessage = Array.isArray(messages) ? messages[0] : String(messages);

            if (control && firstMessage) {
              control.setErrors({
                ...(control.errors ?? {}),
                serverError: firstMessage,
              });
            }
          }

          this.form.markAllAsTouched();
          this.formLevelMessage =
            apiError.message ??
            Object.values(apiError.fieldErrors).flat().find(Boolean) ??
            '';
        } else {
          this.formLevelMessage = apiError?.message ?? err.message ?? 'No se pudo iniciar sesion.';
          this.snackBar.open(this.formLevelMessage, 'Cerrar', { duration: 5000 });
        }

        this.cdr.detectChanges();
      },
    });
  }
}
