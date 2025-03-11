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
import { LocationService, UnitService, UserService } from "@services/api";
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
  DxPopupModule,
} from "devextreme-angular";
import { Subscription } from "rxjs";
import { FormLocationComponent } from "@components/location/form-location/form-location.component";
import { GridConf, User } from "@models/index";

@Component({
  selector: "app-list-locations",
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./list-locations.component.html",
})
export class ListLocationsComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
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
  public users: Array<User> = [];

  public statusStore;
  constructor(
    private authService: AuthService,
    private lazyLoadService: LazyLoadService,
    private eventBusService: EventBusService,
    private responsiveService: ResponsiveService,
    private locationService: LocationService,
    private userService: UserService
  ) {
    this.statusStore = this.userService.getStore({ all: true });

    this.initDataGrid();
    this.dataGridConf.dataSource = this.locationService.getStore();
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
        .on([EventTypes.unit_added, EventTypes.unit_updated])
        .subscribe(() => {
          this.dataGrid?.instance.refresh();
        })
    );
  }
  initDataGrid(): void {
    this.dataGridConf.setData({
      columns: [
        { dataField: "id", caption: "ID" },
        { dataField: "name", caption: "Nombre" },
        { dataField: "code", caption: "Codigo" },
        {
          dataField: "users",
          caption: "Usuarios",
          cellTemplate: "users_template",
        },
        { dataField: "comments", caption: "Comentarios" },
      ],
      buttons: [
        /*{
          hint: "Ver",
          icon: "copy",
          visible: true,
          disabled: false,
          onClick: (e:any) => this.loadForm(e.row.data.id),
        }*/
      ],
      editing: {
        mode: "row",
        allowUpdating: this.canChangeUnit,
        allowDeleting: this.canDeleteUnit,
        allowAdding: this.canAddUnit,
        useIcons: true,
        texts: {
          addRow: "Agregar",
        },
      },
    });
  }
  initRelatedData(): void {
    this.subscriptions.push(
      this.statusStore._load().subscribe((data: any) => {
        this.users = data.data;
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
  onEditingStart(e: any) {
    e.cancel = true;
    this.loadForm(e.data.id);
  }
  getUsername(id: number): string {
    const user = this.users.find((g) => g.id === id);
    return user ? `${user.username}` : "";
  }

  async loadForm(id: number) {
    const instance: FormLocationComponent = await this.lazyLoadService.load(
      lazyWidgets.location_form,
      this.lazyContainer
    );
    console.log(instance);
    instance.loadForm(id);
  }
}
