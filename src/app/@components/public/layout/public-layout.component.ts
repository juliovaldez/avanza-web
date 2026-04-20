import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeaderComponent } from '../header/header-public.component';
import { PublicFooterComponent } from '../footer/footer-public.component';
import { PublicFooterBottomComponent } from '../footer-bottom/footer-bottom.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, PublicHeaderComponent, PublicFooterComponent, PublicFooterBottomComponent],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss'],
})
export class PublicLayoutComponent {}
