import { BaseModel } from "./BaseModels";

export interface IUnit {
  id?: number;
  name?: string;
  symbol?: string;
  value?: number;
}

export class Unit extends BaseModel implements IUnit {
  name?: string;
  symbol?: string;
  value?: number;

  constructor(data: IUnit = {}) {
    super();
    Object.assign(this, data);
  }
}
