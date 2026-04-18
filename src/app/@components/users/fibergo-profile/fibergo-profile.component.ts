import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LazyComponent } from "@components/base";
import { fibergo_profile } from "@components/widget.types";
import { Unit } from "@models/index";

@Component({
  selector: "app-fibergo-profile",
  standalone: true,
  imports: [CommonModule],
  template: `<div>FiberGo Profile</div>`,
})
export class FiberGoProfileComponent implements LazyComponent<fibergo_profile> {
  data: fibergo_profile = { model: new Unit(), config: { onPopup: false } };
  inicializate(data: fibergo_profile): void {
    this.data = data;
  }
  showOnPopup(): void {}
}
