import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
  effect,
} from "@angular/core";
import {
  Transaction,
  Material,
  Unit,
  User,
  Status,
  UnitConversion,
  TxnDocument,
  MaterialByUser,
} from "@models/index";
import {
  TxnDocumentService,
  TransactionService,
  MaterialService,
  UnitService,
  StatusService,
  UnitConversionService,
  UserService,
  UserFetcherService,
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
  selector: "app-grid-transaction-in",
  standalone: true,
  imports: [
    DxPopupModule,
    DxButtonModule,
    DxFormModule,
    DxDataGridModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
  ],
  templateUrl: "./grid-transaction-in.component.html",
})
export class GridTransactionInComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  public popupVisible: boolean = true;
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "95%",
    md: "85%",
    lg: "80%",
    xl: "80%",
    xxl: "80%",
  });

  public txnDocument = signal<TxnDocument>(new TxnDocument());
  public fromUser = signal<User>(new User());
  public materialsByUser!: Array<any>;
  public materials!: Array<Material>;
  public status!: Array<Status>;
  public unitConversions!: Array<UnitConversion>;
  public users: Array<User> = [];
  public transactions: Array<Transaction> = [];
  public units: Array<Unit> = [];

  public transactionStore;
  public txtDocumentStore;
  public materialStore;
  public unitConversionStore;
  public statusStore;
  public userStore;
  public unitStore;

  constructor(
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    public txnDocumentService: TxnDocumentService,
    private transactionService: TransactionService,
    public materialService: MaterialService,
    public unitService: UnitService,
    public statusService: StatusService,
    public unitConversionService: UnitConversionService,
    public userService: UserService,
  ) {
    this.transactionStore = this.transactionService.getStore();
    this.txtDocumentStore = this.txnDocumentService.getStore({ all: true });
    this.materialStore = this.materialService.getStore({ all: true });
    this.unitConversionStore = this.unitConversionService.getStore({ all: true });
    this.statusStore = this.statusService.getStore({ all: true });
    this.userStore = this.userService.getStore({ all: true });
    this.unitStore = this.unitService.getStore();

    this.responsiveService.makeObserver(this.widthsSpan);
    this.initRelatedData();

    effect(() => {
      this.fromUser().id && this.getMaterials();
    });
    effect(() => {
      this.txnDocument().id && this.loadFromUser();
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }
  onHidden(): void {
    this.eventBusService.emit(EventTypes.transaction_updated);
  }

  loadTxnDocument(txnDocument: number): void {
    this.txtDocumentStore.showLoading()
      ._byKey(txnDocument).subscribe({
        next: (response) => {
          this.txnDocument.set(response);
        }
      });
  }

  loadFromUser(): void {
    this.userStore.showLoading()._byKey(this.txnDocument().from_user!).subscribe({
      next: (response) => {
        this.fromUser.set(response);
      }
    });
  }

  getMaterials() {
    this.materialStore._load({ filter: ["name", "notcontains", "ONT"] }).subscribe({
      next: (response) => {
        (response.data as Array<Material>).forEach((material: Material, index) => {
          let transaction = new Transaction({
            id: index + 1,
            txn_document: this.txnDocument().id,
            material: material.id,
            transaction_quantity: 0,
            transaction_unit: 0,
            conversion_factor: 0,
            base_quantity: 0,
            base_unit: material.unit_base,
            available_quantity: 0,
            status: 0,
          });
          this.transactions.push(
            transaction
          );
        });
      }
    });
  }

  initRelatedData(): void {
    this.subscriptions.push(
      this.unitConversionStore
        .showLoading()
        ._load()
        .subscribe({
          next: (response) => {
            this.unitConversions = response.data as Array<UnitConversion>;
          },
        }),
      this.statusStore
        .showLoading()
        ._load({
          all: true,
          filter: ["module_name", "=", Status.STATUS_TRANSACTION],
        })
        .subscribe({
          next: (response) => {
            this.status = response.data as Array<Status>;
          },
        }),
      this.materialStore._load().subscribe({
        next: (response) => {
          this.materials = response.data as Array<Material>;
        }
      }),
      this.unitStore._load({ all: true }).subscribe({
        next: (response) => {
          this.units = response.data as Array<Unit>;
        },
      }),

    );
  }

  onRowUpdated = (e: { data: Transaction }) => {
    e.data.calculateBaseQty();
  };

  onTransactionUnitChanged = (e: { selectedItem: UnitConversion }, cellInfo: { data: Transaction }) => {
    if (!e.selectedItem || !cellInfo) return;
    cellInfo.data.conversion_factor = e.selectedItem.conversion_factor;
    cellInfo.data.calculateBaseQty();
  };

  clearTransactions(): void {
    this.transactions = this.transactions.filter((transaction) => transaction.transaction_quantity! > 0);
  }

  save(): void {
    this.clearTransactions();
    this.transactions.forEach((transaction, index) => {
      this.transactionStore
        .showLoading()
        ._save(0, transaction)
        .subscribe({
          next: () => {
            transaction.transaction_quantity = 0;
            this.clearTransactions();
          },
          error: () => { },
        });
    });
  }


}
