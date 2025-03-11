import { BaseModel } from "./BaseModels";

export interface ITransactionType {
  id?: number;
  name?: string;
}

export class TransactionType extends BaseModel implements ITransactionType {
  name?: string;
  static readonly IN = "IN";
  static readonly OUT = "OUT";
  static readonly DEL = "DEL";
  static readonly TRANSFER = "TRANSFER";

  constructor(data: ITransactionType = {}) {
    super();
    Object.assign(this, data);
  }
}
