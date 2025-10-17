import { Component, NgModule, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DxListModule } from "devextreme-angular/ui/list";
import { DxContextMenuModule } from "devextreme-angular/ui/context-menu";
import { IUser } from "@models/User";

@Component({
  selector: "app-user-panel",
  standalone: true,
  imports: [DxListModule, DxContextMenuModule, CommonModule],
  templateUrl: "user-panel.component.html",
  styleUrls: ["./user-panel.component.scss"],
})
export class UserPanelComponent {
  @Input()
  menuItems: any;

  @Input()
  menuMode!: string;

  @Input()
  user!: IUser | null;

  constructor() {}
}
