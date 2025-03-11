import { Component } from '@angular/core';
import { ListMaterialsComponent } from '@components/material/list-materials/list-materials.component';
@Component({
  selector: 'app-material',
  standalone: true,
  imports:[ListMaterialsComponent],
  template: `
  <div class="card-flex-box">
    <app-list-materials></app-list-materials>
  </div>
`,
})
export class MaterialComponent {

}
