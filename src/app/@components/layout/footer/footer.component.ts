import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `<footer><ng-content></ng-content></footer>`,
  standalone: true,
  imports: [],
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent {

}
