import { Routes } from '@angular/router';
import { AuthGuardService } from '@services/guards/auth.guard';

export const routes: Routes = [
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
        path: 'locations',
        title: 'Ubicaciones',
        loadComponent: () =>
          import('./@components').then((m) => m.LocationComponent),
      },
      {
        path: 'units',
        title: 'Unidades',
        loadComponent: () =>
          import('./@components').then((m) => m.UnitsComponent),
      },
      {
        path: 'status',
        title: 'Estatus',
        loadComponent: () =>
          import('./@components').then((m) => m.StatusComponent),
      },
      {
        path: 'materials',
        title: 'Materiales',
        loadComponent: () =>
          import('./@components').then((m) => m.MaterialComponent),
      },
      {
        path: 'unit-conversions',
        title: 'Conversion Unidades',
        loadComponent: () =>
          import('./@components').then((m) => m.UnitConversionComponent),
      },
      {
        path: 'transaction-types',
        title: 'Tipo de Transacciones',
        loadComponent: () =>
          import('./@components').then((m) => m.TransactionTypeComponent),
      },
      {
        path: 'txn-documents',
        title: 'Txn Documents',
        loadComponent: () =>
          import('./@components').then((m) => m.TxnDocumentComponent),
      },
      {
        path: 'drives',
        title: 'Tecnicos',
        loadComponent: () =>
          import('./@components').then((m) => m.DriverComponent),
      },
    ],
  },
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
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'home',
  },
];
