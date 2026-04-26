export class Propiedad {
  id!: number;

  // General
  tipo_propiedad!: number | null;
  tipo_propiedad_nombre?: string;
  metros_terreno!: number | null;
  metros_construccion!: number | null;
  precio!: number | null;

  // Características
  habitaciones!: number | null;
  banos!: number | null;
  medio_bano!: number | null;
  niveles!: number | null;
  cochera!: number | null;
  antiguedad!: number | null;

  // Calidad
  calidad_construccion!: number | null;
  calidad_construccion_nombre?: string;
  estado_conservacion!: number | null;
  estado_conservacion_nombre?: string;
  tipo_acabado!: number | null;
  tipo_acabado_nombre?: string;
  mantenimiento!: number | null;
  equipamiento!: number[];
  equipamiento_nombres?: string[];

  // Documentación
  documento_propiedad!: number | null;
  documento_propiedad_nombre?: string;
  predial!: number | null;
  predial_nombre?: string;
  servicios_corriente!: number | null;
  servicios_corriente_nombre?: string;
  gravamen!: number | null;
  gravamen_nombre?: string;
  situacion_legal!: number | null;
  situacion_legal_nombre?: string;

  // Ubicación
  asentamiento!: number | null;
  asentamiento_cp?: string;
  asentamiento_colonia?: string;
  asentamiento_ciudad?: string;
  asentamiento_municipio_id?: number;
  asentamiento_municipio?: string;
  asentamiento_estado_id?: number;
  asentamiento_estado?: string;

  constructor(data: any = {}) {
    this.equipamiento = [];
    Object.assign(this, data);
  }
}
