import { InjectionToken, Type } from "@angular/core";

export enum lazyWidgets {
  users_list = "users.list",
  user_form = "users.form",
  inventory_profile = "users.inventory_profile",
  groups_list = "groups.list",
  group_form = "groups.form",
  location_list = "location.list",
  location_form = "location.form",
  permissions_list = "permissions.list",
  permission_form = "permissions.form",
  unit_list = "unit.list",
  unit_form = "unit.form",
  status_list = "status.list",
  status_form = "status.form",
  material_list = "material.list",
  material_form = "material.form",
  unit_conversion_list = "unit_conversion.list",
  unit_conversion_form = "unit_conversion.form",
  kit_list = "kit.list",
  kit_form = "kit.form",
  transaction_type_list = "transaction_type.list",
  transaction_type_form = "transaction_type.form",
  txn_document_list = "txn_document.list",
  txn_document_form_in = "txn_document_in.form",
  txn_document_form_out = "txn_document_out.form",
  txn_document_form_transfer = "txn_document_transfer.form",
  transaction_list = "transaction.list",
  transaction_form_in = "transaction_in.form",
  transaction_grid_in = "transaction_in.grid",
  transaction_grid_in_ont = "transaction_out.grid_in",
  transaction_form_out = "transaction_out.form",
  transaction_grid_out = "transaction_out.grid",
  transaction_grid_out_ont = "transaction_out.grid_ont",
  transaction_form_transfer = "transaction_transfer.form",
  driver_list = "drive.list",
  driver_installation_list = 'drive.installation.list',
  driver_installation_form = 'drive.installation.form',
  driver_form_spend = 'drive.form.spend',
  user_materials = "user_materials",
}

const lazyWidgetsRoot: {
  path: string;
  loadChildren: () => Promise<Type<any>>;
}[] = [
    {
      path: lazyWidgets.users_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.ListUsersComponent),
    },
    {
      path: lazyWidgets.user_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormUserComponent),
    },
    {
      path: lazyWidgets.inventory_profile,
      loadChildren: () =>
        import("../../@components").then((m) => m.InventoryProfileComponent),
    },
    {
      path: lazyWidgets.groups_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.ListGroupsComponent),
    },
    {
      path: lazyWidgets.group_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormGroupComponent),
    },
    {
      path: lazyWidgets.location_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.ListLocationsComponent),
    },
    {
      path: lazyWidgets.location_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormLocationComponent),
    },
    {
      path: lazyWidgets.permissions_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.ListPermissionsComponent),
    },
    {
      path: lazyWidgets.permission_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormPermissionComponent),
    },
    {
      path: lazyWidgets.unit_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.ListUnitsComponent),
    },
    {
      path: lazyWidgets.unit_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormUnitComponent),
    },
    {
      path: lazyWidgets.status_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.ListStatusComponent),
    },
    {
      path: lazyWidgets.status_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormStatusComponent),
    },
    {
      path: lazyWidgets.material_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.ListMaterialsComponent),
    },
    {
      path: lazyWidgets.material_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormMaterialComponent),
    },
    {
      path: lazyWidgets.unit_conversion_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.ListUnitConversionsComponent),
    },
    {
      path: lazyWidgets.unit_conversion_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormUnitConversionComponent),
    },
    {
      path: lazyWidgets.transaction_type_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.ListTransactionTypesComponent),
    },
    {
      path: lazyWidgets.transaction_type_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormTransactionTypeComponent),
    },
    {
      path: lazyWidgets.txn_document_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.ListTxnDocumentsComponent),
    },
    {
      path: lazyWidgets.txn_document_form_in,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormTxnDocumentInComponent),
    },
    {
      path: lazyWidgets.txn_document_form_out,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormTxnDocumentOutComponent),
    },

    {
      path: lazyWidgets.txn_document_form_transfer,
      loadChildren: () =>
        import("../../@components").then(
          (m) => m.FormTxnDocumentTransferComponent
        ),
    },
    {
      path: lazyWidgets.transaction_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.ListTransactionsComponent),
    },
    {
      path: lazyWidgets.transaction_form_in,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormTransactionInComponent),
    },
    {
      path: lazyWidgets.transaction_grid_in,
      loadChildren: () =>
        import("../../@components").then((m) => m.GridTransactionInComponent),
    },
    {
      path: lazyWidgets.transaction_grid_in_ont,
      loadChildren: () =>
        import("../../@components").then((m) => m.GridTransactionOntInComponent),
    },

    {
      path: lazyWidgets.transaction_form_out,
      loadChildren: () =>
        import("../../@components").then((m) => m.FormTransactionOutComponent),
    },
    {
      path: lazyWidgets.transaction_grid_out,
      loadChildren: () =>
        import("../../@components").then((m) => m.GridTransactionOutComponent),
    },
    {
      path: lazyWidgets.transaction_grid_out_ont,
      loadChildren: () =>
        import("../../@components").then((m) => m.GridTransactionOntOutComponent),
    },
    {
      path: lazyWidgets.transaction_form_transfer,
      loadChildren: () =>
        import("../../@components").then(
          (m) => m.FormTransactionTransferComponent
        ),
    },
    {
      path: lazyWidgets.driver_list,
      loadChildren: () =>
        import("../../@components").then(
          (m) => m.DriverListComponent
        ),
    },
    {
      path: lazyWidgets.driver_installation_list,
      loadChildren: () =>
        import("../../@components").then(
          (m) => m.DriverInstallationListComponent
        ),
    },
    {
      path: lazyWidgets.driver_installation_form,
      loadChildren: () =>
        import("../../@components").then(
          (m) => m.DriverInstallationFormComponent
        ),
    },
    {
      path: lazyWidgets.driver_form_spend,
      loadChildren: () =>
        import("../../@components").then(
          (m) => m.FormDriveSpendComponent
        ),
    },
    {
      path: lazyWidgets.user_materials,
      loadChildren: () =>
        import("../../@components").then(
          (m) => m.UserMaterialsComponent
        ),
    },
  ];
export function lazyLoadToObjRoot() {
  const result: { [key: string]: () => Promise<any> } = {};
  lazyWidgetsRoot.forEach((item) => {
    result[item.path] = item.loadChildren;
  });
  return result;
}
export const LAZY_WIDGETS_ROOT = new InjectionToken<
  [{ [key: string]: () => Promise<any> }]
>("LAZY_WIDGETS_ROOT");
