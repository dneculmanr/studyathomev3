import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Redirige raíz a login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Login (sin guard)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },

  // Menú (protegido)
  {
    path: 'menu',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/menu/menu.page').then(m => m.MenuPage)
  },

  // Calendario (protegido)
  {
    path: 'calendario',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/calendario/calendario.page').then(m => m.CalendarioPage)
  },

  // Asignaturas (protegido)
  {
    path: 'asignaturas',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/asignaturas/asignaturas.page').then(m => m.AsignaturasPage)
  },

  // Resumen (protegido)
  {
    path: 'resumen',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/resumen/resumen.page').then(m => m.ResumenPage)
  },

  // 👇 NUEVA RUTA APUNTES (protegida)
  {
    path: 'apuntes',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/apuntes/apuntes.page').then(m => m.ApuntesPage)
  },

  // 404 - Not found
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.page').then(m => m.NotFoundPage)
  }
];
