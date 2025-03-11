import { Component } from "@angular/core";
import { DriverListComponent } from "@components/driver/driver-list/driver-list.component";
import { UserMaterialsComponent } from "@components/users/user-materials/user-materials.component";
import { ListTransactionsComponent } from "@components/transaction/list-transactions/list-transactions.component";
import { DxTabsComponent, DxTabPanelModule } from 'devextreme-angular';
import { DriverInstallationListComponent } from "@components/driver/driver-installation-list/driver-installation-list.component";

@Component({
  standalone: true,
  selector: "app-driver",
  imports: [DriverListComponent, DriverInstallationListComponent, DxTabPanelModule],
  template: `
    <div>
      <app-driver-list></app-driver-list>
      <app-driver-installation-list></app-driver-installation-list>
    </div>
  `,
})
export class DriverComponent {
}
