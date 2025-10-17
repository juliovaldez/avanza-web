import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Group, User } from "@models/index";
import { GroupService, UserService } from "@services/api";
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

import { LazyComponent } from "@components/base";
import { user_form } from "@components/widget.types";

@Component({
  selector: "app-form-user",
  standalone: true,
  imports: [DxPopupModule, DxButtonModule, DxFormModule],
  templateUrl: "./form-user.component.html",
})
export class FormUserComponent
  implements LazyComponent<user_form>, OnInit, OnDestroy
{
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  private subscriptions: Subscription[] = [];
  public onPopup: boolean = true;
  public formUser: User = new User({ id: 0 });
  public groups: Group[] = [];
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "90%",
    md: "80%",
    lg: "70%",
    xl: "60%",
    xxl: "40%",
  });
  public userStore;
  public groupStore;
  constructor(
    private userService: UserService,
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    private groupService: GroupService
  ) {
    this.userStore = this.userService.getStore();
    this.groupStore = this.groupService.getStore();
  }
  showOnPopup(): void {
    this.onPopup = true;
  }

  inicializate(data: user_form): void {
    this.loadForm(data.model.id);
  }
  ngOnInit(): void {
    this.responsiveService.makeObserver(this.widthsSpan);
    this.initRelatedData();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  loadForm(id: number): void {
    id &&
      this.userStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response) => {
            this.formUser = response;
          },
        });
  }

  initRelatedData(): void {
    this.subscriptions.push(
      this.groupStore._load({ isLoadingAll: true }).subscribe((data) => {
        this.groups = data.data as Group[];
      })
    );
  }

  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;

    this.userStore
      .showLoading()
      ._save(this.formUser.id, this.formUser)
      .subscribe({
        next: (response) => {
          this.eventBusService.emit(
            this.formUser.id ? EventTypes.user_updated : EventTypes.user_added
          );
          this.onPopup = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
