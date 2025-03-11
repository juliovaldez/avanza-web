import { Component } from '@angular/core';
import { ListPermissionsComponent } from '@components/permissions/list-permissions/list-permissions.component';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [ListPermissionsComponent],
  template: `
    <div class="card-flex-box">
      <app-list-permissions></app-list-permissions>
    </div>
  `,
})
export class PermissionsComponent {}
