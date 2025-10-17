import { BaseTConfig, BaseTData } from "./base";
import {
  Material,
  User,
  Group,
  Location,
  Permission,
  Unit,
  Status,
  UnitConversion,
  TransactionType,
  TxnDocument,
  Transaction,
  FiberGoProfile,
  OrbitRegistry,
  FiberTask,
} from "@models/index";

export interface BaseConfig extends BaseTConfig {}
export interface BaseData extends BaseTData<any, BaseConfig> {}

export interface users_list extends BaseTData<any, BaseConfig> {}
export interface user_form extends BaseTData<User, BaseConfig> {}
export interface inventory_profile extends BaseTData<User, BaseConfig> {}
export interface groups_list extends BaseTData<any, BaseConfig> {}
export interface group_form extends BaseTData<Group, BaseConfig> {}
export interface location_list extends BaseTData<any, BaseConfig> {}
export interface location_form extends BaseTData<Location, BaseConfig> {}
export interface permissions_list extends BaseTData<any, BaseConfig> {}
export interface permission_form extends BaseTData<any, BaseConfig> {}
export interface unit_list extends BaseTData<any, BaseConfig> {}
export interface unit_form extends BaseTData<Unit, BaseConfig> {}
export interface status_list extends BaseTData<any, BaseConfig> {}
export interface status_form extends BaseTData<Status, BaseConfig> {}
export interface material_list extends BaseTData<any, BaseConfig> {}
export interface material_form extends BaseTData<Material, BaseConfig> {}
export interface unit_conversion_list extends BaseTData<any, BaseConfig> {}
export interface unit_conversion_form
  extends BaseTData<UnitConversion, BaseConfig> {}
export interface transaction_type_list extends BaseTData<any, BaseConfig> {}
export interface transaction_type_form
  extends BaseTData<TransactionType, BaseConfig> {}
export interface txn_document_driver_list extends BaseTData<any, BaseConfig> {}

export interface txn_document_store_list extends BaseTData<any, BaseConfig> {}

export interface txn_document_installation_list
  extends BaseTData<any, BaseConfig> {}

export interface txn_document_summary_list extends BaseTData<any, BaseConfig> {
  selected_users: Array<User>;
  selected_materials: Array<Material>;
}

export interface txn_document_form_in
  extends BaseTData<TxnDocument, BaseConfig> {}

export interface txn_document_form_out
  extends BaseTData<TxnDocument, BaseConfig> {}

export interface txn_document_form_del
  extends BaseTData<TxnDocument, BaseConfig> {}

export interface txn_document_form_transfer
  extends BaseTData<TxnDocument, BaseConfig> {}
export interface txn_document_form_fix_down
  extends BaseTData<TxnDocument, BaseConfig> {}
export interface transaction_list extends BaseTData<TxnDocument, BaseConfig> {}
export interface transaction_in_form
  extends BaseTData<Transaction, BaseConfig> {}
export interface transaction_in_grid
  extends BaseTData<TxnDocument, BaseConfig> {}
export interface transaction_in_grid_ont
  extends BaseTData<TxnDocument, BaseConfig> {}
export interface transaction_transfer_form
  extends BaseTData<Transaction, BaseConfig> {}
export interface transaction_transfer_grid
  extends BaseTData<TxnDocument, BaseConfig> {}
export interface transaction_transfer_grid_ont
  extends BaseTData<TxnDocument, BaseConfig> {}
export interface fibergo_profile extends BaseTData<Unit, BaseConfig> {}
export interface orbit_registry_list extends BaseTData<any, BaseConfig> {}
export interface orbit_registry_form extends BaseTData<any, BaseConfig> {}
export interface fiber_task_list extends BaseTData<OrbitRegistry, BaseConfig> {}
export interface fiber_task_form extends BaseTData<FiberTask, BaseConfig> {}
export interface orbit_registry_form extends BaseTData<any, BaseConfig> {}
export interface report_txn_snapshot_daily_chart
  extends BaseTData<any, BaseConfig> {}
export interface report_txn_snapshot_form extends BaseTData<any, BaseConfig> {}
