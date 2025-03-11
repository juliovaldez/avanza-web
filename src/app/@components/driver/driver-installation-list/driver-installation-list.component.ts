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
  DataBus,
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
import { Unit, Location, GridConf, TransactionType, User, TxnDocument } from "@models/index";
import { FormTxnDocumentInComponent } from "@components/txt-document/form-txn-document-in/form-txn-document-in.component";
import ArrayStore from "devextreme/data/array_store";
import { DriverInstallationFormComponent } from "../driver-installation-form/driver-installation-form.component";

@Component({
  selector: "app-driver-installation-list",
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./driver-installation-list.component.html",
})
export class DriverInstallationListComponent {
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

  public drives: Array<User> = [];

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
        }),
      this.$eventBus.on([EventTypes.drive_selected]).subscribe((event: DataBus) => {
        this.drives = event.data;

        this.dataGrid?.instance.filter(
          [
            "from_user",
            "in",
            this.drives.map((drive: User) => drive.id),
          ]);

      })
    );
  }
  initRelatedData(): void { }


  onInitialized(e: any) {
    e.component.filter([["id", "=", 0]]);
  }

  initDataGrid(): void {
    this.dataGridConf.setData({
      dataSource: this.txtDocumentStore,
      columns: [
        {
          editorType: "dxTextBox",
          dataField: "folio_number",
          dataType: "text",
          caption: "Doc. folio",
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
        allowAdding: true,
        useIcons: true,
        texts: {
          addRow: "Agregar",
        },
      },
    });
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.forEach((item: any) => {
      if (item.name === "addRowButton") {
        item.showText = true;
        item.options.onClick = () => this.loadFormInstalation(0);
      }
    });
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
      }
    );
  }

  onEditingStart(e: any) {
    e.cancel = true;
    this.loadFormInstalation(e.data.id);
  }

  onRowRemoved(e: any) {
    this.dataGrid?.instance.refresh();
  }

  onSelectionChanged(e: any) {
    this.$eventBus.emit(EventTypes.txn_document_selected, e.selectedRowsData);
  }

  async loadFormInstalation(id: number) {
    const instance: DriverInstallationFormComponent = await this.$lazyLoad.load(
      lazyWidgets.driver_installation_form,
      this.lazyContainer
    );
    if (id) {
      instance.loadForm(id);
    } else {
      instance.setDataForm(new TxnDocument({ from_user: this.drives.length ? this.drives[0].id : 0 }))
    }


  }

}
