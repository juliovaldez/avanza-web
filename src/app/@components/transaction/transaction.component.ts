import { Component } from "@angular/core";
import { ListTransactionsComponent } from "@components/transaction/list-transactions/list-transactions.component";

@Component({
  selector: "app-transaction",
  standalone: true,
  imports: [ListTransactionsComponent],
  template: `
    <div class="card-flex-box">
      <app-list-transactions></app-list-transactions>
    </div>
  `,
})
export class TransactionComponent {}
