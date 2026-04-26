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
        path: "/home/sepomex",
        data: {
          permissions: [PERMISSIONS.sepomex_view_cargasepomex],
        },
      },
    ],
  },
  {
    text: "Estructura",
    icon: "fields",
    items: [
      {
        text: "Tipo de Propiedad",
        path: "/home/catalogo/tipo-propiedad",
        data: { permissions: [PERMISSIONS.catalogs_view_tipopropiedad] },
      },
    ],
  },
  {
    text: "Propiedades",
    icon: "home",
    items: [
      {
        text: "Nueva Propiedad",
        path: "/home/propiedades/nueva",
        data: { permissions: [PERMISSIONS.propiedades_add_propiedad] },
      },
      {
        text: "Listado",
        path: "/home/propiedades",
        data: { permissions: [PERMISSIONS.propiedades_view_propiedad] },
      },
    ],
  },
  {
    text: "Documentación",
    icon: "doc",
    items: [
      {
        text: "Documentos de la Propiedad",
        path: "/home/documentacion/documento-propiedad",
        data: { permissions: [PERMISSIONS.catalogs_view_documentopropiedad] },
      },
      {
        text: "Predial",
        path: "/home/documentacion/predial",
        data: { permissions: [PERMISSIONS.catalogs_view_predial] },
      },
      {
        text: "Servicios al Corriente",
        path: "/home/documentacion/servicios-corriente",
        data: { permissions: [PERMISSIONS.catalogs_view_servicioscorriente] },
      },
      {
        text: "Gravamen",
        path: "/home/documentacion/gravamen",
        data: { permissions: [PERMISSIONS.catalogs_view_gravamen] },
      },
      {
        text: "Situación Legal",
        path: "/home/documentacion/situacion-legal",
        data: { permissions: [PERMISSIONS.catalogs_view_situacionlegal] },
      },
    ],
  },
  {
    text: "Calidad",
    icon: "star",
    items: [
      {
        text: "Calidad de Construcción",
        path: "/home/calidad/calidad-construccion",
        data: { permissions: [PERMISSIONS.catalogs_view_calidadconstruccion] },
      },
      {
        text: "Estado de Conservación",
        path: "/home/calidad/estado-conservacion",
        data: { permissions: [PERMISSIONS.catalogs_view_estadoconservacion] },
      },
      {
        text: "Tipo de Acabado",
        path: "/home/calidad/tipo-acabado",
        data: { permissions: [PERMISSIONS.catalogs_view_tipoacabado] },
      },
      {
        text: "Mantenimiento",
        path: "/home/calidad/mantenimiento",
        data: { permissions: [PERMISSIONS.catalogs_view_mantenimiento] },
      },
      {
        text: "Equipamiento",
        path: "/home/calidad/equipamiento",
        data: { permissions: [PERMISSIONS.catalogs_view_equipamiento] },
      },
    ],
  },
  {
    text: "Testimonios",
    icon: "comment",
    items: [
      {
        text: "Listado",
        path: "/home/testimonios",
        data: {
          permissions: [PERMISSIONS.testimonials_view_testimonio],
        },
      },
    ],
  },
  {
    text: "Contacto",
    icon: "email",
    items: [
      {
        text: "Configuración",
        path: "/home/contacto",
        data: {
          permissions: [PERMISSIONS.contacto_view_contactoconfig],
        },
      },
    ],
  },
  {
    text: "Casos de Éxito",
    icon: "photo",
    items: [
      {
        text: "Listado",
        path: "/home/casos-exito",
        data: {
          permissions: [PERMISSIONS.casos_exito_view_casoexito],
        },
      },
    ],
  },
];
