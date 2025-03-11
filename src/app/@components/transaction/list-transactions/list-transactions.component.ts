import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AuthService,
  PERMISSIONS,
  LazyLoadService,
  lazyWidgets,
  EventBusService,
  EventTypes,
  widthsSpan,
  ResponsiveService,
  DataBus,
} from "@services/core";
import {
  TxnDocumentService,
  TransactionService,
  MaterialService,
  UnitService,
  StatusService,
  TransactionTypeService,
} from "@services/api";
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
  DxPopupModule,
} from "devextreme-angular";
import { Subscription } from "rxjs";
import {
  Unit,
  Status,
  GridConf,
  Transaction,
  TxnDocument,
  TransactionType,
  Material,
  User,
} from "@models/index";
import { FormTransactionInComponent } from "@components/transaction/form-transaction-in/form-transaction-in.component";
@Component({
  selector: "app-list-transactions",
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxAccordionModule,
    DxPopupModule,
  ],
  templateUrl: "./list-transactions.component.html",
})
export class ListTransactionsComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;
  @ViewChild("lazyContainer", { read: ViewContainerRef })
  lazyContainer!: ViewContainerRef;
  public showOnPopup: boolean = false;
  public dataGridConf: GridConf = new GridConf();
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "90%",
    sm: "90%",
    md: "90%",
    lg: "90%",
    xl: "90%",
    xxl: "90%",
  });

  public txnTypes: Array<TransactionType> = [];

  public txnDocumentsSelected: Array<TxnDocument> = [];
  public driveSelected: Array<User> = [];

  constructor(
    private authService: AuthService,
    private lazyLoadService: LazyLoadService,
    private eventBusService: EventBusService,
    private responsiveService: ResponsiveService,
    private txnDocumentService: TxnDocumentService,
    private transactionService: TransactionService,
    private materialService: MaterialService,
    private unitService: UnitService,
    private statusService: StatusService,
    private transactionTypeService: TransactionTypeService
  ) {


    this.initDataGrid();
    this.subscribeBusEvents();
    this.responsiveService.makeObserver(this.widthsSpan);
    this.initRelatedData();
  }

  get canViewTransaction(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_view_ingress);
  }
  get canAddTransaction(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_add_ingress);
  }
  get canChangeTransaction(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_change_ingress);
  }
  get canDeleteTransaction(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_delete_ingress);
  }
  ngOnInit(): void { }

  showPopup() {
    this.showOnPopup = true;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }
  fromTxnDocument() {
    this.dataGrid?.instance.filter([
      "txn_document",
      "in",
      this.txnDocumentsSelected.map((item) => item.id),
    ]);
  }

  subscribeBusEvents() {
    this.subscriptions.push(
      this.eventBusService
        .on([EventTypes.transaction_added, EventTypes.transaction_updated])
        .subscribe(() => {
          this.dataGrid?.instance.refresh();
        }),
      this.eventBusService
        .on([EventTypes.txn_document_selected])
        .subscribe((event: DataBus) => {
          this.txnDocumentsSelected = event.data;
          this.fromTxnDocument();
        }),
    );
  }

  initRelatedData(): void {
    this.transactionTypeService.getStore()._load().subscribe((data) => {
      this.txnTypes = data.data as Array<TransactionType>;
    });
  }

  onInitialized(e: any) {
    e.component.filter([["txn_document", "in", [0]]]);
  }

  initDataGrid(): void {
    this.dataGridConf.setData({
      dataSource: this.transactionService.getStore(),
      columns: [
        {
          dataField: "txn_document",
          caption: "Documento",
          alignment: "center",
          lookup: {
            dataSource: this.txnDocumentService.getStore({ all: true }),
            valueExpr: "id",
            displayExpr: "folio_number",
          },
        },
        {
          dataField: "material",
          caption: "Material",
          alignment: "center",
          lookup: {
            dataSource: this.materialService.getStore({ all: true }),
            valueExpr: "id",
            displayExpr: "name",
          },
        },
        {
          editorType: "dxTextBox",
          dataField: "serial_number",
          caption: "Serial",
          alignment: "center",
        },
        {
          editorType: "dxNumberBox",
          dataField: "transaction_quantity",
          dataType: "number",
          caption: "Cant. Traslado",
          alignment: "center",
        },
        {
          dataField: "transaction_unit",
          caption: "Unid. Traslado",
          alignment: "center",
          lookup: {
            dataSource: this.unitService.getStore({ all: true }),
            valueExpr: "id",
            displayExpr: "symbol",
          },
        },
        {
          editorType: "dxNumberBox",
          dataField: "base_quantity",
          dataType: "number",
          caption: "Total",
          alignment: "center",
        },
        {
          dataField: "base_unit",
          caption: "Unidad",
          alignment: "center",
          lookup: {
            dataSource: this.unitService.getStore({ all: true }),
            valueExpr: "id",
            displayExpr: "symbol",
          },
        },
        {
          editorType: "dxNumberBox",
          dataField: "available_quantity",
          dataType: "number",
          caption: "Saldo",
          alignment: "center",
        },
        {
          dataField: "status",
          caption: "Estatus",
          alignment: "center",
          lookup: {
            dataSource: this.statusService.getStore({ all: true }),
            valueExpr: "id",
            displayExpr: "status_name",
          },
        },
      ],
      editing: {
        mode: "row",
        allowUpdating: this.canChangeTransaction,
        allowDeleting: this.canDeleteTransaction,
        allowAdding: this.canAddTransaction,
        useIcons: true,
        texts: {
          addRow: "Material",
        },
      },
      summary: {
        groupItems: [{
          column: "base_quantity",
          summaryType: 'sum',
          displayFormat: 'Sum: {0}',
          alignByColumn: true
        }, {
          column: "available_quantity",
          summaryType: 'sum',
          displayFormat: 'Sum: {0}',
          alignByColumn: true
        }, {
          column: "transaction_quantity",
          summaryType: 'sum',
          displayFormat: 'Sum: {0}',
          alignByColumn: true
        }]
      },
    });
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.forEach((item: any) => {
      if (item.name === "addRowButton") {
        item.showText = true;
        item.options.onClick = () => this.loadGridComponent();
      }
    });
    console.log(e.toolbarOptions.items);
    e.toolbarOptions.items.unshift({
      location: "after",
      widget: "dxButton",
      locateInMenu: "after",
      options: {
        icon: "refresh",
        text: "",
        onClick: () => {
          this.dataGrid?.instance.refresh();
        },
      },
    },
      {
        location: "after",
        widget: "dxButton",
        locateInMenu: "after",
        options: {
          icon: "add",
          text: "Ont",
          onClick: () => {
            this.loadGridOntComponent();
          },
        },
      }
    );
  }

  onEditingStart(e: any) {
    e.cancel = true;
    this.loadFormComponent(e.data.id);
  }
  onRowRemoved(e: any) {
    this.dataGrid?.instance.refresh();
  }

  getTransactionType() {
    let txnDocument: any = null;
    let txnType: any = null;

    if (this.txnDocumentsSelected.length = 1) {
      txnDocument = this.txnDocumentsSelected[0];
      txnType = this.txnTypes.find(
        (item) => item.id == txnDocument.transaction_type
      );
    }
    console.log(txnDocument, txnType);
    return { txnDocumentId: txnDocument?.id ?? 0, txnTypeName: txnType?.name ?? null };

  }


  async loadFormComponent(id: number) {
    const { txnDocumentId, txnTypeName } = this.getTransactionType();
    let component = null;
    switch (txnTypeName) {
      case TransactionType.IN:
        component = lazyWidgets.transaction_form_in;
        break;
      case TransactionType.OUT:
        component = lazyWidgets.transaction_form_out;
        break;
      case TransactionType.TRANSFER:
        component = lazyWidgets.transaction_form_transfer;
        break;
      default:
        return;
        break;
    }
    const instance = await this.lazyLoadService.load(component, this.lazyContainer);
    if (id) {
      instance.loadForm(id);
    } else {
      instance.setDataForm(new Transaction({ txn_document: txnDocumentId }));
    }

  }

  async loadGridComponent() {
    const { txnDocumentId, txnTypeName } = this.getTransactionType();
    let component = null;
    switch (txnTypeName) {
      case TransactionType.IN:
        component = lazyWidgets.transaction_grid_in;
        break;
      case TransactionType.OUT:
        component = lazyWidgets.transaction_grid_out;
        break;
      case TransactionType.TRANSFER:
        component = lazyWidgets.transaction_form_transfer;
        break;
      default:
        return;
        break;
    }
    const instance = await this.lazyLoadService.load(component, this.lazyContainer);
    instance.loadTxnDocument(txnDocumentId);
  }

  async loadGridOntComponent() {
    const { txnDocumentId, txnTypeName } = this.getTransactionType();
    let component = null;
    switch (txnTypeName) {
      case TransactionType.IN:
        component = lazyWidgets.transaction_grid_in_ont;
        break;
      case TransactionType.OUT:
        component = lazyWidgets.transaction_grid_out_ont;
        break;
      case TransactionType.TRANSFER:
        component = lazyWidgets.transaction_form_transfer;
        break;
        return;
      default:
        return;
        break;
    }
    const instance = await this.lazyLoadService.load(component, this.lazyContainer);
    instance.loadTxnDocument(txnDocumentId);
  }
}
