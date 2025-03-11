import { BaseModel } from "./BaseModels";

export interface ILocation {
  id?: number;
  name?: string;
  code?: string;
  users?: number[];
}

export class Location extends BaseModel implements ILocation {
  name?: string;
  users?: number[];
  code?: string;
  constructor(data: ILocation = {}) {
    super();
    Object.assign(this, data);
  }
}
