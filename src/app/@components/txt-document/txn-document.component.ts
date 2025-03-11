import { Component } from '@angular/core';
import { ListTxnDocumentsComponent } from '@components/txt-document/list-txn-documents/list-txn-documents.component';
import { ListTransactionsComponent } from '@components/transaction/list-transactions/list-transactions.component';

@Component({
  selector: 'app-txn-document',
  standalone: true,
  imports: [ListTxnDocumentsComponent,ListTransactionsComponent],
  template: `
  <div >
  <app-list-txn-documents></app-list-txn-documents>
  <app-list-transactions></app-list-transactions>
</div>
  `,

})
export class TxnDocumentComponent {
}
