import { Component } from '@angular/core';
import { UserListComponent } from '@components/user/user-list/user-list.component';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [UserListComponent],
  template: `
    <div class="card-flex-box"><app-user-list></app-user-list></div>
  `,
})
export class UserComponent { }
