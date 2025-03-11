export class MaterialByUser {
  material?: number;
  material_name?: string;
  serial_number?: string;
  base_unit?: number;
  total_base_quantity?: number;
  total_available_quantity?: number;

  constructor(data = {}) {
    Object.assign(this, data);
  }
  get id(): string {
    return `${this.material}_${this.serial_number}`;
  }
  get serial_or_name(): string {
    return `${this.serial_number || this.material_name} `;
  }
}
