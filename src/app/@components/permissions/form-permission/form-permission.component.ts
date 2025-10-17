import { Component } from "@angular/core";
import { Permission } from "@models/Permission";

import { LazyComponent } from "@components/base";
import { permission_form } from "@components/widget.types";

@Component({
  selector: "app-form-permission",
  standalone: true,
  imports: [],
  templateUrl: "./form-permission.component.html",
})
export class FormPermissionComponent implements LazyComponent<permission_form> {
  inicializate(data: permission_form): void {}
  showOnPopup(): void {}
}
