import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Material, Status, Unit, UnitConversion } from "@models/index";
import {
  MaterialService,
  UnitConversionService,
  UnitService,
} from "@services/api";
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
  selector: "app-form-unit-conversion",
  standalone: true,
  imports: [DxPopupModule, DxButtonModule, DxFormModule, DxDataGridModule],
  templateUrl: "./form-unit-conversion.component.html",
})
export class FormUnitConversionComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  public popupVisible: boolean = true;
  public formUnitConversion: UnitConversion = new UnitConversion();
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "90%",
    md: "80%",
    lg: "70%",
    xl: "60%",
    xxl: "40%",
  });
  public materialsDatasource!: Array<Material>;
  public unitsDatasource!: Array<Unit>;
  public unitConversionStore;

  constructor(
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    private materialService: MaterialService,
    private unitConversionService: UnitConversionService,
    public unitService: UnitService
  ) {
    this.unitConversionStore = unitConversionService.getStore();
    this.responsiveService.makeObserver(this.widthsSpan);
    this.initRelatedData();
  }

  ngOnInit(): void { }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  loadForm(id: number): void {
    id &&
      this.unitConversionStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response) => {
            this.formUnitConversion = response;
          },
        });
  }

  initRelatedData(): void {
    this.subscriptions.push(
      this.materialService.getStore()._load({ all: true }).subscribe({
        next: (data) => {
          this.materialsDatasource = data.data as Array<Material>;
        },
      }),
      this.unitService.getStore()._load({ all: true }).subscribe({
        next: (data) => {
          this.unitsDatasource = data.data as Array<Unit>;
        },
      })
    );
  }
  onMaterialChanged = (e: any) => {
    console.log(e);
    this.formUnitConversion.to_unit = e.selectedItem.unit_base;
  };
  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;
    this.unitConversionStore
      .showLoading()
      ._save(this.formUnitConversion.id, this.formUnitConversion)
      .subscribe({
        next: (response) => {
          this.eventBusService.emit(
            this.formUnitConversion.id
              ? EventTypes.unit_conversion_updated
              : EventTypes.unit_conversion_added
          );
          this.popupVisible = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
