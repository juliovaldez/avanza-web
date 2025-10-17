import { BaseModel } from "./BaseModels";
export interface ISaleProfile {
  id?: number;
  user?: number;
  location?: number;
  location_name?: string;
}

export class SaleProfile extends BaseModel implements ISaleProfile {
  user?: number;
  location?: number;
  location_name?: string;

  constructor(data: ISaleProfile = {}) {
    super();
    Object.assign(this, data);
  }
}
