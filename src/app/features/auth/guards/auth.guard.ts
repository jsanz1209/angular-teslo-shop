import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, type CanMatchFn } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = async (route, segments) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = await firstValueFrom(authSrv.checkStatus());
  if (!isAuthenticated) {
    return true;
  } else {
    router.navigate(['/store']);
    return false;
  }
};
