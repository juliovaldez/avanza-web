import { Component } from '@angular/core';
import { ListUnitConversionsComponent } from '@components/unit-conversion/list-unit-conversions/list-unit-conversions.component';
@Component({
  selector: 'app-unit-conversion',
  standalone: true,
  imports:[ListUnitConversionsComponent],
  template: `
  <div class="card-flex-box">
    <app-list-unit-conversions></app-list-unit-conversions>
  </div>
`,
})
export class UnitConversionComponent {

}
