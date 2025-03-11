import { Component, OnDestroy, OnInit, ViewChild, signal } from "@angular/core";
import {
  Transaction,
  Material,
  Unit,
  User,
  Status,
  UnitConversion,
  TxnDocument,
} from "@models/index";
import {
  TxnDocumentService,
  TransactionService,
  MaterialService,
  UnitService,
  StatusService,
  UnitConversionService,
} from "@services/api";
import {
  DxPopupModule,
  DxButtonModule,
  DxFormModule,
  DxFormComponent,
  DxDataGridModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
} from "devextreme-angular";
import {
  EventBusService,
  ResponsiveService,
  widthsSpan,
  EventTypes,
} from "@services/core/";
import { Subscription } from "rxjs";

@Component({
  selector: "app-form-transaction-transfer",
  standalone: true,
  imports: [
    DxPopupModule,
    DxButtonModule,
    DxFormModule,
    DxDataGridModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
  ],
  templateUrl: "./form-transaction-transfer.component.html",
})
export class FormTransactionTransferComponent {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  public popupVisible: boolean = true;
  public formTransaction: Transaction = new Transaction();

  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "95%",
    md: "85%",
    lg: "80%",
    xl: "70%",
    xxl: "60%",
  });

  public txnDocumentDatasource!: Array<TxnDocument>;
  public materials!: Array<Material>;
  public unitTransactions!: Array<Unit>;
  public status!: Array<Status>;
  public unitConversions!: Array<UnitConversion>;
  public unitConversions_temp!: Array<UnitConversion>;

  public transactionStore;
  public txtDocumentStore;
  public materialStore;
  public unitConversionStore;
  public statusStore;
  constructor(
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    public txnDocumentService: TxnDocumentService,
    private transactionService: TransactionService,
    public materialService: MaterialService,
    public unitService: UnitService,
    public statusService: StatusService,
    public unitConversionService: UnitConversionService
  ) {
    this.transactionStore = this.transactionService.getStore();
    this.txtDocumentStore = this.txnDocumentService.getStore({ all: true });
    this.materialStore = this.materialService.getStore({ all: true });
    this.unitConversionStore = this.unitConversionService.getStore({ all: true });
    this.statusStore = this.statusService.getStore({ all: true });

    this.responsiveService.makeObserver(this.widthsSpan);
    this.initRelatedData();
  }

  ngOnInit(): void { }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  loadForm(id: number): void {
    id &&
      this.transactionStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response: Transaction) => {
            this.formTransaction = response;
          },
        });
  }
  newModel() {
    this.formTransaction = new Transaction({
      txn_document: this.formTransaction.txn_document,
    });
  }

  initForm(data: Transaction) {
    Object.assign(this.formTransaction, data);
  }

  initRelatedData(): void {
    this.subscriptions.push(
      this.txtDocumentStore._load().subscribe({
        next: (data) => {
          this.txnDocumentDatasource = data.data as Array<TxnDocument>;
        },
      }),
      this.materialStore._load().subscribe({
        next: (data) => {
          this.materials = data.data as Array<Material>;
        },
      }),
      this.unitConversionStore._load().subscribe({
        next: (data: any) => {
          this.unitConversions = data.data;
        },
      }),
      this.statusStore
        ._load({
          all: true,
          filter: ["module_name", "=", Status.STATUS_TRANSACTION],
        })
        .subscribe({
          next: (data: any) => {
            this.status = data.data;
          },
        })
    );
  }
  onMaterialChanged = (e: { selectedItem: Material }) => {
    if (!e.selectedItem) return;
    this.unitConversions_temp = this.unitConversions.filter(
      (unitconv) => unitconv.material == e.selectedItem.id
    );
    this.formTransaction.base_unit = this.formTransaction.transaction_unit =
      e.selectedItem.unit_base;
  };

  onTransactionUnitChanged = (e: { selectedItem: UnitConversion }) => {
    if (!e.selectedItem) return;
    this.formTransaction.conversion_factor = e.selectedItem.conversion_factor;
    this.formTransaction.calculateBaseQty();
  };
  onTransactionQtyChanged = (e: any) => {
    this.formTransaction.calculateBaseQty();
  };

  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;
    this.transactionStore
      .showLoading()
      ._save(this.formTransaction.id, this.formTransaction)
      .subscribe({
        next: (response: Transaction) => {
          this.formTransaction = response;
          this.eventBusService.emit(
            this.formTransaction.id
              ? EventTypes.transaction_updated
              : EventTypes.transaction_added
          );
          //this.popupVisible = false;
        },
        error: () => { },
      });
  }
}
