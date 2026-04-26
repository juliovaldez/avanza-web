import { BaseTConfig, BaseTData } from "./base";
import {
  User,
  Group,
  Location,
  Permission,
  Unit,
  Status,
  Material,
  UnitConversion,
  TransactionType,
} from "@models/index";

export interface BaseConfig extends BaseTConfig {}
export interface BaseData extends BaseTData<any, BaseConfig> {}

export interface users_list extends BaseTData<any, BaseConfig> {}
export interface user_form extends BaseTData<User, BaseConfig> {}
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
