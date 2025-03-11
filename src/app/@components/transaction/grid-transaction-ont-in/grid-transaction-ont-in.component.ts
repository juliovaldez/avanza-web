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
  DxDataGridComponent,
} from "devextreme-angular";
import {
  EventBusService,
  ResponsiveService,
  widthsSpan,
  EventTypes,
} from "@services/core/";
import { Subscription } from "rxjs";
import { EditorPreparingEvent, InitNewRowEvent, RowUpdatingEvent } from "devextreme/ui/data_grid";

@Component({
  selector: "app-grid-transaction-ont-in",
  standalone: true,
  imports: [
    DxPopupModule,
    DxButtonModule,
    DxFormModule,
    DxDataGridModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
  ],
  templateUrl: "./grid-transaction-ont-in.component.html",
})
export class GridTransactionOntInComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;

  public popupVisible: boolean = true;
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "95%",
    md: "96%",
    lg: "90%",
    xl: "90%",
    xxl: "90%",
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
      this.fromUser().id && this.getUserMaterials();
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

  getUserMaterials() {
    this.materialStore._load({
      filter: ["name", "contains", 'ONT']
    }).subscribe({
      next: (response) => {
        this.materials = response.data as Array<Material>;
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
          filter: ["module_name", "=", Status.STATUS_TRANSACTION],
        })
        .subscribe({
          next: (response) => {
            this.status = response.data as Array<Status>;
          },
        }),

      this.unitStore._load({ all: true }).subscribe({
        next: (response) => {
          this.units = response.data as Array<Unit>;
        },
      }),

    );
  }

  onInitNewRow(e: InitNewRowEvent) {
    console.log(e);
    e.data = new Transaction({
      id: Date.now(),
      txn_document: this.txnDocument().id,
      base_quantity: 1,
      transaction_quantity: 1,
      conversion_factor: 1
    });
  }
  onCellPrepared(e: any) {
    console.log(e);
    if (e.rowType == 'data' && e.column.dataField == 'material') {
      // e.editorOptions.onSelectionChanged = (args: any) => {
      //   console.log(args);
      //   //e.component.cellValue(e.row?.rowIndex!, 'base_unit', 1)
      // }
    }
  }
  onFocusedCellChanged(e: any) {
    console.log(e);

  }
  calculateFilterExpression = (filterValue: any, selectedRowData: any) => {
    console.log(selectedRowData);
    if (selectedRowData) {
      return ['material', '=', selectedRowData.material];
    }
    return [];
  };
  setCellValueMaterial = (newData: any, value: any, currentRowData: any) => {
    console.log([newData], [value], [currentRowData])
    const material = this.materials.find(material => material.id = value);
    if (material) {
      newData.material = material.id;
      newData.base_unit = material.unit_base;
      //newData.transaction_unit = material.unit_base;
    }
  }
  setCellValueTransactionUnit = (newData: any, value: any, currentRowData: any) => {
    console.log([newData], [value], [currentRowData]);

  }

  onRowUpdated = (e: { data: Transaction }) => {
    e.data.calculateBaseQty();
  };
  onTransactionMaterialChanged = (e: { selectedItem: Material }, cellInfo: { component: any, row: any, data: Transaction }) => {
    if (!e.selectedItem || !cellInfo) return;
    console.log(e, cellInfo);
    cellInfo.data.base_unit = e.selectedItem.unit_base;
    cellInfo.data.transaction_unit = e.selectedItem.unit_base;
    //cellInfo.component.refresh();
    //cellInfo.component.cellValue()
    //this.dataGrid?.instance.cellValue(cellInfo.row?.rowIndex!, 'base_unit', e.selectedItem.unit_base);
    //this.dataGrid?.instance.cellValue(cellInfo.row?.rowIndex!, 'transaction_unit', e.selectedItem.unit_base);
    //cellInfo.component.cellValue(cellInfo.row?.rowIndex!, 'base_unit', e.selectedItem.unit_base)
    //cellInfo.component.cellValue(cellInfo.row?.rowIndex!, 'transaction_unit', e.selectedItem.unit_base)
    //cellInfo.data.calculateBaseQty();

  };

  onTransactionUnitChanged = (e: { selectedItem: UnitConversion }, cellInfo: any) => {
    console.log(e, cellInfo);
    if (!e.selectedItem || !cellInfo) return;
    cellInfo.data.conversion_factor = e.selectedItem.conversion_factor;
    //this.dataGrid?.instance.cellValue(cellInfo.rowIndex!, 'conversion_factor', e.selectedItem.conversion_factor);
    cellInfo.data.calculateBaseQty();

  };

  clearTransactions(): void {
    this.transactions = this.transactions.filter((transaction) => (transaction.transaction_quantity! > 0 && transaction.serial_number));
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
