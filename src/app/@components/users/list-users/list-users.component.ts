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
import { FormUserComponent } from "@components/users/form-user/form-user.component";
import { LazyComponent } from "@components/base";
import { users_list } from "@components/widget.types";

@Component({
  selector: "app-list-users",
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./list-users.component.html",
})
export class ListUsersComponent
  implements LazyComponent<users_list>, OnInit, OnDestroy
{
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;
  @ViewChild("lazyContainer", { read: ViewContainerRef })
  lazyContainer!: ViewContainerRef;
  public onPopup: boolean = false;
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
  ngOnInit(): void {}
  showOnPopup(): void {
    this.onPopup = true;
  }
  inicializate(): void {}
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
          this.dataGrid?.instance.getDataSource()?.reload();
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
      ],
      buttons: [],
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
      this.groupService
        .getStore()
        ._load({ isLoadingAll: true })
        .subscribe((data) => {
          this.groups = data.data as Array<Group>;
        })
    );
  }
  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.forEach((item: any) => {
      if (item.name === "addRowButton") {
        item.options.onClick = () => this.loadForm(new User());
      }
    });
    e.toolbarOptions.items.unshift({
      location: "after",
      widget: "dxButton",
      locateInMenu: "auto",
      options: {
        icon: "refresh",
        text: "",
        onClick: () => {
          this.dataGrid?.instance.getDataSource()?.reload();
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
    this.loadForm(e.data);
  }
  async loadForm(user: User) {
    await this.lazyLoadService.load({
      component_name: lazyWidgets.user_form,
      container: this.lazyContainer,
      data: {
        model: user,
        config: {
          onPopup: true,
        },
      },
    });
  }

  onSelectionChanged(e: any) {
    this.eventBusService.emit(EventTypes.user_selected, e.selectedRowsData);
  }
}
