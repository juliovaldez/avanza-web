import { BaseModel } from "./BaseModels";

export interface IUnitConversion {
  id?: number;
  material?: number;
  from_unit?: number;
  to_unit?: number;
  conversion_factor?: number;
}

export class UnitConversion extends BaseModel implements IUnitConversion {
  material?: number;
  from_unit?: number;
  to_unit?: number;
  conversion_factor?: number;

  constructor(data: IUnitConversion = {}) {
    super();
    Object.assign(this, data);
  }

}
