import { Component } from '@angular/core';
import { ListStatusComponent } from '@components/status/list-status/list-status.component';
import { DxAccordionModule, } from 'devextreme-angular';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    ListStatusComponent,
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
    <app-list-status
    style="display:flex;flex-wrap: wrap;justify-content:center"
    ></app-list-status>

  </div>
</dx-accordion>
`,
})
export class StatusComponent {

}
