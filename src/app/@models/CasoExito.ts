export class CasoExito {
  id: number;
  titulo: string;
  descripcion: string;
  fotografia: string;
  created_at: string;
  updated_at: string;

  constructor(data: any) {
    this.id = data.id ?? 0;
    this.titulo = data.titulo ?? '';
    this.descripcion = data.descripcion ?? '';
    this.fotografia = data.fotografia ?? '';
    this.created_at = data.created_at ?? '';
    this.updated_at = data.updated_at ?? '';
  }
}
