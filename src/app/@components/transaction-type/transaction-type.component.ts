import { Component } from '@angular/core';
import { ListTransactionTypesComponent } from '@components/transaction-type/list-transaction-types/list-transaction-types.component';
import { DxAccordionModule, } from 'devextreme-angular';

@Component({
  selector: 'app-transaction-type',
  standalone: true,
  imports: [
    ListTransactionTypesComponent,
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
    <app-list-transaction-types
    style="display:flex;flex-wrap: wrap;justify-content:center"
    ></app-list-transaction-types>

  </div>
</dx-accordion>
`,
})
export class TransactionTypeComponent {

}
