export class Catalogo {
  id!: number;
  nombre!: string;
  orden!: number;
  activo!: boolean;
  constructor(data: any = {}) { Object.assign(this, data); }
}
