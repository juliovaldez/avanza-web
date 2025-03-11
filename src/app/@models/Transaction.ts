import { BaseModel } from "./BaseModels";

export interface ITransaction {
  id?: number;
  parent?: number;
  status?: number;
  txn_document?: number;
  material?: number;
  serial_number?: string | null;
  transaction_quantity?: number;
  transaction_unit?: number;
  conversion_factor?: number;
  base_quantity?: number;
  base_unit?: number;
  available_quantity?: number;
}

export class Transaction extends BaseModel implements ITransaction {
  parent?: number;
  status?: number;
  txn_document?: number;
  material?: number;
  serial_number?: string | null;
  transaction_quantity?: number = 0;
  transaction_unit?: number;
  conversion_factor?: number;
  base_quantity?: number = 0;
  base_unit?: number;
  available_quantity?: number;

  /**Front */
  _available_total_by_user: number = 0;
  get available_total_by_user() {
    return this._available_total_by_user - this.base_quantity!;
  }
  constructor(data: ITransaction = {}) {
    super();
    Object.assign(this, data);
  }

  public calculateBaseQty() {
    try {
      this.base_quantity = this.available_quantity =
        this.transaction_quantity! * this.conversion_factor!;
    } catch (error) {
      this.base_quantity = 0;
    }
  }
}

