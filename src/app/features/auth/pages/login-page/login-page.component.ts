import { Component, inject, effect, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormHelpers } from '../../helpers/form-helpers';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  hasError = signal(false);
  errorMessage = signal('');

  loginForm = this._fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern(FormHelpers.emailPattern), FormHelpers.checkingEmailTaken]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.pattern(FormHelpers.passwordPattern)]],
  });

  isInvalidFormControl = (control: FormControl) => computed(() => FormHelpers.isInvalidFormControl(control));
  getFormControlError = (control: FormControl) => computed(() => FormHelpers.getFormControlError(control));

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      this.login();
      // Handle successful login logic here
    } else {
      console.log('Form is invalid');
    }
  }

  private login() {
    const { email = '', password = '' } = this.loginForm.value;

    this._authService.login(email, password).subscribe({
      next: () => {
        console.log('Login successful');
        this.hasError.set(false);
        this.errorMessage.set('');
        this._router.navigate(['/store'], {
          replaceUrl: true,
        });
        // Navigate to the dashboard or home page after successful login
      },
      error: (errorResponse) => {
        console.error('Login failed:', errorResponse.error.message);
        this.hasError.set(true);
        this.errorMessage.set(errorResponse.error.message || 'Login failed. Please try again.');
      }
    });
  }

}
