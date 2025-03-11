export interface IGridConf {
  dataSource?: any;
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

}

export class GridConf implements IGridConf {
  dataSource?: any;
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

  constructor() {
    this.columns = [];
    this.paging = {
      pageSize: 10,
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
      visible: true
    }
    this.grouping = {
      autoExpandAll: false
    }
    this.remoteOperations = {
      filtering: true,
      grouping: true,
      groupPaging: true,
      paging: true,
      sorting: true,
      summary: true
    };
    this.summary = {
      groupItems: []
    }
    this.toolbar = {
      items: [],

    }
    this.columnResizingMode = "widget";

  }

  setData(data: IGridConf) {
    Object.assign(this, data);
    this.columns.push({
      type: "buttons",
      buttons: [{ name: "edit" }, { name: "delete" }, ...this.buttons],
    });
  }
}
