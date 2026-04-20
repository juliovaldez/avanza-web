import { Component } from '@angular/core';
import { ListCasosExitoComponent } from './list-casos-exito/list-casos-exito.component';

@Component({
  selector: 'app-casos-exito-admin',
  standalone: true,
  imports: [ListCasosExitoComponent],
  template: `<div class="card-flex-box"><app-list-casos-exito></app-list-casos-exito></div>`,
})
export class CasosExitoAdminComponent {}
