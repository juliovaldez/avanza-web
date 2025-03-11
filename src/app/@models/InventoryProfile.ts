import { BaseModel } from "./BaseModels";
export interface IInventoryProfile {
  id?: number;
  user?: number;
  location?: number;
  location_name?: string;
}

export class InventoryProfile extends BaseModel implements IInventoryProfile {
  user?: number;
  location?: number;
  location_name?: string;

  constructor(data: IInventoryProfile = {}) {
    super();
    Object.assign(this, data);
  }
}
