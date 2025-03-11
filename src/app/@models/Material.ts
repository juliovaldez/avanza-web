import { BaseModel } from "./BaseModels";

export interface IMaterial {
  id?: number;
  code?: number;
  name?: string;
  unit_base?: number;
  unit_weight?: number;
  description?: string;
  status?: number;
}

export class Material extends BaseModel implements IMaterial {
  code?: number;
  name?: string;
  unit_base?: number;
  unit_weight?: number;
  description?: string;

  constructor(data: IMaterial = {}) {
    super();
    Object.assign(this, data);
  }
}
