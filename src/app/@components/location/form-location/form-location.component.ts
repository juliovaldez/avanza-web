import { Component, OnDestroy, ViewChild } from "@angular/core";
import { Location, User } from "@models/index";
import { LocationService, UserService } from "@services/api";
import {
  DxPopupModule,
  DxButtonModule,
  DxFormModule,
  DxFormComponent,
} from "devextreme-angular";
import {
  EventBusService,
  ResponsiveService,
  widthsSpan,
  EventTypes,
} from "@services/core/";
import { Subscription } from "rxjs";

@Component({
  selector: "app-form-locations",
  standalone: true,
  imports: [DxPopupModule, DxButtonModule, DxFormModule],
  templateUrl: "./form-location.component.html",
})
export class FormLocationComponent implements OnDestroy {
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  private subscriptions: Subscription[] = [];
  public popupVisible: boolean = true;
  public formLocation: Location = new Location({ id: 0 });
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "90%",
    md: "80%",
    lg: "70%",
    xl: "60%",
    xxl: "40%",
  });
  public users: User[] = [];

  public locationsStore;

  constructor(
    private locationService: LocationService,
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    private userService: UserService
  ) {
    this.locationsStore = this.locationService.getStore();
    this.responsiveService.makeObserver(this.widthsSpan);
    this.initRelatedData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  loadForm(id: number): void {
    id &&
      this.locationsStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response: any) => {
            this.formLocation = response;
          },
        });
  }

  initRelatedData(): void {
    this.subscriptions.push(
      this.userService
        .getStore({ all: true })
        .showLoading()
        ._load()
        .subscribe((data: any) => {
          this.users = data.data;
        })
    );
  }

  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;
    this.locationsStore
      .showLoading()
      ._save(this.formLocation.id, this.formLocation)
      .subscribe({
        next: (response) => {
          this.eventBusService.emit(
            this.formLocation.id
              ? EventTypes.unit_updated
              : EventTypes.unit_added
          );
          this.popupVisible = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
