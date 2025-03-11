import {
  Component,
  OnDestroy,

  ViewChild,

} from '@angular/core';
import { TransactionType, Unit } from '@models/index';
import { TransactionTypeService } from '@services/api';
import {
  DxPopupModule,
  DxButtonModule,
  DxFormModule,
  DxFormComponent,

} from 'devextreme-angular';
import {
  EventBusService,
  ResponsiveService,
  widthsSpan,
  EventTypes,
} from '@services/core/';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-form-transaction-type',
  standalone: true,
  imports: [DxPopupModule, DxButtonModule, DxFormModule],
  templateUrl: './form-transaction-type.component.html',
})
export class FormTransactionTypeComponent implements OnDestroy {
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  private subscriptions: Subscription[] = [];
  public popupVisible: boolean = true;
  public formTransactionType: TransactionType = new TransactionType({ id: 0 });
  public widthsSpan: widthsSpan = new widthsSpan('100%', {
    xs: '100%',
    sm: '90%',
    md: '80%',
    lg: '70%',
    xl: '60%',
    xxl: '40%',
  });

  public transactionTypeStore;

  constructor(
    private transactionTypeService: TransactionTypeService,
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
  ) {
    this.transactionTypeStore = this.transactionTypeService.getStore();

    this.responsiveService.makeObserver(this.widthsSpan);
    this.initRelatedData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  loadForm(id: number): void {
    id &&
      this.transactionTypeStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response) => {
            this.formTransactionType = response;
          },
        });
  }

  initRelatedData(): void {
  }

  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;
    this.transactionTypeStore
      .showLoading()
      ._save(this.formTransactionType.id, this.formTransactionType)
      .subscribe({
        next: (response) => {
          this.eventBusService.emit(
            this.formTransactionType.id ? EventTypes.transaction_type_updated : EventTypes.transaction_type_added
          );
          this.popupVisible = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
