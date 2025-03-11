import { BaseModel } from "./BaseModels";

export interface IKit {
  id?: number;
  material_id?: number;
  barcode?: string;
  qty_per_code?: string;
  unit?: number;
}

export class Kit extends BaseModel implements IKit {
  material_id?: number;
  barcode?: string;
  qty_per_code?: string;
  unit?: number;

  constructor(data: IKit = {}) {
    super();
    Object.assign(this, data);
  }
}
