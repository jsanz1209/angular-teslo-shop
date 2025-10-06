import { Routes } from '@angular/router';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/admin-dashboard-layout/admin-dashboard-layout.component').then(m => m.AdminDashboardLayoutComponent),
    children: [
      {
        path: 'products',
        loadComponent: () => import('./pages/products-admin-page/products-admin-page.component').then(m => m.ProductsAdminPageComponent),
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./pages/product-admin-page/product-admin-page.component').then(m => m.ProductAdminPageComponent),
      },
      {
        path: '**',
        redirectTo: 'products',
        pathMatch: 'full',
      }
    ]
  }
]
