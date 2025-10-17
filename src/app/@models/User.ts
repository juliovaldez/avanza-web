import { BaseModel } from "./BaseModels";
import { SaleProfile } from "./SaleProfile";
export interface IUser {
  id?: number;
  sale_profile?: SaleProfile;
  username?: string;
  name?: string;
  last_name?: string;
  is_superuser?: boolean;
  groups?: string[];
  permissions?: string[];
}

export class User extends BaseModel {
  sale_profile?: SaleProfile;
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
}
