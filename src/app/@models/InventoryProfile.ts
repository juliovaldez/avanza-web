import { BaseModel } from "./BaseModels";
export class InventoryProfile extends BaseModel {
  location_name?: string;
  constructor(data: Partial<InventoryProfile> = {}) {
    super();
    Object.assign(this, data);
  }
}
