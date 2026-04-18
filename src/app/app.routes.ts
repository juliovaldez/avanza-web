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
