import { Component } from '@angular/core';
import { ListUnitsComponent } from '@components/units/list-units/list-units.component';
import { DxAccordionModule, } from 'devextreme-angular';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [
    ListUnitsComponent,
    DxAccordionModule],
  template: `
  <dx-accordion
  #accordion
  [dataSource]="['Unidades de Medida']"
  [selectedItems]="['Unidades de Medida']"
>
  <div *dxTemplate="let tab of 'title'">
    <div class="header">{{ tab }}</div>
  </div>
  <div *dxTemplate="let tab of 'item'">
    <app-list-units
    style="display:flex;flex-wrap: wrap;justify-content:center"
    ></app-list-units>

  </div>
</dx-accordion>
`,
})
export class UnitsComponent {

}
