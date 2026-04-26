import { BaseModel } from "./BaseModels";
export interface IUser {
  id?: number;
  username?: string;
  name?: string;
  last_name?: string;
  is_superuser?: boolean;
  groups?: string[];
  permissions?: string[];
}

export class User extends BaseModel implements IUser {
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
