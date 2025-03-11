import {
  Component,
  NgModule,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '@services/core';
import { IUser } from '@models/User';
import { UserPanelComponent } from '../user-panel/user-panel.component';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, DxButtonModule, UserPanelComponent, DxToolbarModule],
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title!: string;

  public user: IUser | null = null;

  userMenuItems = [
    {
      text: 'Profile',
      icon: 'user',
      onClick: () => {
        this.router.navigate(['/profile']);
      },
    },
    {
      text: 'Logout',
      icon: 'runner',
      onClick: () => {
        this.authService.logout().subscribe((data) => {
          this.authService.destroySession();
          this.router.navigate(['/login-form']);
        });
      },
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getAuthUser();
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  };
}
