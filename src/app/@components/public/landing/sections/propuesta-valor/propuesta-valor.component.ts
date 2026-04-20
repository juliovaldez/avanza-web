import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-propuesta-valor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './propuesta-valor.component.html',
  styleUrl: './propuesta-valor.component.scss',
})
export class PropuestaValorSectionComponent {
  features = [
    'Vende tu propiedad en tiempo récord.',
    'Sin comisiones ocultas ni sorpresas.',
    'Proceso 100% transparente.',
    'Acompañamiento profesional en todo momento.',
  ];
}
