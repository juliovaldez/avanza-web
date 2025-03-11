import { BaseModel } from "./BaseModels";

export interface IStatus {
  id?: number;
  status_name?: string;
  module_name?: string;
}

export class Status extends BaseModel implements IStatus {
  status_name?: string;
  module_name?: string;
  static readonly STATUS_MATERIAL = "MATERIAL";
  static readonly STATUS_TRANSACTION = "TRANSACTION";
  constructor(data: IStatus = {}) {
    super();
    Object.assign(this, data);
  }
}
