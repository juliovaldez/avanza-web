import { Routes } from '@angular/router';
import { AuthGuardService } from '@services/guards/auth.guard';
import { PublicLayoutComponent } from './@components/public/layout/public-layout.component';

export const routes: Routes = [
  // Sitio público
  {
    path: '',
    component: PublicLayoutComponent,
    data: { public: true },
    children: [
      {
        path: '',
        title: 'Avanza Tecnología Inmobiliaria',
        loadComponent: () =>
          import('./@components/public/landing/landing.component').then(
            (m) => m.LandingComponent
          ),
      },
      {
        path: 'vende',
        title: 'Vende tu propiedad — Avanza',
        loadComponent: () =>
          import('./@components/public/landing/landing.component').then(
            (m) => m.LandingComponent
          ),
      },
      {
        path: 'compra',
        title: 'Compra tu propiedad — Avanza',
        loadComponent: () =>
          import('./@components/public/landing/landing.component').then(
            (m) => m.LandingComponent
          ),
      },
      {
        path: 'quienes-somos',
        title: '¿Quiénes somos? — Avanza',
        loadComponent: () =>
          import('./@components/public/landing/landing.component').then(
            (m) => m.LandingComponent
          ),
      },
    ],
  },
  // Admin (protegido)
  {
    path: 'home',
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        title: 'Dashboard',
        loadComponent: () =>
          import('./@components').then((m) => m.DashboardComponent),
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () =>
          import('./@components').then((m) => m.UsersComponent),
      },
      {
        path: 'groups',
        title: 'Grupos',
        loadComponent: () =>
          import('./@components').then((m) => m.GroupsComponent),
      },
      {
        path: 'testimonios',
        title: 'Testimonios',
        loadComponent: () =>
          import('./@components').then((m) => m.TestimoniosComponent),
      },
      {
        path: 'casos-exito',
        title: 'Casos de Éxito',
        loadComponent: () =>
          import('./@components').then((m) => m.CasosExitoAdminComponent),
      },
      {
        path: 'contacto',
        title: 'Contacto',
        loadComponent: () =>
          import('./@components').then((m) => m.ContactoAdminComponent),
      },
    ],
  },
  // Auth
  {
    path: 'login-form',
    title: 'Login',
    loadComponent: () =>
      import('@components/auth').then((m) => m.LoginFormComponent),
    canActivate: [AuthGuardService],
  },
  {
    path: 'reset-password',
    title: 'Reset Password',
    loadComponent: () =>
      import('@components/auth').then((m) => m.ResetPasswordFormComponent),
    canActivate: [AuthGuardService],
  },
  {
    path: 'change-password/:recoveryCode',
    title: 'Change Password',
    loadComponent: () =>
      import('@components/auth').then((m) => m.ChangePasswordFormComponent),
    canActivate: [AuthGuardService],
  },
  { path: '**', redirectTo: '' },
];
