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
} from "@models/index";
import {
  TxnDocumentService,
  TransactionService,
  MaterialService,
  UnitService,
  StatusService,
  UnitConversionService,
  UserService,
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
import { interval, Subscription } from "rxjs";

@Component({
  selector: "app-form-transaction-in",
  standalone: true,
  imports: [
    DxPopupModule,
    DxButtonModule,
    DxFormModule,
    DxDataGridModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
  ],
  templateUrl: "./form-transaction-in.component.html",
})
export class FormTransactionInComponent {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  public popupVisible: boolean = true;
  public formTransaction = signal<Transaction>(new Transaction());

  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "95%",
    md: "85%",
    lg: "80%",
    xl: "70%",
    xxl: "60%",
  });

  public txnDocumentDatasource: Array<TxnDocument> = [];
  public materials: Array<Material> = [];
  public unitTransactions: Array<Unit> = [];
  public status: Array<Status> = [];
  public _unitConversions: Array<UnitConversion> = [];
  public unitConversions_temp: Array<UnitConversion> = [];


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
    effect(() => {
      this.formTransaction().txn_document && this.loadTxnDocument();
    });
  }

  get unitConversions() {
    return this._unitConversions.filter(
      (unitconv) => unitconv.material == this.formTransaction().material
    );
  }

  ngOnInit(): void { }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  setDataForm(data: Transaction) {
    this.formTransaction.set(data);
  }

  loadForm(id: number): void {
    id &&
      this.transactionStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response: Transaction) => {
            this.formTransaction.set(response);
          },
        });
  }

  newModel() {
    this.formTransaction.set(
      new Transaction({
        txn_document: this.formTransaction().txn_document,
      })
    );
  }

  loadTxnDocument(): void {
    this.txtDocumentStore.showLoading()
      ._load({
        filter: ["id", "=", this.formTransaction().txn_document],
      })
      .subscribe({
        next: (data) => {
          this.txnDocumentDatasource = data.data as Array<TxnDocument>;
        },
      });

  }

  initRelatedData(): void {
    this.subscriptions.push(
      this.unitConversionStore
        .showLoading()
        ._load()
        .subscribe({
          next: (data: any) => {

            this._unitConversions = data.data;
          },
        }),
      this.materialStore
        .showLoading()
        ._load()
        .subscribe({
          next: (data: any) => {
            this.materials = data.data;
          },
        }),
      this.statusStore
        .showLoading()
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
    console.log(e);

    // this.unitConversions_temp = this.unitConversions.filter(
    //   (unitconv) => unitconv.material == e.selectedItem.id
    // );

    this.formTransaction().base_unit = this.formTransaction().transaction_unit =
      e.selectedItem.unit_base;
  };

  onTransactionUnitChanged = (e: { selectedItem: UnitConversion }) => {
    if (!e.selectedItem) return;
    this.formTransaction().conversion_factor = e.selectedItem.conversion_factor;
    this.formTransaction().calculateBaseQty();
  };

  onTransactionQtyChanged = (e: any) => {
    this.formTransaction().calculateBaseQty();
  };

  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;
    this.transactionStore
      .showLoading()
      ._save(this.formTransaction().id, this.formTransaction())
      .subscribe({
        next: (response: Transaction) => {
          this.formTransaction.set(new Transaction(response));
          this.eventBusService.emit(
            this.formTransaction().id
              ? EventTypes.transaction_updated
              : EventTypes.transaction_added
          );
          //this.popupVisible = false;
        },
        error: () => { },
      });
  }
}
