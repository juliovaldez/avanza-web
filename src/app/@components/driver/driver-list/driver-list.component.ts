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
import { ListTransactionsComponent } from "@components/transaction/list-transactions/list-transactions.component";

@Component({
  standalone: true,
  selector: 'app-driver-list',
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: './driver-list.component.html',
})
export class DriverListComponent implements OnInit, OnDestroy {
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
    this.initRelatedData();
    this.subscribeBusEvents();
  }
  ngOnInit(): void {
    console.log(this.lazyContainer);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }
  subscribeBusEvents() {
    this.subscriptions.push(
      this.eventBusService
        .on([EventTypes.user_added, EventTypes.user_updated])
        .subscribe(() => {
          this.dataGrid?.instance.refresh();
        })
    );
  }
  initPermissions(): void {
    this.view_user = this.authService.hasPermission(
      PERMISSIONS.users_view_user
    );
  }
  initDataGrid(): void {
    this.dataGridConf.setData({
      dataSource: this.userService.getStore({ filter: ['groups', 'in', [Group.TECNICO]] }),
      columns: [
        { dataField: "id", caption: "ID" },
        { dataField: "username", caption: "Usuario" },
        { dataField: "email", caption: "Correo Electrónico" },
        { dataField: "first_name", caption: "Nombre" },
        {
          dataField: "groups",
          caption: "Rol",
          cellTemplate: "groups_template",
        },
        {
          dataField: "inventory_profile.location_name",
          caption: "Ubicación",
        },
      ],
      buttons: [
      ],
      paging: {
        pageSize: 5,
        pageIndex: 0,
      },
      pager: {
        visible: true,
        showPageSizeSelector: true,
        allowedPageSizes: [5, 10, 20],
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
    }
    );
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
    const instance: FormUserComponent = await this.lazyLoadService.load(
      lazyWidgets.user_form,
      this.lazyContainer
    );
    console.log(instance);
    instance.loadForm(id);
  }
  onSelectionChanged(e: any) {
    this.eventBusService.emit(EventTypes.drive_selected, e.selectedRowsData);
  }

}
