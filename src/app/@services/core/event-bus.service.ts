import { Injectable } from "@angular/core";
import { filter, Subject } from "rxjs";

export class DataBus {
  constructor(public event: EventTypes, public data: any) {}
}

@Injectable({
  providedIn: "root",
})
export class EventBusService {
  private eventSubject = new Subject<DataBus>();

  constructor() {}

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
  user_selected = "user_selected",
  // Only events
  user_added = "user_added",
  user_updated = "user_updated",
  user_deleted = "user_deleted",
  group_added = "group_added",
  group_updated = "group_updated",
  group_deleted = "group_deleted",
}
