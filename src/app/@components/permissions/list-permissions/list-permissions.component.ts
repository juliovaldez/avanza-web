import {
  Component,
  Input,
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
  widthsSpan,
  ResponsiveService,
} from "@services/core";
import { User, Group, Permission, GridConf } from "@models/index";
import { UserService, GroupService, PermissionService } from "@services/api";
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
import { permissions_list } from "@components/widget.types";

@Component({
  selector: "app-list-permissions",
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./list-permissions.component.html",
})
export class ListPermissionsComponent
  implements LazyComponent<permissions_list>, OnDestroy
{
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;
  @ViewChild("lazyContainer", { read: ViewContainerRef })
  lazyContainer!: ViewContainerRef;
  public onPopup: boolean = false;
  public view_permission: boolean = false;
  public add_permission: boolean = false;
  public change_permission: boolean = false;
  public delete_permission: boolean = false;
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
    private permissionService: PermissionService,
    private groupService: GroupService,
    private lazyLoadService: LazyLoadService,
    private eventBusService: EventBusService,
    private responsiveService: ResponsiveService
  ) {
    this.initPermissions();
    this.initDataGrid();
    this.dataGridConf.dataSource = this.permissionService.getStore();
    this.initRelatedData();
    this.subscribeBusEvents();
    this.responsiveService.makeObserver(this.widthsSpan);
  }
  showOnPopup() {
    console.log("show on poppu");
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
        .on([EventTypes.group_added, EventTypes.group_updated])
        .subscribe((message) => {
          this.dataGrid?.instance.getDataSource()?.reload();
        })
    );
  }
  initPermissions(): void {
    this.view_permission = this.authService.hasPermission(
      PERMISSIONS.auth_view_permission
    );
  }
  initDataGrid(): void {
    this.dataGridConf.setData({
      columns: [
        { dataField: "id", caption: "ID" },
        { dataField: "name", caption: "Nombre" },
      ],
      paging: {
        pageSize: 2,
        pageIndex: 0,
      },
      pager: {
        visible: true,
        showPageSizeSelector: true,
        allowedPageSizes: [2, 10, 25, 50, 100],
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
        allowUpdating: this.change_permission,
        allowDeleting: this.delete_permission,
        allowAdding: this.add_permission,
        useIcons: true,
        texts: {
          addRow: "Agregar Usuario",
        },
      },
      selection: {
        mode: "single",
      },
    });
  }
  initRelatedData(): void {}
  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.forEach((item: any) => {
      if (item.name === "addRowButton") {
        item.options.onClick = () => this.loadForm(new Permission());
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
  onEditingStart(e: any) {
    e.cancel = true;
    this.loadForm(e.data);
  }

  async loadForm(permission: Permission) {
    await this.lazyLoadService.load({
      component_name: lazyWidgets.permission_form,
      container: this.lazyContainer,
      data: { model: permission, config: { onPopup: true } },
    });
  }
}
