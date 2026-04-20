import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactoService } from '@services/api';
import { ContactoConfig } from '@models/index';

@Component({
  selector: 'app-section-contacto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss',
  providers: [ContactoService],
})
export class ContactoSectionComponent implements OnInit {
  contacto: ContactoConfig | null = null;

  constructor(private contactoService: ContactoService) {}

  ngOnInit(): void {
    this.contactoService.getPublic().subscribe({
      next: (data) => (this.contacto = data),
      error: () => (this.contacto = null),
    });
  }
}
