import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Servicio {
  icon: string;
  titulo: string;
  descripcion: string;
  ctaLabel: string;
  ctaLink: string;
}

@Component({
  selector: 'app-section-servicios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss',
})
export class ServiciosSectionComponent {
  servicios: Servicio[] = [
    {
      icon: 'assets/images/servicio-vende.png',
      titulo: 'Vende tu casa',
      descripcion: 'Obtén una oferta rápida por tu propiedad y vende sin complicaciones.',
      ctaLabel: 'Pedir oferta',
      ctaLink: '/vende',
    },
    {
      icon: 'assets/images/servicio-compra.png',
      titulo: 'Compra una casa',
      descripcion: 'Explora propiedades disponibles cuidadosamente seleccionadas.',
      ctaLabel: 'Pedir oferta',
      ctaLink: '/compra',
    },
    {
      icon: 'assets/images/servicio-invierte.png',
      titulo: 'Invierte con nosotros',
      descripcion: 'Descubre oportunidades inmobiliarias con alto potencial de crecimiento.',
      ctaLabel: 'Pedir oferta',
      ctaLink: '/quienes-somos',
    },
  ];
}
