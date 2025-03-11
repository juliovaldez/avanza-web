import {
  Component,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  signal,
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
} from "@services/core";
import {
  LocationService,
  TransactionTypeService,
  TxnDocumentService,
  UserService,
} from "@services/api";
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
  DxPopupModule,
} from "devextreme-angular";
import { BehaviorSubject, Subscription } from "rxjs";
import { Unit, Location, GridConf, TransactionType, User } from "@models/index";
import { FormTxnDocumentInComponent } from "@components/txt-document/form-txn-document-in/form-txn-document-in.component";
import ArrayStore from "devextreme/data/array_store";

@Component({
  selector: "app-list-txn-documents",
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./list-txn-documents.component.html",
})
export class ListTxnDocumentsComponent {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;
  @ViewChild("lazyContainer", { read: ViewContainerRef })
  lazyContainer!: ViewContainerRef;
  public showOnPopup: boolean = false;
  public dataGridConf: GridConf = new GridConf();
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "100%",
    md: "100%",
    lg: "100%",
    xl: "100%",
    xxl: "100%",
  });

  public txtDocumentStore;
  public txnTypesStore;
  public usersStore;
  public locationsStore;
  constructor(
    private $auth: AuthService,
    private $lazyLoad: LazyLoadService,
    private $eventBus: EventBusService,
    private $responsive: ResponsiveService,
    private $txnDocument: TxnDocumentService,
    private $txnType: TransactionTypeService,
    private $user: UserService,
    private $location: LocationService
  ) {
    this.txtDocumentStore = this.$txnDocument.getStore();
    this.txnTypesStore = this.$txnType.getStore({
      all: true,
    });
    this.usersStore = this.$user.getStore({ all: true });
    this.locationsStore = this.$location.getStore({ all: true });

    this.initDataGrid();
    this.subscribeBusEvents();
    this.$responsive.makeObserver(this.widthsSpan);
    this.initRelatedData();
  }

  get canViewIngress(): boolean {
    return this.$auth.hasPermission(PERMISSIONS.inventory_view_ingress);
  }
  get canAddIngress(): boolean {
    return this.$auth.hasPermission(PERMISSIONS.inventory_add_ingress);
  }
  get canChangeIngress(): boolean {
    return this.$auth.hasPermission(PERMISSIONS.inventory_change_ingress);
  }
  get canDeleteIngress(): boolean {
    return this.$auth.hasPermission(PERMISSIONS.inventory_delete_ingress);
  }

  showPopup() {
    this.showOnPopup = true;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }
  subscribeBusEvents() {
    this.subscriptions.push(
      this.$eventBus
        .on([EventTypes.txn_document_updated, EventTypes.txn_document_added])
        .subscribe(() => {
          this.dataGrid?.instance.refresh();
        })
    );
  }
  initRelatedData(): void { }

  initDataGrid(): void {
    this.dataGridConf.setData({
      dataSource: this.txtDocumentStore,
      columns: [
        {
          editorType: "dxTextBox",
          dataField: "folio_number",
          dataType: "text",
          caption: "Doc. folio)",
          alignment: "center",
        },
        {
          dataField: "transaction_type",
          caption: "Tipo",
          alignment: "center",
          lookup: {
            dataSource: this.txnTypesStore,
            valueExpr: "id",
            displayExpr: "name",
          },
        },

        {
          editorType: "dxTextBox",
          dataField: "reference_number",
          dataType: "text",
          caption: "Referencia",
          alignment: "center",
        },
        {
          dataField: "from_user",
          caption: "De Usuario",
          alignment: "center",
          lookup: {
            dataSource: this.usersStore,
            valueExpr: "id",
            displayExpr: "username",
          },
        },
        {
          dataField: "from_user_location",
          caption: "Origen",
          alignment: "center",
          lookup: {
            dataSource: this.locationsStore,
            valueExpr: "id",
            displayExpr: "name",
          },
        },
        {
          dataField: "to_user",
          caption: "A Usuario",
          alignment: "center",
          lookup: {
            dataSource: this.usersStore,
            valueExpr: "id",
            displayExpr: "username",
          },
        },
        {
          dataField: "to_user_location",
          caption: "Destino",
          alignment: "center",
          lookup: {
            dataSource: this.locationsStore,
            valueExpr: "id",
            displayExpr: "name",
          },
        },
        {
          editorType: "dxTextBox",
          dataField: "txn_start_date",
          dataType: "date",
          caption: "Inicia Op.",
          alignment: "center",
        },
        {
          editorType: "dxTextBox",
          dataField: "txn_end_date",
          dataType: "date",
          caption: "Finaliza Op.",
          alignment: "center",
        },
        {
          editorType: "dxTextBox",
          dataField: "comments",
          alignment: "center",
          caption: "Comentarios",
        },
      ],
      selection: {
        mode: "multiple",
      },
      editing: {
        mode: "row",
        allowUpdating: this.canChangeIngress,
        allowDeleting: this.canDeleteIngress,
        allowAdding: false,
        useIcons: true,
        texts: {
          addRow: "Agregar",
        },
      },
    });
  }
  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
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
          text: "Entrada",
          onClick: () => {
            this.loadFormIn(0);
          },
        },
      },
      {
        location: "after",
        widget: "dxButton",
        locateInMenu: "after",
        options: {
          icon: "add",
          text: "Salida",
          onClick: () => {
            this.loadFormOut(0);
          },
        },
      },
      {
        location: "after",
        widget: "dxButton",
        locateInMenu: "after",
        options: {
          icon: "add",
          text: "Traslado",
          onClick: () => {
            this.loadFormTransfer(0);
          },
        },
      }
    );
  }
  onEditingStart(e: any) {
    e.cancel = true;
    this.loadFormIn(e.data.id);
  }
  onRowRemoved(e: any) {
    this.dataGrid?.instance.refresh();
  }
  onSelectionChanged(e: any) {
    this.$eventBus.emit(EventTypes.txn_document_selected, e.selectedRowsData);
  }

  async loadFormIn(id: number) {
    const instance: FormTxnDocumentInComponent = await this.$lazyLoad.load(
      lazyWidgets.txn_document_form_in,
      this.lazyContainer
    );
    console.log(instance);
    instance.loadForm(id);
  }
  async loadFormOut(id: number) {
    const instance: FormTxnDocumentInComponent = await this.$lazyLoad.load(
      lazyWidgets.txn_document_form_out,
      this.lazyContainer
    );
    instance.loadForm(id);
  }
  async loadFormTransfer(id: number) {
    const instance: FormTxnDocumentInComponent = await this.$lazyLoad.load(
      lazyWidgets.txn_document_form_transfer,
      this.lazyContainer
    );
    instance.loadForm(id);
  }
}
