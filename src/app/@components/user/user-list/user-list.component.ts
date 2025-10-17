import {
  Component,
  OnDestroy,
  OnInit,
  viewChild,
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
} from "@services/core";
import { User, Group, GridConf } from "@models/index";
import { UserService, GroupService } from "@services/api";
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
  DxPopupModule,
} from "devextreme-angular";
import CustomStore from "devextreme/data/custom_store";
import { Subject, Subscription, takeUntil } from "rxjs";
import { UserFormComponent } from "@components/user/user-form/user-form.component";
import { SaleProfileFormComponent } from "../../sale-profile/sale-profile-form/sale-profile-formcomponent";

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./user-list.component.html",
})
export class UserListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;
  @ViewChild("lazyContainer", { read: ViewContainerRef })
  lazyContainer!: ViewContainerRef;
  public showOnPopup: boolean = false;
  public view_user: boolean = false;
  public add_user: boolean = false;
  public change_user: boolean = false;
  public delete_user: boolean = false;
  public dataGridConf: GridConf = new GridConf();
  public groups: Array<Group> = [];
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private groupService: GroupService,
    private lazyLoadService: LazyLoadService,
    private eventBusService: EventBusService
  ) {
    this.initPermissions();
    this.initDataGrid();
    this.dataGridConf.dataSource = this.userService.getStore();
    this.initRelatedData();
    this.subscribeBusEvents();
  }
  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }
  subscribeBusEvents() {
    this.subscriptions.push(
      this.eventBusService
        .on([EventTypes.user_added, EventTypes.user_updated])
        .subscribe((message) => {
          console.log(message);
          this.dataGrid?.instance.refresh();
        })
    );
  }

  initPermissions(): void {
    this.view_user = this.authService.hasPermission(
      PERMISSIONS.users_view_user
    );
    this.add_user = this.authService.hasPermission(PERMISSIONS.users_add_user);
    this.change_user = this.authService.hasPermission(
      PERMISSIONS.users_change_user
    );
    this.delete_user = this.authService.hasPermission(
      PERMISSIONS.users_delete_user
    );
  }
  initDataGrid(): void {
    this.dataGridConf.setData({
      columns: [
        { dataField: "id", caption: "ID" },
        { dataField: "username", caption: "Usuario" },
        { dataField: "email", caption: "Correo Electrónico" },
        { dataField: "first_name", caption: "Nombre" },
        {
          dataField: "groups",
          caption: "Roles",
          cellTemplate: "groups_template",
        },
        {
          dataField: "inventory_profile.location_name",
          caption: "Ubicación",
        },
      ],
      buttons: [
        {
          hint: "Perfil Inventario",
          icon: "chart",
          visible: true,
          disabled: false,
          onClick: (e: any) => this.loadInventoryProfile(e.row.data),
        },
      ],
      paging: {
        pageSize: 5,
        pageIndex: 0,
      },
      pager: {
        visible: true,
        showPageSizeSelector: true,
        allowedPageSizes: [5, 10, 25, 50, 100],
      },
      searchPanel: {
        visible: true,
        highlightCaseSensitive: true,
        placeholder: "Buscar..",
      },
      headerFilter: {
        visible: true,
      },
      editing: {
        mode: "row",
        allowUpdating: this.change_user,
        allowDeleting: this.delete_user,
        allowAdding: this.add_user,
        useIcons: true,
        texts: {
          addRow: "Agregar Usuario",
        },
      },
      selection: {
        mode: "multiple",
      },
    });
  }
  initRelatedData(): void {
    this.subscriptions.push(
      this.groupService.getStore()._load({ all: true }).subscribe((data) => {
        this.groups = data.data as Array<Group>;
      })
    );
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
  getGroupName(id: number): string {
    const group = this.groups.find((g) => g.id === id);
    return group ? `${group.name}` : "";
  }
  onEditingStart(e: any) {
    e.cancel = true;
    this.loadForm(e.data.id);
  }
  async loadForm(id: number) {
    const instance: UserFormComponent = await this.lazyLoadService.load(
      lazyWidgets.user_form,
      this.lazyContainer
    );
    console.log(instance);
    instance.loadForm(id);
  }

  async loadInventoryProfile(user: User) {
    const instance: SaleProfileFormComponent = await this.lazyLoadService.load(
      lazyWidgets.sale_profile_form,
      this.lazyContainer
    );
    console.log(instance);
    instance.loadForm(user.sale_profile?.id ?? 0);
  }
  onSelectionChanged(e: any) {
    this.eventBusService.emit(EventTypes.user_selected, e.selectedRowsData);
  }
}
