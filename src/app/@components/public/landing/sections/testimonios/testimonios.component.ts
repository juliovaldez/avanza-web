import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonioFetcherService } from '@services/api';
import { Testimonio } from '@models/index';

@Component({
  selector: 'app-section-testimonios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonios.component.html',
  styleUrl: './testimonios.component.scss',
  providers: [TestimonioFetcherService],
})
export class TestimoniosSectionComponent implements OnInit {
  testimonios: Testimonio[] = [];

  constructor(private testimonioFetcher: TestimonioFetcherService) {}

  ngOnInit(): void {
    this.testimonioFetcher.getPublic().subscribe({
      next: (data) => (this.testimonios = data),
      error: () => (this.testimonios = []),
    });
  }
}
