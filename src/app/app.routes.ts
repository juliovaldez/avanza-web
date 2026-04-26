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
      {
        path: 'sepomex',
        title: 'Actualización SEPOMEX',
        loadComponent: () =>
          import('./@components').then((m) => m.SepomexComponent),
      },
      // ── Propiedades ──────────────────────────────────────────────────
      {
        path: 'propiedades',
        title: 'Propiedades',
        loadComponent: () => import('./@components').then((m) => m.ListPropiedadesComponent),
      },
      {
        path: 'propiedades/nueva',
        title: 'Nueva Propiedad',
        loadComponent: () => import('./@components').then((m) => m.FormPropiedadComponent),
      },
      {
        path: 'propiedades/:id/editar',
        title: 'Editar Propiedad',
        loadComponent: () => import('./@components').then((m) => m.FormPropiedadComponent),
      },
      // ── Catálogos ────────────────────────────────────────────────────
      {
        path: 'catalogo/tipo-propiedad',
        title: 'Tipos de Propiedad',
        loadComponent: () => import('./@components').then((m) => m.CatalogoAdminComponent),
        data: { titulo: 'Tipos de Propiedad', tipo: 'tipo-propiedad' },
      },
      {
        path: 'calidad/calidad-construccion',
        title: 'Calidad de Construcción',
        loadComponent: () => import('./@components').then((m) => m.CatalogoAdminComponent),
        data: { titulo: 'Calidad de Construcción', tipo: 'calidad-construccion' },
      },
      {
        path: 'calidad/estado-conservacion',
        title: 'Estado de Conservación',
        loadComponent: () => import('./@components').then((m) => m.CatalogoAdminComponent),
        data: { titulo: 'Estado de Conservación', tipo: 'estado-conservacion' },
      },
      {
        path: 'calidad/tipo-acabado',
        title: 'Tipo de Acabado',
        loadComponent: () => import('./@components').then((m) => m.CatalogoAdminComponent),
        data: { titulo: 'Tipo de Acabado', tipo: 'tipo-acabado' },
      },
      {
        path: 'calidad/mantenimiento',
        title: 'Mantenimiento',
        loadComponent: () => import('./@components').then((m) => m.CatalogoAdminComponent),
        data: { titulo: 'Mantenimiento', tipo: 'mantenimiento' },
      },
      {
        path: 'calidad/equipamiento',
        title: 'Equipamiento',
        loadComponent: () => import('./@components').then((m) => m.CatalogoAdminComponent),
        data: { titulo: 'Equipamiento', tipo: 'equipamiento' },
      },
      {
        path: 'documentacion/documento-propiedad',
        title: 'Documentos de la Propiedad',
        loadComponent: () => import('./@components').then((m) => m.CatalogoAdminComponent),
        data: { titulo: 'Documentos de la Propiedad', tipo: 'documento-propiedad' },
      },
      {
        path: 'documentacion/predial',
        title: 'Predial',
        loadComponent: () => import('./@components').then((m) => m.CatalogoAdminComponent),
        data: { titulo: 'Predial', tipo: 'predial' },
      },
      {
        path: 'documentacion/servicios-corriente',
        title: 'Servicios al Corriente',
        loadComponent: () => import('./@components').then((m) => m.CatalogoAdminComponent),
        data: { titulo: 'Servicios al Corriente', tipo: 'servicios-corriente' },
      },
      {
        path: 'documentacion/gravamen',
        title: 'Gravamen',
        loadComponent: () => import('./@components').then((m) => m.CatalogoAdminComponent),
        data: { titulo: 'Gravamen', tipo: 'gravamen' },
      },
      {
        path: 'documentacion/situacion-legal',
        title: 'Situación Legal',
        loadComponent: () => import('./@components').then((m) => m.CatalogoAdminComponent),
        data: { titulo: 'Situación Legal', tipo: 'situacion-legal' },
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
  {
    path: 'auth/google/callback',
    title: 'Google Login',
    loadComponent: () =>
      import('@components/auth').then((m) => m.GoogleCallbackComponent),
  },
  { path: '**', redirectTo: '' },
];
