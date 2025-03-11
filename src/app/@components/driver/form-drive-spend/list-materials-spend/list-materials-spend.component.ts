import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MaterialByUser } from '@models/FrontModels';
import { GridConf } from '@models/GridConf';
import { Status } from '@models/Status';
import { Transaction } from '@models/Transaction';
import { TxnDocument } from '@models/TxnDocument';
import { Unit } from '@models/Unit';
import { UnitConversion } from '@models/UnitConversion';
import {
  TxnDocumentService,
  TransactionService,
  MaterialService,
  UnitService,
  StatusService,
  TransactionTypeService,
  UserFetcherService,
  UnitConversionService,
} from "@services/api";
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
  DxPopupModule,
  DxSelectBoxModule,
} from "devextreme-angular";
import { Subscription } from 'rxjs';
@Component({
  standalone: true,
  selector: 'app-list-materials-spend',
  imports: [DxDataGridModule, DxSelectBoxModule],
  templateUrl: './list-materials-spend.component.html',
})
export class ListMaterialsSpendComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;
  @Input() txnDocument: TxnDocument = new TxnDocument();
  public dataGridConf: GridConf = new GridConf();


  public materialsByUser: Array<MaterialByUser> = [];
  public unitTransactions!: Array<Unit>;
  public status!: Array<Status>;
  public unitConversions!: Array<UnitConversion>;
  public unitConversions_temp!: Array<UnitConversion>;
  public materialByUserSelected: MaterialByUser = new MaterialByUser();


  constructor(
    private transactionTypeService: TransactionTypeService,
    public txnDocumentService: TxnDocumentService,
    private userFetcherService: UserFetcherService,
    private transactionService: TransactionService,
    public materialService: MaterialService,
    public unitService: UnitService,
    public statusService: StatusService,
    public unitConversionService: UnitConversionService

  ) {
    this.initDataGrid();
  }
  ngOnInit() {
    this.getMaterialsByLocation();
  }

  initDataGrid(): void {
    this.dataGridConf.setData({
      dataSource: this.txnDocument.transactions,
      columns: [
        {
          dataField: "dynamic_id",
          caption: "Material",
          alignment: "center",
          minWidth: '20vw',
          lookup: {
            dataSource: [],
            valueExpr: "id",
            displayExpr: "serial_or_name",
          },
          editCellTemplate: 'materialTemplate',
        },
        {
          editorType: "dxNumberBox",
          dataField: "available_quantity",
          dataType: "number",
          caption: "Cantidad Disponible",
          alignment: "center",
        },
        {
          dataField: "transaction_quantity",
          caption: "Cantidad Traslado",
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
          caption: "Cantidad Total",
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
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
        useIcons: true,
        texts: {
          addRow: "Material",
        },
      },
    });
  }
  onEditingStart(e: any) {
    e.cancel = true;
  }
  onInitialized(e: any) {

  }
  onInitNewRow(e: any) {
    console.log(e);
  }
  onRowUpdating(e: any) {
    console.log(e);
  }
  onMaterialByUserChanged = (e: { selectedItem: MaterialByUser }, data: any) => {
    console.log(e);
    console.log(data);
  };

  getMaterialsByLocation() {
    this.userFetcherService
      .showLoading()
      .getMaterialsByLocation(this.txnDocument.from_user as number)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.materialsByUser = response.data as Array<MaterialByUser>;
          this.dataGrid!.instance.columnOption('dynamic_id', 'lookup.dataSource', this.materialsByUser);
        },
      });
  }

  initRelatedData(): void {
    this.subscriptions.push(
      this.unitConversionService.getStore({ all: true })
        .showLoading()
        ._load()
        .subscribe({
          next: (response) => {
            this.unitConversions = response.data as Array<UnitConversion>;
          },
        }),
      this.statusService.getStore({ all: true })
        .showLoading()
        ._load({
          all: true,
          filter: ["module_name", "=", Status.STATUS_TRANSACTION],
        })
        .subscribe({
          next: (response) => {
            this.status = response.data as Array<Status>;
          },
        })
    );
  }
  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.forEach((item: any) => {
      if (item.name === "addRowButton") {
        item.showText = true;
        // item.options.onClick = () => this.loadForm(0);
      }
    });

    e.toolbarOptions.items.unshift({
      location: "after",
      widget: "dxButton",
      locateInMenu: "after",
      options: {
        icon: "refresh",
        text: "",
        onClick: () => {
          //this.dataGrid?.instance.refresh();
        },
      },
    });
  }
}
