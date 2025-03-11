import { Injectable } from '@angular/core';
import { filter, Subject } from 'rxjs';

export class DataBus {
  constructor(public event: EventTypes, public data: any) {
  }
}


@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private eventSubject = new Subject<DataBus>();

  constructor() { }

  emit(event: EventTypes, data: Object = {}) {
    this.eventSubject.next(new DataBus(event, data));
  }
  on(listen: Array<EventTypes> = []) {
    return this.eventSubject
      .asObservable()
      .pipe(filter((event) => listen.includes(event.event)));
  }
}

export enum EventTypes {
  // Events with data
  txn_document_selected = 'document_selected',
  user_selected = 'user_selected',
  drive_selected = 'drive_selected',

  // Only events
  user_added = 'user_added',
  user_updated = 'user_updated',
  user_deleted = 'user_deleted',
  group_added = 'group_added',
  group_updated = 'group_updated',
  group_deleted = 'group_deleted',
  unit_added = 'unit_added',
  unit_updated = 'unit_updated',
  unit_deleted = 'unit_deleted',
  status_added = 'status_added',
  status_updated = 'status_updated',
  status_deleted = 'status_deleted',
  material_added = 'material_added',
  material_updated = 'material_updated',
  material_deleted = 'material_deleted',
  unit_conversion_added = 'unit_conversion_added',
  unit_conversion_updated = 'unit_conversion_updated',
  unit_conversion_deleted = 'unit_conversion_deleted',
  transaction_type_added = 'transaction_type_added',
  transaction_type_updated = 'transaction_type_updated',
  transaction_type_deleted = 'transaction_type_deleted',
  txn_document_added = 'txn_document_added',
  txn_document_updated = 'txn_document_updated',
  txn_document_deleted = 'txn_document_deleted',
  transaction_added = 'transaction_added',
  transaction_updated = 'transaction_updated',
  transaction_deleted = 'transaction_deleted',
  kit_added = 'kit_added',
  kit_updated = 'kit_updated',
  kit_deleted = 'kit_deleted',


}
