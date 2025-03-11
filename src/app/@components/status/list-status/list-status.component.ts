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
import { StatusService } from "@services/api";
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
  DxPopupModule,
} from "devextreme-angular";
import { Subscription } from "rxjs";
import { FormUserComponent } from "@components/users/form-user/form-user.component";
import { GridConf } from "@models/index";

@Component({
  selector: "app-list-status",
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./list-status.component.html",
})
export class ListStatusComponent implements OnDestroy {
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
    private statusService: StatusService,
    private lazyLoadService: LazyLoadService,
    private eventBusService: EventBusService,
    private responsiveService: ResponsiveService
  ) {
    this.initDataGrid();
    this.dataGridConf.dataSource = this.statusService.getStore();
    this.subscribeBusEvents();
    this.responsiveService.makeObserver(this.widthsSpan);
  }
  get canViewStatus(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_view_status);
  }
  get canAddStatus(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_add_status);
  }
  get canChangeStatus(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_change_status);
  }
  get canDeleteStatus(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_delete_status);
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
        .on([EventTypes.status_added, EventTypes.status_updated])
        .subscribe((message) => {
          this.dataGrid?.instance.refresh();
        })
    );
  }

  initDataGrid(): void {
    Object.assign(this.dataGridConf, {
      columns: [
        { dataField: "id", caption: "ID" },
        { dataField: "status_name", caption: "Status" },
        { dataField: "module_name", caption: "Modulo" },
      ],
      editing: {
        mode: "row",
        allowUpdating: this.canChangeStatus,
        allowDeleting: this.canDeleteStatus,
        allowAdding: this.canAddStatus,
        useIcons: true,
        texts: {
          addRow: "Agregar Usuario",
        },
      },
    });
  }
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
    const instance: FormUserComponent = await this.lazyLoadService.load(
      lazyWidgets.status_form,
      this.lazyContainer
    );
    console.log(instance);
    instance.loadForm(id);
  }
}
