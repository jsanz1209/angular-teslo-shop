import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async(route, segments) => {
 const authSrv = inject(AuthService);
 const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authSrv.checkStatus());
  const isAdmin = authSrv.isAdminUser();
   if (isAuthenticated && isAdmin) {
     return true;
   } else {
     router.navigate(['/auth']);
     return false;
   }
};
