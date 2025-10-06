import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormHelpers } from '../../helpers/form-helpers';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  hasError = signal(false);
  errorMessage = signal('');

  registerForm = this._fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(FormHelpers.namePattern)]],
    email: ['', [Validators.required, Validators.pattern(FormHelpers.emailPattern), FormHelpers.checkingEmailTaken]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.pattern(FormHelpers.passwordPattern)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.pattern(FormHelpers.passwordPattern)]],
  },
    {
      validators: this.passwordMatchValidator
    });

  isInvalidFormField = (field: string) => computed(() => FormHelpers.isInvalidField(this.registerForm, field));
  getFieldError = (field: string) => computed(() => FormHelpers.getFieldError(this.registerForm, field));

  onSubmit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
      this.register();
      // Handle successful login logic here
    } else {
      console.log('Form is invalid');
    }
  }

  private register() {
    const { fullName = '', email = '', password = '' } = this.registerForm.value;

    this._authService.register(email, password, fullName).subscribe({
      next: () => {
        console.log('Registration successful');
        this.hasError.set(false);
        this.errorMessage.set('');
        this._router.navigate(['/auth/login'], {
          replaceUrl: true,
        });
      },
      error: (errorResponse) => {
        console.error('Registration failed:', errorResponse.error.message);
        this.hasError.set(true);
        this.errorMessage.set(errorResponse.error.message || 'Register failed. Please try again.');
      }
    });
  }

  private passwordMatchValidator(form: any) {
    return form.controls.password.value === form.controls.confirmPassword.value ? null : { passwordMismatch: true };
  }

}
