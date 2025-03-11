import { Injectable } from '@angular/core';
import { Subject, Observable, fromEvent, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  public SpinnerState = new BehaviorSubject<number>(0);
  constructor() {}
  Activate() {
    this.SpinnerState.next(this.SpinnerState.value + 1);
  }
  Desactivate() {
    this.SpinnerState.next(this.SpinnerState.value - 1);
  }
}
