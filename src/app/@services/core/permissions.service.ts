export enum PERMISSIONS {
// Catálogos de Propiedad
catalogs_view_tipopropiedad   = 'catalogs.view_tipopropiedad',
catalogs_add_tipopropiedad    = 'catalogs.add_tipopropiedad',
catalogs_change_tipopropiedad = 'catalogs.change_tipopropiedad',
catalogs_delete_tipopropiedad = 'catalogs.delete_tipopropiedad',

// Propiedades
propiedades_view_propiedad   = 'propiedades.view_propiedad',
propiedades_add_propiedad    = 'propiedades.add_propiedad',
propiedades_change_propiedad = 'propiedades.change_propiedad',
propiedades_delete_propiedad = 'propiedades.delete_propiedad',

// Catálogos de Documentación
catalogs_view_documentopropiedad   = 'catalogs.view_documentopropiedad',
catalogs_add_documentopropiedad    = 'catalogs.add_documentopropiedad',
catalogs_change_documentopropiedad = 'catalogs.change_documentopropiedad',
catalogs_delete_documentopropiedad = 'catalogs.delete_documentopropiedad',

catalogs_view_predial              = 'catalogs.view_predial',
catalogs_add_predial               = 'catalogs.add_predial',
catalogs_change_predial            = 'catalogs.change_predial',
catalogs_delete_predial            = 'catalogs.delete_predial',

catalogs_view_servicioscorriente   = 'catalogs.view_servicioscorriente',
catalogs_add_servicioscorriente    = 'catalogs.add_servicioscorriente',
catalogs_change_servicioscorriente = 'catalogs.change_servicioscorriente',
catalogs_delete_servicioscorriente = 'catalogs.delete_servicioscorriente',

catalogs_view_gravamen             = 'catalogs.view_gravamen',
catalogs_add_gravamen              = 'catalogs.add_gravamen',
catalogs_change_gravamen           = 'catalogs.change_gravamen',
catalogs_delete_gravamen           = 'catalogs.delete_gravamen',

catalogs_view_situacionlegal       = 'catalogs.view_situacionlegal',
catalogs_add_situacionlegal        = 'catalogs.add_situacionlegal',
catalogs_change_situacionlegal     = 'catalogs.change_situacionlegal',
catalogs_delete_situacionlegal     = 'catalogs.delete_situacionlegal',

// Catálogos de Calidad
catalogs_view_calidadconstruccion   = 'catalogs.view_calidadconstruccion',
catalogs_add_calidadconstruccion    = 'catalogs.add_calidadconstruccion',
catalogs_change_calidadconstruccion = 'catalogs.change_calidadconstruccion',
catalogs_delete_calidadconstruccion = 'catalogs.delete_calidadconstruccion',

catalogs_view_estadoconservacion    = 'catalogs.view_estadoconservacion',
catalogs_add_estadoconservacion     = 'catalogs.add_estadoconservacion',
catalogs_change_estadoconservacion  = 'catalogs.change_estadoconservacion',
catalogs_delete_estadoconservacion  = 'catalogs.delete_estadoconservacion',

catalogs_view_tipoacabado           = 'catalogs.view_tipoacabado',
catalogs_add_tipoacabado            = 'catalogs.add_tipoacabado',
catalogs_change_tipoacabado         = 'catalogs.change_tipoacabado',
catalogs_delete_tipoacabado         = 'catalogs.delete_tipoacabado',

catalogs_view_mantenimiento         = 'catalogs.view_mantenimiento',
catalogs_add_mantenimiento          = 'catalogs.add_mantenimiento',
catalogs_change_mantenimiento       = 'catalogs.change_mantenimiento',
catalogs_delete_mantenimiento       = 'catalogs.delete_mantenimiento',

catalogs_view_equipamiento          = 'catalogs.view_equipamiento',
catalogs_add_equipamiento           = 'catalogs.add_equipamiento',
catalogs_change_equipamiento        = 'catalogs.change_equipamiento',
catalogs_delete_equipamiento        = 'catalogs.delete_equipamiento',

// Sepomex
sepomex_view_estado = 'sepomex.view_estado',
sepomex_view_municipio = 'sepomex.view_municipio',
sepomex_view_asentamiento = 'sepomex.view_asentamiento',
sepomex_view_cargasepomex = 'sepomex.view_cargasepomex',
sepomex_add_cargasepomex = 'sepomex.add_cargasepomex',

// Contacto
contacto_view_contactoconfig = 'contacto.view_contactoconfig',
contacto_add_contactoconfig = 'contacto.add_contactoconfig',
contacto_change_contactoconfig = 'contacto.change_contactoconfig',

// Casos de Éxito
casos_exito_view_casoexito = 'casos_exito.view_casoexito',
casos_exito_add_casoexito = 'casos_exito.add_casoexito',
casos_exito_change_casoexito = 'casos_exito.change_casoexito',
casos_exito_delete_casoexito = 'casos_exito.delete_casoexito',

// Testimonials
testimonials_view_testimonio = 'testimonials.view_testimonio',
testimonials_add_testimonio = 'testimonials.add_testimonio',
testimonials_change_testimonio = 'testimonials.change_testimonio',
testimonials_delete_testimonio = 'testimonials.delete_testimonio',

// Users
users_view_user = 'users.view_user',
users_add_user = 'users.add_user',
users_change_user = 'users.change_user',
users_delete_user = 'users.delete_user',

// Auth (ordenado por el último valor)
auth_add_group = 'auth.add_group',
auth_change_group = 'auth.change_group',
auth_delete_group = 'auth.delete_group',
auth_view_group = 'auth.view_group',

auth_add_permission = 'auth.add_permission',
auth_change_permission = 'auth.change_permission',
auth_delete_permission = 'auth.delete_permission',
auth_view_permission = 'auth.view_permission',

// Content Types (ordenado por el último valor)
contenttypes_add_contenttype = 'contenttypes.add_contenttype',
contenttypes_change_contenttype = 'contenttypes.change_contenttype',
contenttypes_delete_contenttype = 'contenttypes.delete_contenttype',
contenttypes_view_contenttype = 'contenttypes.view_contenttype',

// Token Blacklist (ordenado por el último valor)
token_blacklist_add_blacklistedtoken = 'token_blacklist.add_blacklistedtoken',
token_blacklist_change_blacklistedtoken = 'token_blacklist.change_blacklistedtoken',
token_blacklist_delete_blacklistedtoken = 'token_blacklist.delete_blacklistedtoken',
token_blacklist_view_blacklistedtoken = 'token_blacklist.view_blacklistedtoken',

token_blacklist_add_outstandingtoken = 'token_blacklist.add_outstandingtoken',
token_blacklist_change_outstandingtoken = 'token_blacklist.change_outstandingtoken',
token_blacklist_delete_outstandingtoken = 'token_blacklist.delete_outstandingtoken',
token_blacklist_view_outstandingtoken = 'token_blacklist.view_outstandingtoken',

// Sessions (ordenado por el último valor)
sessions_add_session = 'sessions.add_session',
sessions_change_session = 'sessions.change_session',
sessions_delete_session = 'sessions.delete_session',
sessions_view_session = 'sessions.view_session',

// Admin (ordenado por el último valor)
admin_add_logentry = 'admin.add_logentry',
admin_change_logentry = 'admin.change_logentry',
admin_delete_logentry = 'admin.delete_logentry',
admin_view_logentry = 'admin.view_logentry',
  
}
