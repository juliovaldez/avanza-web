import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Material, Status, Unit } from "@models/index";
import { MaterialService, StatusService, UnitService } from "@services/api";
import {
  DxPopupModule,
  DxButtonModule,
  DxFormModule,
  DxFormComponent,
  DxDataGridModule,
} from "devextreme-angular";
import {
  EventBusService,
  ResponsiveService,
  widthsSpan,
  EventTypes,
} from "@services/core/";
import CustomStore from "devextreme/data/custom_store";
import { Subscription } from "rxjs";

@Component({
  selector: "app-form-material",
  standalone: true,
  imports: [DxPopupModule, DxButtonModule, DxFormModule, DxDataGridModule],
  templateUrl: "./form-material.component.html",
})
export class FormMaterialComponent {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  @ViewChild("lazyContainer", { read: ViewContainerRef })
  listPermissions!: ViewContainerRef;
  public popupVisible: boolean = true;
  public formMaterial: Material = new Material();
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "90%",
    md: "80%",
    lg: "70%",
    xl: "60%",
    xxl: "40%",
  });
  public units: Array<Unit> = [];

  public unitStore;
  public materialStore;

  constructor(
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    private materialService: MaterialService,
    public unitService: UnitService,
    public statusService: StatusService
  ) {
    this.responsiveService.makeObserver(this.widthsSpan);
    this.materialStore = this.materialService.getStore();

    this.unitStore = this.unitService.getStore({ all: true });

    this.initRelatedData();
  }

  initRelatedData(): void {
    this.subscriptions.push(
      this.unitStore._load().subscribe({
        next: (response) => {
          this.units = response.data as Array<Unit>;
        },
      })
    );
  }

  loadForm(id: number): void {
    return;
    id &&
      this.materialStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response: Material) => {
            console.log(response);
            this.formMaterial = response;
          },
        });
  }

  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;
    this.materialStore
      .showLoading()
      ._save(this.formMaterial.id, this.formMaterial)
      .subscribe({
        next: () => {
          this.eventBusService.emit(
            this.formMaterial.id
              ? EventTypes.material_updated
              : EventTypes.material_added
          );
          this.popupVisible = false;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
}
