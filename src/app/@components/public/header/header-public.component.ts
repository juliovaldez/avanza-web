import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

export interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-public.component.html',
  styleUrls: ['./header-public.component.scss'],
})
export class PublicHeaderComponent {
  navLinks: NavLink[] = [
    { label: 'Vende', path: '/vende' },
    { label: 'Compra', path: '/compra' },
    { label: '¿Quiénes somos?', path: '/quienes-somos' },
  ];
}
