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
import {
  UnitConversionService,
  MaterialService,
  UnitService,
} from "@services/api";
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
  DxPopupModule,
} from "devextreme-angular";
import { Subscription } from "rxjs";
import { Unit, Status, GridConf, Material } from "@models/index";
import { FormUnitConversionComponent } from "@components/index";

@Component({
  selector: "app-list-unit-conversions",
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./list-unit-conversions.component.html",
})
export class ListUnitConversionsComponent implements OnDestroy {
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

  public materials: Array<Material> = [];
  public units: Array<Unit> = [];
  public unitsStore;
  public materialsStore;

  constructor(
    private authService: AuthService,
    private materialService: MaterialService,
    private unitService: UnitService,
    private unitConversionService: UnitConversionService,
    private lazyLoadService: LazyLoadService,
    private eventBusService: EventBusService,
    private responsiveService: ResponsiveService
  ) {
    this.unitsStore = this.unitService.getStore({ all: true });
    this.materialsStore = this.materialService.getStore({ all: true });

    this.initDataGrid();
    this.dataGridConf.dataSource = this.unitConversionService.getStore();
    this.subscribeBusEvents();
    this.responsiveService.makeObserver(this.widthsSpan);

  }

  get canViewUnitConversion(): boolean {
    return this.authService.hasPermission(
      PERMISSIONS.inventory_view_unitconversion
    );
  }
  get canAddUnitConversion(): boolean {
    return this.authService.hasPermission(
      PERMISSIONS.inventory_add_unitconversion
    );
  }
  get canChangeUnitConversion(): boolean {
    return this.authService.hasPermission(
      PERMISSIONS.inventory_change_unitconversion
    );
  }
  get canDeleteUnitConversion(): boolean {
    return this.authService.hasPermission(
      PERMISSIONS.inventory_delete_unitconversion
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
        .on([
          EventTypes.unit_conversion_added,
          EventTypes.unit_conversion_updated,
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
        {
          dataField: "material",
          caption: "Material",
          alignment: "center",
          lookup: {
            dataSource: this.materialsStore,
            valueExpr: "id",
            displayExpr: "name",
          },
        },
        {
          dataField: "from_unit",
          caption: "De Unidad",
          alignment: "center",
          lookup: {
            dataSource: this.unitsStore,
            valueExpr: "id",
            displayExpr: "name",
          },
        },
        {
          dataField: "to_unit",
          caption: "A Unidad",
          alignment: "center",
          lookup: {
            dataSource: this.unitsStore,
            valueExpr: "id",
            displayExpr: "name",
          },
        },
        {
          editorType: "dxNumberBox",
          dataField: "conversion_factor",
          alignment: "center",
          caption: "Factor Conversión",
        },
      ],
      editing: {
        mode: "row",
        allowUpdating: this.canChangeUnitConversion,
        allowDeleting: this.canDeleteUnitConversion,
        allowAdding: this.canAddUnitConversion,
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
    const instance: FormUnitConversionComponent =
      await this.lazyLoadService.load(
        lazyWidgets.unit_conversion_form,
        this.lazyContainer
      );
    console.log(instance);
    instance.loadForm(id);
  }
}
