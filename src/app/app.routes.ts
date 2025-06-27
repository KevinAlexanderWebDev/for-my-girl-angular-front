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
  },
  {
    path: 'biblioteca/:id',
    loadComponent: () =>
      import('./pages/biblioteca/biblioteca-page/biblioteca-page').then(m => m.BibliotecaPage),
  },
  {
    path: 'crea-tu-recuerdo',
    loadComponent: () =>
      import('./pages/crea-turecuerdo/crea-tu-recuerdo/crea-tu-recuerdo-page/crea-tu-recuerdo-page').then(m => m.CreaTuRecuerdoPage),
  },
  {
    path: 'editor-de-recuerdos/:id',
    loadComponent: () =>
      import('./pages/editor-de-recuerdos/editor-de-recuerdos').then(m => m.EditorDeRecuerdosComponent),
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
