import { InjectionToken, Type } from "@angular/core";
import { lazyWidgets } from "./lazy-widgets.enum";

import type {
  BaseData,
  users_list,
  user_form,
  groups_list,
  group_form,
  permissions_list,
  permission_form,
  inventory_profile,
  fibergo_profile,
} from "@components/widget.types";

type RequireAllKeys<T extends Record<lazyWidgets, any>> = {
  [K in keyof T]: T[K];
};

export type WidgetDataMap = RequireAllKeys<{
  [lazyWidgets.users_list]: users_list;
  [lazyWidgets.user_form]: user_form;
  [lazyWidgets.groups_list]: groups_list;
  [lazyWidgets.group_form]: group_form;
  [lazyWidgets.permissions_list]: permissions_list;
  [lazyWidgets.permission_form]: permission_form;
  [lazyWidgets.inventory_profile]: inventory_profile;
  [lazyWidgets.fibergo_profile]: fibergo_profile;
}>;

export const lazyWidgetsRootObj: Record<lazyWidgets, () => Promise<Type<any>>> =
  {
    [lazyWidgets.users_list]: () =>
      import("../../@components").then((m) => m.ListUsersComponent),
    [lazyWidgets.user_form]: () =>
      import("../../@components").then((m) => m.FormUserComponent),
    [lazyWidgets.groups_list]: () =>
      import("../../@components").then((m) => m.ListGroupsComponent),
    [lazyWidgets.group_form]: () =>
      import("../../@components").then((m) => m.FormGroupComponent),
    [lazyWidgets.permissions_list]: () =>
      import("../../@components").then((m) => m.ListPermissionsComponent),
    [lazyWidgets.permission_form]: () =>
      import("../../@components").then((m) => m.FormPermissionComponent),
    [lazyWidgets.inventory_profile]: () =>
      import("../../@components/users/inventory-profile/inventory-profile.component").then(
        (m) => m.InventoryProfileComponent
      ),
    [lazyWidgets.fibergo_profile]: () =>
      import("../../@components/users/fibergo-profile/fibergo-profile.component").then(
        (m) => m.FiberGoProfileComponent
      ),
  };

export const LAZY_WIDGETS_ROOT = new InjectionToken<typeof lazyWidgetsRootObj>(
  "LAZY_WIDGETS_ROOT"
);

export function lazyLoadToObjRoot(): typeof lazyWidgetsRootObj {
  return lazyWidgetsRootObj;
}
