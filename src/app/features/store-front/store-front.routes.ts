import { Routes } from '@angular/router';

export const storeFrontRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/store-front-layout/store-front-layout.component').then(m => m.StoreFrontLayoutComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent),
      },
      {
        path: 'gender/:id',
        loadComponent: () => import('./pages/gender-page/gender-page.component').then(m => m.GenderPageComponent),
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./pages/product-page/product-page.component').then(m => m.ProductPageComponent),
      },
      {
        path: 'not-found',
        loadComponent: () => import('./pages/not-fount-page/not-fount-page.component').then(m => m.NotFountPageComponent),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'not-found'
      }
    ]
  }
]
