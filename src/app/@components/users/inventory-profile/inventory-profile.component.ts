import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Group, InventoryProfile, User } from "@models/index";
import {
  GroupService,
  LocationService,
  UserFetcherService,
  UserService,
} from "@services/api";
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
  selector: "app-inventory-profile",
  standalone: true,
  imports: [DxPopupModule, DxButtonModule, DxFormModule],
  templateUrl: "./inventory-profile.component.html",
})
export class InventoryProfileComponent implements OnInit, OnDestroy {
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  private subscriptions: Subscription[] = [];
  public popupVisible: boolean = true;
  public formInvertoryProfile: InventoryProfile = new InventoryProfile({
    id: 0,
  });
  public locations: Group[] = [];
  public user_id: number = 0;
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "90%",
    md: "80%",
    lg: "70%",
    xl: "60%",
    xxl: "40%",
  });

  constructor(
    private userFetcherService: UserFetcherService,
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.responsiveService.makeObserver(this.widthsSpan);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  loadForm(id: number): void {
    id &&
      this.userFetcherService
        .showLoading()
        .getInventoryProfile(id)
        .subscribe({
          next: (response: any) => {
            this.formInvertoryProfile = response;
          },
        });
    this.user_id = id;
    this.initRelatedData();
  }

  initRelatedData(): void {
    this.locationService
      .getStore()
      ._load({ all: true, filter: ["users", "=", this.user_id] })
      .subscribe({
        next: (data: any) => (this.locations = data.data),
      });
  }
  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;

    this.userFetcherService
      .showLoading()
      .saveInventoryProfile(this.user_id, this.formInvertoryProfile)
      .subscribe({
        next: (response: any) => {
          this.eventBusService.emit(
            this.formInvertoryProfile.id
              ? EventTypes.user_updated
              : EventTypes.user_added
          );
          this.formInvertoryProfile = response;
          this.popupVisible = false;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
}
