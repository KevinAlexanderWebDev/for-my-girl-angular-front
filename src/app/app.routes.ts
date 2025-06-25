import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login-page/login-page').then(m => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home-page/home-page').then(m => m.HomePage),
    // luego le pondremos el guard aquí
  },
  {
    path: 'biblioteca/:id',
    loadComponent: () =>
      import('./pages/biblioteca/biblioteca-page/biblioteca-page').then(m => m.BibliotecaPage),
    // luego le pondremos el guard aquí
  },
  {
    path: 'crea-tu-recuerdo',
    loadComponent: () =>
      import('./pages/crea-turecuerdo/crea-tu-recuerdo/crea-tu-recuerdo-page/crea-tu-recuerdo-page').then(m => m.CreaTuRecuerdoPage),
    // luego le pondremos el guard aquí
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
