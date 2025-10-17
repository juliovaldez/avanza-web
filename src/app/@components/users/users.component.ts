import { Component } from "@angular/core";
import { ListUsersComponent } from "@components/users/list-users/list-users.component";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [ListUsersComponent],
  template: `
    <div class="card-flex-box"><app-list-users></app-list-users></div>
  `,
})
export class UsersComponent {}
