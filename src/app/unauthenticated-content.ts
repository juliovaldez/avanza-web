import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SingleCardComponent } from '@components/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthenticated-content',
  standalone: true,
  imports: [CommonModule, RouterModule, SingleCardComponent],
  template: `
    <app-single-card [title]="title" [description]="description">
      <router-outlet></router-outlet>
    </app-single-card>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class UnauthenticatedContentComponent {
  constructor(private router: Router) {}

  get title() {
    const path = this.router.url.split('/')[1];
    switch (path) {
      case 'login-form':
        return 'Inicia sesión';
      case 'reset-password':
        return 'Recuperar Contraseña';
      case 'change-password':
        return 'Cambiar Contraseña';
      default:
        return '';
    }
  }

  get description() {
    const path = this.router.url.split('/')[1];
    switch (path) {
      case 'reset-password':
        return '';
      default:
        return '';
    }
  }
}
