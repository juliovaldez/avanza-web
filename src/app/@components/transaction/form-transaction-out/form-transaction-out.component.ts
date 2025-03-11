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
  selector: "app-form-transaction-out",
  standalone: true,
  imports: [
    DxPopupModule,
    DxButtonModule,
    DxFormModule,
    DxDataGridModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
  ],
  templateUrl: "./form-transaction-out.component.html",
})
export class FormTransactionOutComponent implements OnInit {
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

  public txnDocument = signal<TxnDocument>(new TxnDocument());
  public materialsByUser: Array<MaterialByUser> = [];
  public unitTransactions: Array<Unit> = [];
  public status: Array<Status> = [];
  public unitConversions: Array<UnitConversion> = [];
  public unitConversions_temp: Array<UnitConversion> = [];
  public materialByUserSelected: MaterialByUser = new MaterialByUser();

  public transactionStore;
  public txtDocumentStore;
  public materialStore;
  public unitConversionStore;
  public statusStore;


  constructor(
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    public txnDocumentService: TxnDocumentService,
    private userFetcherService: UserFetcherService,
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
      this.txnDocument().id && this.getMaterialsByLocation();
    });
    effect(() => {
      this.formTransaction().txn_document && this.loadTxnDocument();
    });
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
    /*this.txtDocumentStore.showLoading()
      ._load({
        filter: ["id", "=", this.formTransaction().txn_document],
      })
      .subscribe({
        next: (response) => {
          if (response.totalCount) {
            this.txnDocument.set(response.data[0]);
          }
        },
      });*/
    this.txtDocumentStore.showLoading()
      ._byKey(this.formTransaction().txn_document as Number).subscribe({
        next: (response) => {
          this.txnDocument.set(response);
        }
      });

  }

  getMaterialsByLocation() {
    this.userFetcherService
      .showLoading()
      .getMaterialsByLocation(this.txnDocument().from_user as number)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.materialsByUser = response.data as Array<MaterialByUser>;
        },
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
        })
    );
  }
  onMaterialByUserChanged = (e: { selectedItem: MaterialByUser }) => {
    if (!e.selectedItem) return;
    //this.formTransaction().material = e.selectedItem.material;
    //this.formTransaction().serial_number = e.selectedItem.serial_number;
    this.materialByUserSelected = e.selectedItem;
    const interval = setInterval(() => {
      try {
        this.unitConversions_temp = this.unitConversions.filter(
          (unitconv) => unitconv.material == e.selectedItem.material
        );
        clearInterval(interval);
      } catch (error) { }
    }, 1000);

    this.formTransaction().base_unit = this.formTransaction().transaction_unit =
      e.selectedItem.base_unit;
    console.log(this.formTransaction());
  };

  onTransactionUnitChanged = (e: { selectedItem: UnitConversion }) => {
    if (!e.selectedItem) return;
    this.formTransaction().conversion_factor = e.selectedItem.conversion_factor;
    this.formTransaction().calculateBaseQty();
  };
  onTransactionQtyChanged = (e: any) => {
    if (e.event) {
      //logica para cambio de cantidad disponible
    }
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
