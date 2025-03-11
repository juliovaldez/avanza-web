import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
  effect,
} from "@angular/core";
import {
  Transaction,
  Material,
  Unit,
  User,
  Status,
  UnitConversion,
  TxnDocument,
  MaterialByUser,
  TransactionType,
  Group,
} from "@models/index";
import {
  TxnDocumentService,
  TransactionService,
  MaterialService,
  UnitService,
  StatusService,
  UnitConversionService,
  UserService,
  UserFetcherService,
  TransactionTypeService
} from "@services/api";
import {
  DxPopupModule,
  DxButtonModule,
  DxFormModule,
  DxFormComponent,
  DxDataGridModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxTabPanelModule,
} from "devextreme-angular";
import {
  EventBusService,
  ResponsiveService,
  widthsSpan,
  EventTypes,
} from "@services/core/";
import { Subscription } from "rxjs";
import { ListMaterialsSpendComponent } from "./list-materials-spend/list-materials-spend.component";
@Component({
  standalone: true,
  selector: 'app-form-drive-spend',
  imports: [DxPopupModule,
    DxButtonModule,
    DxFormModule,
    DxDataGridModule,
    DxNumberBoxModule,
    DxTabPanelModule,
    ListMaterialsSpendComponent],
  templateUrl: './form-drive-spend.component.html',
})
export class FormDriveSpendComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  public popupVisible: boolean = true;
  public formTxnDocument = signal<TxnDocument>(new TxnDocument());
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "97%",
    sm: "90%",
    md: "90%",
    lg: "90%",
    xl: "90%",
    xxl: "90%",
  });
  public fromUsersDatasource!: Array<User>;
  public toUsersDatasource!: Array<User>;
  public transactionTypeDatasource!: Array<TransactionType>;

  public txtDocumentStore;
  public txnTypesStore;
  public userStore;
  constructor(
    private responsiveService: ResponsiveService,
    private eventBusService: EventBusService,
    private txnDocumentService: TxnDocumentService,
    public userService: UserService,
    public transactionTypeService: TransactionTypeService
  ) {
    this.txtDocumentStore = this.txnDocumentService.getStore();
    this.txnTypesStore = this.transactionTypeService.getStore({ all: true });
    this.userStore = this.userService.getStore({ all: true });

    this.responsiveService.makeObserver(this.widthsSpan);
    this.initRelatedData();
  }

  labelUser = (data: any) => {
    console.log(data);
    return `${data.username} --- ${data.id}`;
  };

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }
  setDataForm(data: TxnDocument) {
    this.formTxnDocument.set(data);
  }
  newModel() {
    this.formTxnDocument.set(
      new Transaction()
    );
  }
  loadForm(id: number): void {
    id &&
      this.txtDocumentStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response: TxnDocument) => {
            this.formTxnDocument.set(response);
          },
        });
  }
  initRelatedData(): void {
    this.subscriptions.push(
      this.userStore
        ._load({
          filter: ["groups", "=", Group.TECNICO],
        })
        .subscribe({
          next: (data) => {
            this.fromUsersDatasource = data.data as Array<User>;
          },
        }),
      this.userStore
        ._load({ filter: ["groups", "=", Group.CONSUMO] })
        .subscribe({
          next: (data: any) => {
            this.toUsersDatasource = data.data;
          },
        }),
      this.txnTypesStore
        ._load({ filter: ["name", "=", TransactionType.DEL] })
        .subscribe({
          next: (data: any) => {
            this.transactionTypeDatasource = data.data;
          },
        })
    );
  }
  save(): void {
    let formInstance = this.form.instance;
    if (!formInstance.validate().isValid) return;
    this.txtDocumentStore
      .showLoading()
      ._save(this.formTxnDocument().id, this.formTxnDocument())
      .subscribe({
        next: () => {
          this.eventBusService.emit(
            this.formTxnDocument().id
              ? EventTypes.txn_document_updated
              : EventTypes.txn_document_added
          );
          this.popupVisible = false;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
  onFromUserChanged = (e: any) => {
    this.formTxnDocument().from_user_location = (
      e.selectedItem as User
    ).inventory_profile?.location;
  };
  onToUserChanged = (e: any) => {
    this.formTxnDocument().to_user_location = (
      e.selectedItem as User
    ).inventory_profile?.location;
  };
}
