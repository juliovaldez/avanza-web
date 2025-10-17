import { InjectionToken, Type } from "@angular/core";

export enum lazyWidgets {
  user_list = "user.list",
  user_form = "users.form",
  group_list = "group.list",
  group_form = "group.form",
  sale_profile_list = "sale_profile.list",
  sale_profile_form = "sale_profile.form",
  permission_list = "permission.list",
  permission_form = "permission.form",
  status_list = "status.list",
  status_form = "status.form",
}

const lazyWidgetsRoot: {
  path: string;
  loadChildren: () => Promise<Type<any>>;
}[] = [
    {
      path: lazyWidgets.user_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.UserListComponent),
    },
    {
      path: lazyWidgets.user_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.UserFormComponent),
    },
    {
      path: lazyWidgets.sale_profile_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.SaleProfileListComponent),
    },
    {
      path: lazyWidgets.sale_profile_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.SaleProfileFormComponent),
    },
    {
      path: lazyWidgets.group_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.GroupListComponent),
    },
    {
      path: lazyWidgets.group_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.GroupFormComponent),
    },
    {
      path: lazyWidgets.permission_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.PermissionListComponent),
    },
    {
      path: lazyWidgets.permission_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.PermissionFormComponent),
    },

    {
      path: lazyWidgets.status_list,
      loadChildren: () =>
        import("../../@components").then((m) => m.StatusListComponent),
    },
    {
      path: lazyWidgets.status_form,
      loadChildren: () =>
        import("../../@components").then((m) => m.StatusFormComponent),
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
