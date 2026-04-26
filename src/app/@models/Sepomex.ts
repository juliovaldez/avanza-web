export class Estado {
  id!: number;
  clave!: string;
  nombre!: string;
  constructor(data: any = {}) { Object.assign(this, data); }
}

export class Municipio {
  id!: number;
  clave!: string;
  nombre!: string;
  estado_id!: number;
  estado_nombre!: string;
  constructor(data: any = {}) { Object.assign(this, data); }
}

export class Asentamiento {
  id!: number;
  codigo_postal!: string;
  nombre!: string;
  tipo!: string;
  zona!: string;
  ciudad!: string;
  municipio_id!: number;
  municipio_nombre!: string;
  estado_nombre!: string;
  estado_clave!: string;
  constructor(data: any = {}) { Object.assign(this, data); }
}

export class CargaSepomex {
  id!: number;
  nombre_archivo!: string;
  fecha_carga!: string;
  estado_proceso!: 'pendiente' | 'procesando' | 'completado' | 'error';
  total_registros!: number;
  registros_procesados!: number;
  mensaje!: string;
  constructor(data: any = {}) { Object.assign(this, data); }

  get progreso(): number {
    if (!this.total_registros) return 0;
    return Math.round((this.registros_procesados / this.total_registros) * 100);
  }
}
