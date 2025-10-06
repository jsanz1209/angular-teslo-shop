import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { isAdminGuard } from './features/admin-dashboard/guards/is-admin.guard';

export const routes: Routes = [
  {
    path: 'store',
    loadChildren: () => import('./features/store-front/store-front.routes').then(m => m.storeFrontRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
    canMatch: [authGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin-dashboard/admin-dashboard.routes').then(m => m.adminDashboardRoutes),
    canMatch: [isAdminGuard],
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
