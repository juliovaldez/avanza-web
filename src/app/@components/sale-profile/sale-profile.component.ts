import { Component } from '@angular/core';
import { SaleProfileListComponent } from '@components/sale-profile/sale-profile-list/sale-profile-listcomponent';
import { DxAccordionModule, } from 'devextreme-angular';

@Component({
  selector: 'app-sale-profile',
  standalone: true,
  imports: [
    SaleProfileListComponent,
    DxAccordionModule],
  template: `
     <app-sale-profile-list></app-sale-profile-list>
`,
})
export class SaleProfileComponent {

}
