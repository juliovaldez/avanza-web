export class Testimonio {
  id: number;
  nombre_completo: string;
  ciudad: string;
  estado: string;
  descripcion: string;
  fotografia: string;
  created_at: string;
  updated_at: string;

  constructor(data: any) {
    this.id = data.id ?? 0;
    this.nombre_completo = data.nombre_completo ?? '';
    this.ciudad = data.ciudad ?? '';
    this.estado = data.estado ?? '';
    this.descripcion = data.descripcion ?? '';
    this.fotografia = data.fotografia ?? '';
    this.created_at = data.created_at ?? '';
    this.updated_at = data.updated_at ?? '';
  }
}
