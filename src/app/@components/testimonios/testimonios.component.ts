import { Component } from '@angular/core';
import { ListTestimoniosComponent } from './list-testimonios/list-testimonios.component';

@Component({
  selector: 'app-testimonios',
  standalone: true,
  imports: [ListTestimoniosComponent],
  template: `<div class="card-flex-box"><app-list-testimonios></app-list-testimonios></div>`,
})
export class TestimoniosComponent {}
