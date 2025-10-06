import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

export class FormHelpers {

  static namePattern = '^([A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+) ([A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+)$';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static passwordPattern = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$'; // 👈 literal RegExp

  static isInvalidField(myForm: FormGroup, field: string) {
    const control = myForm.get(field) as FormControl;
    return control?.invalid && (control?.touched || control?.dirty);
  }

  static getFieldError(myForm: FormGroup, field: string) {
    const control = myForm.get(field) as FormControl;
    const errors = control?.errors ?? {};
    return FormHelpers.getErrorMessage(errors);
  }

  static isInvalidFormControl(control: FormControl) {
    return control?.invalid && (control?.touched || control?.dirty);
  }

  static getFormControlError(control: FormControl) {
    const errors = control?.errors ?? {};
    return FormHelpers.getErrorMessage(errors);
  }

  static isInvalidFieldInformArray(formArray: FormArray, index: number) {
    const control = formArray.at(index) as FormControl;
    return control?.invalid && (control?.touched || control?.dirty);
  }

  static getFieldErrorInformArray(formArray: FormArray, index: number) {
    const control = formArray.at(index) as FormControl;
    const errors = control?.errors ?? {};
    return FormHelpers.getErrorMessage(errors);
  }

  static async checkingUsernameTaken(control: FormControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(control.value === 'fernando' ? { usernameTaken: true } : null);
      }, 1000);
    });
  }

  static checkingEmailTaken(control: FormControl): ValidationErrors | null {
    return control.value === 'test@test.com' ? { emailInvalid: true } : null;
  }

  static markAllAsTouched(formGroup: FormGroup) {
    formGroup.markAllAsTouched();
    formGroup.markAsDirty();
    formGroup.updateValueAndValidity();
  }

  private static getErrorMessage(errors: ValidationErrors) {
    for (const key in errors) {
      switch (key) {
        case 'required':
          return `Este campo es requerido`;
        case 'minlength':
          return `El campo debe de tener al menos ${errors[key].requiredLength} caracteres, actualmente tiene ${errors[key].actualLength}`;
        case 'min':
          return `El campo debe de ser mayor o igual a ${errors[key].min}, actualmente es ${errors[key].actual}`;
        case 'email':
          return `El campo debe de ser un email válido`;
        case 'pattern':
          switch (errors[key].requiredPattern) {
            case FormHelpers.namePattern:
              return `El campo debe de tener un nombre y apellido válidos`;
            case FormHelpers.passwordPattern:
              return `El campo debe de tener al menos 4 caracteres, incluyendo una mayúscula, una minúscula y un número`;
            case FormHelpers.emailPattern:
              return `El campo debe de ser un email válido`;
            default:
              return `El campo no cumple con el patrón requerido`;
          }
        case 'emailInvalid':
          return `El email es de prueba y no es válido`;
        case 'usernameTaken':
          return `El nombre de usuario ya está en uso`;
        case 'slugTaken':
          return `El slug ya está en uso`;
        default:
          return 'Error desconocido en el campo';
      }
    }
    return null;
  }
}
