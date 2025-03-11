import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Group, TxnDocument, TransactionType, User } from "@models/index";
import {
  TxnDocumentService,
  TransactionService,
  UserService,
  TransactionTypeService,
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
import { Subscription } from "rxjs";

@Component({
  selector: "app-form-txn-document-out",
  standalone: true,
  imports: [DxPopupModule, DxButtonModule, DxFormModule, DxDataGridModule],
  templateUrl: "./form-txn-document-out.component.html",
})
export class FormTxnDocumentOutComponent {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxFormComponent) form!: DxFormComponent;
  public popupVisible: boolean = true;
  public formTxnDocument: TxnDocument = new TxnDocument();
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "90%",
    md: "80%",
    lg: "70%",
    xl: "60%",
    xxl: "40%",
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

  loadForm(id: number): void {
    id &&
      this.txtDocumentStore
        .showLoading()
        ._byKey(id)
        .subscribe({
          next: (response: TxnDocument) => {
            this.formTxnDocument = response;
          },
        });
  }

  initRelatedData(): void {
    this.subscriptions.push(
      this.userStore
        ._load({
          filter: ["groups", "=", Group.ALMACEN],
        })
        .subscribe({
          next: (data) => {
            this.fromUsersDatasource = data.data as Array<User>;
          },
        }),
      this.userStore
        ._load({ filter: ["groups", "=", Group.TECNICO] })
        .subscribe({
          next: (data: any) => {
            this.toUsersDatasource = data.data;
          },
        }),
      this.txnTypesStore
        ._load({ filter: ["name", "=", TransactionType.OUT] })
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
      ._save(this.formTxnDocument.id, this.formTxnDocument)
      .subscribe({
        next: () => {
          this.eventBusService.emit(
            this.formTxnDocument.id
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
    this.formTxnDocument.from_user_location = (
      e.selectedItem as User
    ).inventory_profile?.location;
  };
  onToUserChanged = (e: any) => {
    this.formTxnDocument.to_user_location = (
      e.selectedItem as User
    ).inventory_profile?.location;
  };
}
