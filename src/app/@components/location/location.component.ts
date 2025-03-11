import { Component } from '@angular/core';
import { ListLocationsComponent } from '@components/location/list-locations/list-locations.component';
import { DxAccordionModule, } from 'devextreme-angular';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    ListLocationsComponent,
    DxAccordionModule],
  template: `
  <dx-accordion
  #accordion
  [dataSource]="['Ubicaciones']"
  [selectedItems]="['Ubicaciones']"
>
  <div *dxTemplate="let tab of 'title'">
    <div class="header">{{ tab }}</div>
  </div>
  <div *dxTemplate="let tab of 'item'">
    <app-list-locations
    style="display:flex;flex-wrap: wrap;justify-content:center"
    ></app-list-locations>

  </div>
</dx-accordion>
`,
})
export class LocationComponent {

}
