import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProcesoStep {
  title: string;
  description: string;
}

@Component({
  selector: 'app-section-proceso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proceso.component.html',
  styleUrl: './proceso.component.scss',
})
export class ProcesoSectionComponent {
  steps: ProcesoStep[] = [
    {
      title: 'Envíanos los datos de tu propiedad',
      description: 'Completa nuestro formulario con la información básica de tu inmueble.',
    },
    {
      title: 'Visita de validación',
      description: 'Un especialista revisará el inmueble para confirmar los detalles.',
    },
    {
      title: 'Recibe una oferta',
      description: 'Analizamos tu propiedad y te presentamos una oferta en poco tiempo.',
    },
    {
      title: 'Recibe tu dinero',
      description: 'Si aceptas la oferta, cerramos el proceso y recibes tu pago de forma segura.',
    },
  ];
}
