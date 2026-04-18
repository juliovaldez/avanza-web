import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LazyComponent } from "@components/base";
import { inventory_profile } from "@components/widget.types";
import { User } from "@models/index";

@Component({
  selector: "app-inventory-profile",
  standalone: true,
  imports: [CommonModule],
  template: `<div>Inventory Profile</div>`,
})
export class InventoryProfileComponent implements LazyComponent<inventory_profile> {
  data: inventory_profile = { model: new User(), config: { onPopup: false } };
  inicializate(data: inventory_profile): void {
    this.data = data;
  }
  showOnPopup(): void {}
}
