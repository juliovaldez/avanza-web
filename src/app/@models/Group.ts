import { BaseModel } from "./BaseModels";
export interface IGroup {
  id?: number;
  name?: string;
  permissions: number[];
}

export class Group extends BaseModel implements IGroup {
  name?: string;
  permissions: number[] = [];

  public static readonly PROVEDOR = 2;
  public static readonly ALMACEN = 1;
  public static readonly TECNICO = 3;
  public static readonly CONSUMO = 4;
  constructor(data: IGroup = { permissions: [] }) {
    super();
    Object.assign(this, data);
  }
}
