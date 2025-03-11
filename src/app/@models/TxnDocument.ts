import { BaseModel } from "./BaseModels";
import { Transaction } from "./Transaction";

export interface ITxnDocument {
  id?: number;
  transaction_type?: number;
  txn_start_date?: Date;
  txn_end_date?: Date;
  from_user?: number;
  from_user_location?: number;
  to_user?: number;
  to_user_location?: number;
  folio_number?: string;
  reference_number?: string;
  comments?: string;
  transactions?: Transaction[];
}

export class TxnDocument extends BaseModel implements ITxnDocument {
  transaction_type?: number;
  txn_start_date?: Date;
  txn_end_date?: Date;
  from_user?: number;
  from_user_location?: number;
  to_user?: number;
  to_user_location?: number;
  folio_number?: string;
  reference_number?: string;
  transactions?: Transaction[];


  constructor(data: ITxnDocument = {}) {
    super();
    Object.assign(this, data);
  }
}
