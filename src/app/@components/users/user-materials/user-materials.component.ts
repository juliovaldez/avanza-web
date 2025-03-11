import {
  Component,
  OnDestroy,
  signal,
  effect,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AuthService,
  PERMISSIONS,
  LazyLoadService,
  lazyWidgets,
  EventBusService,
  EventTypes,
  widthsSpan,
  ResponsiveService,
} from "@services/core";
import {
  MaterialService,
  StatusService,
  TransactionService,
  TransactionTypeService,
  TxnDocumentService,
  UnitService,
} from "@services/api";
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
  DxPopupModule,
} from "devextreme-angular";
import { Subscription, lastValueFrom } from "rxjs";
import { FormMaterialComponent } from "@components/material/form-material/form-material.component";
import { Unit, Status, GridConf, User, TxnDocument } from "@models/index";

import CustomStore from 'devextreme/data/custom_store';
import { LoadOptions } from 'devextreme/data';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { group } from "@angular/animations";
import { FormDriveSpendComponent } from "@components/driver/form-drive-spend/form-drive-spend.component";
@Component({
  standalone: true,
  selector: "app-user-materials",
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, DxPopupModule],
  templateUrl: "./user-materials.component.html",
})
export class UserMaterialsComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;
  @ViewChild("lazyContainer", { read: ViewContainerRef })
  lazyContainer!: ViewContainerRef;
  public showOnPopup: boolean = false;
  public dataGridConf: GridConf = new GridConf();
  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "100%",
    md: "100%",
    lg: "100%",
    xl: "100%",
    xxl: "100%",
  });
  public drivesSelected: User[] = [];
  public units: Unit[] = [];
  dataSource = {} as CustomStore;

  constructor(
    httpClient: HttpClient,
    private authService: AuthService,
    private lazyLoadService: LazyLoadService,
    private eventBusService: EventBusService,
    private responsiveService: ResponsiveService,
    private txnDocumentService: TxnDocumentService,
    private transactionService: TransactionService,
    private materialService: MaterialService,
    private unitService: UnitService,
    private statusService: StatusService,
    private transactionTypeService: TransactionTypeService
  ) {
    this.initDataGrid();
    this.subscribeBusEvents();
    this.responsiveService.makeObserver(this.widthsSpan);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  showPopup() {
    this.showOnPopup = true;
  }


  subscribeBusEvents() {
    this.subscriptions.push(
      this.eventBusService.on([EventTypes.drive_selected]).subscribe((data) => {
        this.drivesSelected = data.data;
        this.dataGrid?.instance.filter([
          [
            "txn_document__to_user",
            "in",
            data.data.map((user: any) => user.id),
          ],
          "and",
          ["available_quantity", ">", 0],
        ]);
      })
    );
  }

  initDataGrid(): void {
    this.dataGridConf.setData({
      dataSource: this.transactionService.getStore(),
      columns: [
        {
          dataField: "material",
          caption: "Material",
          alignment: "center",
          lookup: {
            dataSource: this.materialService.getStore({ all: true }),
            valueExpr: "id",
            displayExpr: "name",
          },
          groupIndex: 0
        },
        {
          dataField: "txn_document",
          caption: "Documento",
          alignment: "center",
          lookup: {
            dataSource: this.txnDocumentService.getStore({ all: true }),
            valueExpr: "id",
            displayExpr: "folio_number",
          },
        },
        {
          dataField: "txn_document",
          caption: "Referencia",
          alignment: "center",
          lookup: {
            dataSource: this.txnDocumentService.getStore({ all: true }),
            valueExpr: "id",
            displayExpr: "reference",
          },
        },
        {
          editorType: "dxTextBox",
          dataField: "serial_number",
          caption: "Serial",
          alignment: "center",
        },
        {
          editorType: "dxNumberBox",
          dataField: "transaction_quantity",
          dataType: "number",
          caption: "Cant. Traslado",
          alignment: "center",
        },
        {
          dataField: "transaction_unit",
          caption: "Unid. Traslado",
          alignment: "center",
          lookup: {
            dataSource: this.unitService.getStore({ all: true }),
            valueExpr: "id",
            displayExpr: "symbol",
          },
        },
        {
          editorType: "dxNumberBox",
          dataField: "base_quantity",
          dataType: "number",
          caption: "Total",
          alignment: "center",
        },
        {
          dataField: "base_unit",
          caption: "Unidad",
          alignment: "center",
          lookup: {
            dataSource: this.unitService.getStore({ all: true }),
            valueExpr: "id",
            displayExpr: "symbol",
          },
        },
        {
          editorType: "dxNumberBox",
          dataField: "available_quantity",
          dataType: "number",
          caption: "Saldo",
          alignment: "center",
        },
        {
          dataField: "status",
          caption: "Estatus",
          alignment: "center",
          lookup: {
            dataSource: this.statusService.getStore({ all: true }),
            valueExpr: "id",
            displayExpr: "status_name",
          },
        },
      ],
      editing: {
        mode: "row",
        allowUpdating: false,
        allowDeleting: false,
        allowAdding: false,
        useIcons: true,
        texts: {
          addRow: "Agregar",
        },
      },
      summary: {
        groupItems: [{
          column: "base_quantity",
          summaryType: 'sum',
          displayFormat: 'Sum: {0}',
          alignByColumn: true
        }, {
          column: "available_quantity",
          summaryType: 'sum',
          displayFormat: 'Sum: {0}',
          alignByColumn: true
        }, {
          column: "transaction_quantity",
          summaryType: 'sum',
          displayFormat: 'Sum: {0}',
          alignByColumn: true
        }]
      }
    });
  }
  onInitialized(e: any) {
    e.component.filter([["txn_document", "in", [0]]]);
  }
  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift({
      location: "after",
      widget: "dxButton",
      locateInMenu: "after",
      options: {
        icon: "refresh",
        text: "",
        onClick: () => {
          this.dataGrid?.instance.refresh();
        },
      },
    }, {
      location: "after",
      widget: "dxButton",
      locateInMenu: "after",
      options: {
        icon: "add",
        text: "Instalar",
        onClick: () => {
          this.loadFormSpend(0);
        },
      },
    },);
  }
  onEditingStart(e: any) {
    e.cancel = true;
  }
  async loadFormSpend(id: number) {
    if (this.drivesSelected.length == 1) {
      const driveSelected = this.drivesSelected[0];
      const instance: FormDriveSpendComponent = await this.lazyLoadService.load(
        lazyWidgets.driver_form_spend,
        this.lazyContainer
      );
      if (id) {
        instance.loadForm(id);
      } else {
        instance.setDataForm(new TxnDocument({ from_user: driveSelected.id }));
      }
    }

  }
}
