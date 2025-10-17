import { Component, OnDestroy, OnInit, signal, ViewChild } from "@angular/core";
import { Group, SaleProfile, User } from "@models/index";
import {
  GroupService,
  LocationService,
  SaleProfileService,
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
  selector: "app-sale-profile-form",
  standalone: true,
  imports: [DxPopupModule, DxButtonModule, DxFormModule],
  templateUrl: "./sale-profile-form.component.html",
})
export class SaleProfileFormComponent implements OnInit, OnDestroy {
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  private subscriptions: Subscription[] = [];
  public popupVisible: boolean = true;
  public formSaleProfile = signal<SaleProfile>(new SaleProfile());
  public saleProfiles: Group[] = [];
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "90%",
    md: "80%",
    lg: "70%",
    xl: "60%",
    xxl: "40%",
  });
  public saleProfileStore;
  constructor(
    private saleProfileService: SaleProfileService,
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    private userService: UserService
  ) {
    this.saleProfileStore = this.saleProfileService.getStore();

  }

  ngOnInit(): void {
    this.responsiveService.makeObserver(this.widthsSpan);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  loadForm(id: number): void {
    id &&
      this.saleProfileStore.showLoading()
        ._byKey(id)
        .subscribe({
          next: (response: any) => {
            this.formSaleProfile.set(response);
          },
        });
    this.initRelatedData();
  }

  initRelatedData(): void {
    this.saleProfileStore._load({ all: true, filter: ['id', '<>', this.formSaleProfile().id] })
      .subscribe({
        next: (data: any) => (this.saleProfiles = data.data),
      });
  }
  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;

    this.saleProfileStore
      .showLoading()
      ._save(this.formSaleProfile().id, this.formSaleProfile())
      .subscribe({
        next: (response: any) => {
          this.eventBusService.emit(
            this.formSaleProfile().id
              ? EventTypes.user_updated
              : EventTypes.user_added
          );
          this.formSaleProfile.set(response);
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
}
