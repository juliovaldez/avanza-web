import { saveAs } from "file-saver";
import { exportDataGrid } from "devextreme-angular/common/export/excel";
import ExcelJS from "exceljs/dist/exceljs.min.js";

export interface IGridConf {
  active?: boolean;
  name?: string;
  dataSource?: any;
  filterValue?: any;
  columns?: any;
  paging?: any;
  pager?: any;
  searchPanel?: any;
  headerFilter?: any;
  editing?: any;
  selection?: any;
  filterPanel?: any;
  filterRow?: any;
  dataType?: any;
  masterDetail?: any;
  buttons?: any;
  groupPanel?: any;
  remoteOperations?: any;
  grouping?: any;
  summary?: any;
  toolbar?: any;
  columnResizingMode?: any;
  export?: any;
}

export class GridConf implements IGridConf {
  active: boolean = false;
  name = "default";
  dataSource?: any;
  filterValue?: any;
  columns?: any;
  paging?: any;
  pager?: any;
  searchPanel?: any;
  headerFilter?: any;
  editing?: any;
  selection?: any;
  filterPanel?: any;
  filterRow?: any;
  dataType?: any;
  masterDetail?: any;
  buttons?: any;
  columnChooser?: any;
  groupPanel?: any;
  remoteOperations?: any;
  grouping?: any;
  summary?: any;
  toolbar?: any;
  columnResizingMode?: any;
  export?: any;
  constructor() {
    this.filterValue = [];
    this.columns = [];
    this.paging = {
      pageSize: 25,
      pageIndex: 0,
    };
    this.pager = {
      visible: true,
      showPageSizeSelector: true,
      allowedPageSizes: [5, 10, 25, 50, 100],
    };

    this.searchPanel = {
      visible: true,
      highlightCaseSensitive: true,
      placeholder: "Buscar..",
    };

    this.headerFilter = {
      visible: true,
    };
    this.editing = {
      mode: "row",
      allowUpdating: false,
      allowDeleting: false,
      allowAdding: false,
      useIcons: true,
      texts: {
        addRow: "Nuevo",
      },
    };

    this.selection = {
      mode: "single",
    };
    this.filterPanel = {
      visible: false,
    };
    this.filterRow = {
      visible: true,
    };
    this.masterDetail = {
      enabled: false,
      template: "",
    };
    this.buttons = [];
    this.columnChooser = {
      enabled: true,
      height: "500%",
      width: "30%",
      mode: "select",
      search: {
        enabled: true,
        editorOptions: {},
      },
      selection: {
        allowSelectAll: true,
        selectByClick: true,
        recursive: true,
      },
    };
    this.groupPanel = {
      visible: true,
    };
    this.grouping = {
      autoExpandAll: false,
    };
    this.remoteOperations = {
      filtering: true,
      grouping: true,
      groupPaging: true,
      paging: true,
      sorting: true,
      summary: true,
      repaintChangesOnly: false,
    };
    this.summary = {
      groupItems: [],
    };
    this.toolbar = {
      items: [],
    };
    this.columnResizingMode = "widget";

    this.export = {
      enabled: true,
      fileName: "Default",
    };
  }

  setData(data: IGridConf) {
    Object.assign(this, data);
    this.columns.push({
      type: "buttons",
      fixed: true,
      fixedPosition: "left",
      buttons: [{ name: "edit" }, { name: "delete" }, ...this.buttons],
    });
  }

  onExporting(e: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");
    console.log(e.component.totalCount());
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
      selectedRowsOnly: false,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${this.name || "default"}.xlsx`);
      });
    });
  }
}
