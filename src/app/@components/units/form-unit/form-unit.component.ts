import {
  Component,
  OnDestroy,

  ViewChild,

} from '@angular/core';
import { Unit } from '@models/index';
import { UnitService } from '@services/api';
import {
  DxPopupModule,
  DxButtonModule,
  DxFormModule,
  DxFormComponent,

} from 'devextreme-angular';
import {
  EventBusService,
  ResponsiveService,
  widthsSpan,
  EventTypes,
} from '@services/core/';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-unit',
  standalone: true,
  imports: [DxPopupModule, DxButtonModule, DxFormModule],
  templateUrl: './form-unit.component.html',
})
export class FormUnitComponent implements OnDestroy {
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  private subscriptions: Subscription[] = [];
  public popupVisible: boolean = true;
  public formUnit: Unit = new Unit({ id: 0 });
  public widthsSpan: widthsSpan = new widthsSpan('100%', {
    xs: '100%',
    sm: '90%',
    md: '80%',
    lg: '70%',
    xl: '60%',
    xxl: '40%',
  });
  public unitsStore;

  constructor(
    private unit_s: UnitService,
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
  ) {
    this.unitsStore = this.unit_s.getStore();

    this.responsiveService.makeObserver(this.widthsSpan);
    this.initRelatedData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  loadForm(id: number): void {
    id &&
      this.unitsStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response) => {
            this.formUnit = response;
          },
        });
  }

  initRelatedData(): void {
  }

  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;
    this.unitsStore
      .showLoading()
      ._save(this.formUnit.id, this.formUnit)
      .subscribe({
        next: (response) => {
          this.eventBusService.emit(
            this.formUnit.id ? EventTypes.unit_updated : EventTypes.unit_added
          );
          this.popupVisible = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
