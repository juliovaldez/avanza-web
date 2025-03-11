import { Component } from '@angular/core';
import { ListIngressesComponent } from '@components/transaction/list-transactions/list-transactions.component';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [ListIngressesComponent],
  template: `
  <div class="card-flex-box">
  <app-list-ingresses></app-list-ingresses>
</div>
  `,
  
})
export class TransactionComponent {

}
