import {
  Component,
  OnDestroy,
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
} from "@services/core";
import { TransactionTypeService } from "@services/api";
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
  DxPopupModule,
} from "devextreme-angular";
import { Subscription } from "rxjs";
import { FormTransactionTypeComponent } from "@components/transaction-type/form-transaction-type/form-transaction-type.component";
import { GridConf } from "@models/index";

@Component({
  selector: "app-list-transaction-types",
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./list-transaction-types.component.html",
})
export class ListTransactionTypesComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;
  @ViewChild("lazyContainer", { read: ViewContainerRef })
  lazyContainer!: ViewContainerRef;
  public showOnPopup: boolean = false;
  public dataGridConf: GridConf = new GridConf();
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "90%",
    md: "70%",
    lg: "60%",
    xl: "60%",
    xxl: "60%",
  });

  constructor(
    private authService: AuthService,
    private transactionTypeService: TransactionTypeService,
    private lazyLoadService: LazyLoadService,
    private eventBusService: EventBusService,
    private responsiveService: ResponsiveService
  ) {
    this.initDataGrid();
    this.dataGridConf.dataSource = this.transactionTypeService.getStore();
    this.initRelatedData();
    this.subscribeBusEvents();
    this.responsiveService.makeObserver(this.widthsSpan);
  }
  get canViewUnit(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_view_unit);
  }
  get canAddUnit(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_add_unit);
  }
  get canChangeUnit(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_change_unit);
  }
  get canDeleteUnit(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_delete_unit);
  }

  showPopup() {
    console.log("show on poppu");
    this.showOnPopup = true;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }
  subscribeBusEvents() {
    this.subscriptions.push(
      this.eventBusService
        .on([
          EventTypes.transaction_type_added,
          EventTypes.transaction_type_updated,
        ])
        .subscribe((message) => {
          this.dataGrid?.instance.refresh();
        })
    );
  }

  initDataGrid(): void {
    Object.assign(this.dataGridConf, {
      columns: [
        { dataField: "id", caption: "ID" },
        { dataField: "name", caption: "Transacción" },
      ],
      editing: {
        mode: "row",
        allowUpdating: this.canChangeUnit,
        allowDeleting: this.canDeleteUnit,
        allowAdding: this.canAddUnit,
        useIcons: true,
        texts: {
          addRow: "Agregar Usuario",
        },
      },
    });
  }
  initRelatedData(): void {}
  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.forEach((item: any) => {
      if (item.name === "addRowButton") {
        item.options.onClick = () => this.loadForm(0);
      }
    });
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
    });
  }
  onEditingStart(e: any) {
    e.cancel = true;
    this.loadForm(e.data.id);
  }

  async loadForm(id: number) {
    const instance: FormTransactionTypeComponent =
      await this.lazyLoadService.load(
        lazyWidgets.transaction_type_form,
        this.lazyContainer
      );
    console.log(instance);
    instance.loadForm(id);
  }
}
