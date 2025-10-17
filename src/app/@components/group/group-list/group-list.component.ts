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
import { GroupFormComponent } from "@components/group/group-form/group-form.component";
import { PermissionListComponent } from "@components/permission/permission-list/permission-list.component";

@Component({
  selector: "app-group-list",
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./group-list.component.html",
})
export class GroupListComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;
  @ViewChild("lazyContainer", { read: ViewContainerRef })
  lazyContainer!: ViewContainerRef;
  public showOnPopup: boolean = false;
  public view_group: boolean = false;
  public add_group: boolean = false;
  public change_group: boolean = false;
  public delete_group: boolean = false;
  public dataGridConf: GridConf = new GridConf();
  public permissions: Array<Permission> = [];
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
    private groupService: GroupService,
    private lazyLoadService: LazyLoadService,
    private eventBusService: EventBusService,
    private responsiveService: ResponsiveService
  ) {
    this.initPermissions();
    this.initDataGrid();
    this.dataGridConf.dataSource = this.groupService.getStore();
    this.subscribeBusEvents();
    this.responsiveService.makeObserver(this.widthsSpan);
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
      this.eventBusService
        .on([EventTypes.group_added, EventTypes.group_updated])
        .subscribe((message) => {
          this.dataGrid?.instance.refresh();
        })
    );
  }
  initPermissions(): void {
    this.view_group = this.authService.hasPermission(
      PERMISSIONS.auth_view_group
    );
    this.add_group = this.authService.hasPermission(PERMISSIONS.auth_add_group);
    this.change_group = this.authService.hasPermission(
      PERMISSIONS.auth_change_group
    );
    this.delete_group = this.authService.hasPermission(
      PERMISSIONS.auth_delete_group
    );
  }
  initDataGrid(): void {
    this.dataGridConf.setData({
      columns: [
        { dataField: "id", caption: "ID", alignment: "left" },
        { dataField: "name", caption: "Nombre", alignment: "left" },
      ],
      paging: {
        pageSize: 10,
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
        allowUpdating: this.change_group,
        allowDeleting: this.delete_group,
        allowAdding: this.add_group,
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
  onToolbarPreparing(e: any) {
    console.log(e.toolbarOptions);
    e.toolbarOptions.items.forEach((item: any) => {
      if (item.name === "addRowButton") {
        item.options.onClick = () => this.loadForm();
      }
    });
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        locateInMenu: "after",
        options: {
          icon: "refresh",
          hint: "Actualizar",
          onClick: () => {
            this.dataGrid?.instance.refresh();
          },
        },
      },
      {
        location: "before",
        widget: "dxButton",
        locateInMenu: "after",
        options: {
          icon: "optionsgear",
          hint: "Administrar Permisos",
          onClick: () => {
            this.loadlistPermissions();
          },
        },
      }
    );
  }
  onEditingStart(e: any) {
    e.cancel = true;
    this.loadForm(e.data.id);
  }
  async loadForm(id: number = 0) {
    const instance: GroupFormComponent = await this.lazyLoadService.load(
      lazyWidgets.group_form,
      this.lazyContainer
    );
    console.log(instance);
    instance.loadForm(id);
  }
  async loadlistPermissions() {
    const instance: PermissionListComponent = await this.lazyLoadService.load(
      lazyWidgets.permission_list,
      this.lazyContainer
    );
    instance.showPopup();
  }
}
