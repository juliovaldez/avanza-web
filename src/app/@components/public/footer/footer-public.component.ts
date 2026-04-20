import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactoService } from '@services/api';
import { ContactoConfig } from '@models/index';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer-public.component.html',
  styleUrls: ['./footer-public.component.scss'],
  providers: [ContactoService],
})
export class PublicFooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  contacto: ContactoConfig | null = null;

  constructor(private contactoService: ContactoService) {}

  ngOnInit(): void {
    this.contactoService.getPublic().subscribe({
      next: (data) => (this.contacto = data),
      error: () => (this.contacto = null),
    });
  }
}
