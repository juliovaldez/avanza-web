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
import { MaterialService, UnitService } from "@services/api";
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
  DxPopupModule,
} from "devextreme-angular";
import { Subscription, lastValueFrom } from "rxjs";
import { FormMaterialComponent } from "@components/material/form-material/form-material.component";
import { Unit, Status, GridConf } from "@models/index";

@Component({
  selector: "app-list-materials",
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./list-materials.component.html",
})
export class ListMaterialsComponent implements OnDestroy {
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

  public units: Unit[] = [];

  public unitStore;
  constructor(
    private authService: AuthService,
    private materialService: MaterialService,
    private unitService: UnitService,
    private lazyLoadService: LazyLoadService,
    private eventBusService: EventBusService,
    private responsiveService: ResponsiveService
  ) {
    this.unitStore = this.unitService.getStore({ all: true });

    this.initDataGrid();
    this.dataGridConf.dataSource = this.materialService.getStore();
    this.subscribeBusEvents();
    this.responsiveService.makeObserver(this.widthsSpan);
  }

  get canViewMaterial(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_view_material);
  }
  get canAddMaterial(): boolean {
    return this.authService.hasPermission(PERMISSIONS.inventory_add_material);
  }
  get canChangeMaterial(): boolean {
    return this.authService.hasPermission(
      PERMISSIONS.inventory_change_material
    );
  }
  get canDeleteMaterial(): boolean {
    return this.authService.hasPermission(
      PERMISSIONS.inventory_delete_material
    );
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
        .on([EventTypes.material_added, EventTypes.material_updated])
        .subscribe((message: any) => {
          this.dataGrid?.instance.refresh();
        })
    );
  }
  initRelatedData(): void {
    this.subscriptions.push(
      this.unitStore._load({ all: true }).subscribe({
        next: (response) => {
          this.units = response.data as Unit[];
        },
      })
    );
  }
  initDataGrid(): void {
    Object.assign(this.dataGridConf, {
      columns: [
        { dataField: "id", caption: "ID" },
        { dataField: "code", caption: "Codigo Material" },
        { dataField: "name", caption: "Nombre" },
        { dataField: "unit_weight", caption: "Peso Unitario" },
        {
          dataField: "unit_base",
          caption: "Unidad Base",
          lookup: {
            dataSource: { data: this.units },
            valueExpr: "id",
            displayExpr: "name",
          },
        },
        { dataField: "description", caption: "Descripción" },
      ],
      editing: {
        mode: "row",
        allowUpdating: this.canChangeMaterial,
        allowDeleting: this.canDeleteMaterial,
        allowAdding: this.canAddMaterial,
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
    const instance: FormMaterialComponent = await this.lazyLoadService.load(
      lazyWidgets.material_form,
      this.lazyContainer
    );
    console.log(instance);
    instance.loadForm(id);
  }
}
