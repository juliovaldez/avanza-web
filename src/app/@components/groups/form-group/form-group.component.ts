import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { GridConf, Group } from "@models/index";
import { GroupService } from "@services/api";
import { UserService, PermissionService } from "@services/api";
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
import { Subscription } from "rxjs";
import { ListPermissionsComponent } from "@components/index";

import { LazyComponent } from "@components/base";
import { group_form } from "@components/widget.types";

@Component({
  selector: "app-form-group",
  standalone: true,
  imports: [DxPopupModule, DxButtonModule, DxFormModule, DxDataGridModule],
  templateUrl: "./form-group.component.html",
})
export class FormGroupComponent
  implements LazyComponent<group_form>, OnDestroy, AfterViewInit
{
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  @ViewChild("lazyContainer", { read: ViewContainerRef })
  listPermissions!: ViewContainerRef;
  private subscriptions: Subscription[] = [];
  public onPopup: boolean = true;
  public formGroup: Group = new Group();
  public groups: Group[] = [];
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "90%",
    md: "80%",
    lg: "70%",
    xl: "60%",
    xxl: "40%",
  });
  public dataGridConf: GridConf = new GridConf();

  public groupStore;

  constructor(
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    private groupService: GroupService,
    private permissionService: PermissionService
  ) {
    const options = { isLoadingAll: true };
    this.groupStore = this.groupService.getStore({ options });

    this.initDataGrid();
    this.responsiveService.makeObserver(this.widthsSpan);
    this.initRelatedData();
  }
  ngAfterViewInit(): void {}
  showOnPopup(): void {
    this.onPopup = true;
  }
  inicializate(data: group_form): void {
    this.loadForm(data.model?.id || 0);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }
  initDataGrid(): void {
    this.dataGridConf.setData({
      remoteOperations: false,
      columns: [{ dataField: "name", caption: "Nombre" }],
      paging: {
        pageSize: 5,
        pageIndex: 0,
      },
      pager: {
        visible: true,
        showPageSizeSelector: true,
        allowedPageSizes: [5, 10],
      },
      searchPanel: {
        visible: true,
        highlightCaseSensitive: true,
        placeholder: "Buscar..",
      },
      headerFilter: {
        visible: true,
      },
      selection: {
        mode: "multiple",
      },
    });
  }

  loadForm(id: number): void {
    id &&
      this.groupStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response) => {
            this.formGroup = response;
          },
        });
  }

  initRelatedData(): void {
    const options = { isLoadingAll: true };
    this.permissionService
      .getStore({ options })
      ._load()
      .subscribe({
        next: (data) => (this.dataGridConf.dataSource = data.data),
      });
  }

  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;
    this.groupStore
      .showLoading()
      ._save(this.formGroup.id, this.formGroup)
      .subscribe({
        next: () => {
          this.eventBusService.emit(
            this.formGroup.id
              ? EventTypes.group_updated
              : EventTypes.group_added
          );
          this.onPopup = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
