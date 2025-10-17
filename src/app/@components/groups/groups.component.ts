import { Component } from "@angular/core";
import { ListGroupsComponent } from "@components/groups/list-groups/list-groups.component";
import { ListPermissionsComponent } from "@components/permissions/list-permissions/list-permissions.component";
import { DxAccordionModule } from "devextreme-angular";

@Component({
  selector: "app-groups",
  standalone: true,
  imports: [ListGroupsComponent, DxAccordionModule],
  template: `
    <dx-accordion
      #accordion
      [dataSource]="['Grupos y Permisos']"
      [selectedItems]="['Grupos y Permisos']"
    >
      <div *dxTemplate="let tab of 'title'">
        <div class="header">{{ tab }}</div>
      </div>
      <div *dxTemplate="let tab of 'item'">
        <app-list-groups
          style="display:flex;flex-wrap: wrap;justify-content:center"
        ></app-list-groups>
      </div>
    </dx-accordion>
  `,
})
export class GroupsComponent {}
