import { PERMISSIONS } from "@services/core";
export const navigation = [
  {
    text: "Dashboard",
    path: "/home",
    icon: "home",
  },
  {
    text: "Settings",
    icon: "user",
    data: {
      permissions: [],
    },
    items: [
      {
        text: "Usuarios",
        path: "/home/users",
        data: {
          permissions: [PERMISSIONS.users_view_user],
        },
      },
      {
        text: "Grupos",
        path: "/home/groups",
        data: {
          permissions: [PERMISSIONS.auth_view_group],
        },
      },
      {
        text: "Ubicaciones",
        path: "/home/locations",
        data: {
          permissions: [PERMISSIONS.auth_view_group],
        },
      },
      {
        text: "Tipo Txn",
        path: "/home/transaction-types",
        data: {
          permissions: [PERMISSIONS.auth_view_group],
        },
      },
    ],
  },
  {
    text: "Catalogs",
    icon: "folder",
    items: [
      {
        text: "Unidades",
        path: "/home/units",
        data: {
          permissions: [PERMISSIONS.inventory_view_unit],
        },
      },
      {
        text: "Status",
        path: "/home/status",
        data: {
          permissions: [PERMISSIONS.inventory_view_status],
        },
      },
      {
        text: "Materials",
        path: "/home/materials",
        data: {
          permissions: [PERMISSIONS.inventory_view_material],
        },
      },
      {
        text: "Conversiones",
        path: "/home/unit-conversions",
        data: {
          permissions: [PERMISSIONS.inventory_view_unitconversion],
        },
      },
      {
        text: "Kits",
        path: "/home/kits",
        data: {
          permissions: [PERMISSIONS.inventory_view_barcode],
        },
      },
    ],
  },
  {
    text: "Inventario",
    icon: "folder",
    items: [
      {
        text: "Almacen",
        path: "/home/txn-documents",
        data: {
          permissions: [PERMISSIONS.inventory_view_ingress],
        },
      },
      {
        text: "Tecnicos",
        path: "/home/drives",
        data: {
          permissions: [PERMISSIONS.inventory_view_ingress],
        },
      },
    ],
  },
];
