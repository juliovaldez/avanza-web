import { BaseModel } from "./BaseModels";

export interface IPermission {
  id?: number;
  name?: string;
  permissions?: string[];
}

export class Permission extends BaseModel implements IPermission {
  name?: string;

  constructor(data: IPermission = {}) {
    super();
    Object.assign(this, data);
  }
}
