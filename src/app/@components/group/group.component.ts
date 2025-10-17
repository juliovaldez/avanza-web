import { Component } from '@angular/core';
import { GroupListComponent } from '@components/group/group-list/group-list.component';
import { DxAccordionModule, } from 'devextreme-angular';
@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    GroupListComponent,
    DxAccordionModule,
  ],
  template: `
        <app-group-list style="display:flex;flex-wrap: wrap;justify-content:center"></app-group-list>
  `,
})
export class GroupComponent { }
