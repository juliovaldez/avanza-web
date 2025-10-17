import { Component } from '@angular/core';
import { StatusListComponent } from '@components/status/status-list/status-list.component';
import { DxAccordionModule, } from 'devextreme-angular';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    StatusListComponent,
    DxAccordionModule],
  template: `
  <dx-accordion
  #accordion
  [dataSource]="['Estatus']"
  [selectedItems]="['Estatus']"
>
  <div *dxTemplate="let tab of 'title'">
    <div class="header">{{ tab }}</div>
  </div>
  <div *dxTemplate="let tab of 'item'">
    <app-status-list
    style="display:flex;flex-wrap: wrap;justify-content:center"
    ></app-status-list>

  </div>
</dx-accordion>
`,
})
export class StatusComponent {

}
