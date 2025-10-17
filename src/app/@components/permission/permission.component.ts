import { Component } from '@angular/core';
import { PermissionListComponent } from '@components/permission/permission-list/permission-list.component';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [PermissionListComponent],
  template: `
    <div class="card-flex-box">
      <app-permission-list></app-permission-list>
    </div>
  `,
})
export class PermissionComponent { }
