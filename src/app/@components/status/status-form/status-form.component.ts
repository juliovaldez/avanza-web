import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Status } from '@models/index';
import { StatusService } from '@services/api';
import {
  DxPopupModule,
  DxButtonModule,
  DxFormModule,
  DxFormComponent,
  DxDataGridModule,
} from 'devextreme-angular';
import {
  EventBusService,
  ResponsiveService,
  widthsSpan,
  EventTypes,
} from '@services/core/';

@Component({
  selector: 'app-status-form',
  standalone: true,
  imports: [
    DxPopupModule,
    DxButtonModule,
    DxFormModule,
    DxDataGridModule,
  ],
  templateUrl: './status-form.component.html',
})
export class StatusFormComponent {
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  @ViewChild('lazyContainer', { read: ViewContainerRef })
  listPermissions!: ViewContainerRef;
  public popupVisible: boolean = true;
  public formStatus: Status = new Status();
  public widthsSpan: widthsSpan = new widthsSpan('100%', {
    xs: '100%',
    sm: '90%',
    md: '80%',
    lg: '70%',
    xl: '60%',
    xxl: '40%',
  });

  public statusStore;

  constructor(
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    private statusService: StatusService,
  ) {
    this.statusStore = this.statusService.getStore({ all: true });

    this.responsiveService.makeObserver(this.widthsSpan);

  }

  loadForm(id: number): void {
    id &&
      this.statusStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.formStatus = response;
          },
        });
  }

  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;
    this.statusStore
      .showLoading()
      ._save(this.formStatus.id, this.formStatus)
      .subscribe({
        next: (response) => {
          this.eventBusService.emit(
            this.formStatus.id
              ? EventTypes.status_updated
              : EventTypes.status_added
          );
          this.popupVisible = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
