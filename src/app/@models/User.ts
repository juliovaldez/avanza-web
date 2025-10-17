import { BaseModel } from "./BaseModels";
import { InventoryProfile } from "./InventoryProfile";
export interface IUser {
  id?: number;
  inventory_profile?: InventoryProfile;
  username?: string;
  name?: string;
  last_name?: string;
  is_superuser?: boolean;
  groups?: string[];
  permissions?: string[];
}

export class User extends BaseModel implements IUser {
  inventory_profile?: InventoryProfile;
  username?: string;
  name?: string;
  last_name?: string;
  is_superuser?: boolean;
  groups?: string[];
  permissions?: string[];

  constructor(data: IUser = {}) {
    super();
    Object.assign(this, data);
  }
  get username_location(): string {
    return `${this.username}   (${
      this.inventory_profile?.location_name || ""
    })`;
  }
}
