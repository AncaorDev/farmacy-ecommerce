import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/app-shell/app-shell').then((m) => m.AppShell),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/product-list/product-list-page').then((m) => m.ProductListPage)
      },
      {
        path: 'productos/:slug',
        loadComponent: () =>
          import('./features/product-detail/product-detail-page').then((m) => m.ProductDetailPage)
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('./features/cart/cart-page').then((m) => m.CartPage)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
