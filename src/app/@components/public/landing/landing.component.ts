import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeroSectionComponent } from './sections/hero/hero.component';
import { ProcesoSectionComponent } from './sections/proceso/proceso.component';
import { ContactoSectionComponent } from './sections/contacto/contacto.component';
import { ServiciosSectionComponent } from './sections/servicios/servicios.component';
import { PropuestaValorSectionComponent } from './sections/propuesta-valor/propuesta-valor.component';
import { CasosExitoSectionComponent } from './sections/casos-exito/casos-exito.component';
import { TestimoniosSectionComponent } from './sections/testimonios/testimonios.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterModule,
    HeroSectionComponent,
    ProcesoSectionComponent,
    ContactoSectionComponent,
    ServiciosSectionComponent,
    PropuestaValorSectionComponent,
    CasosExitoSectionComponent,
    TestimoniosSectionComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
