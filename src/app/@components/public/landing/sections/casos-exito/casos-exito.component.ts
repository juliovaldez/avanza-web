import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasoExitoFetcherService } from '@services/api';
import { CasoExito } from '@models/index';

@Component({
  selector: 'app-section-casos-exito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './casos-exito.component.html',
  styleUrl: './casos-exito.component.scss',
  providers: [CasoExitoFetcherService],
})
export class CasosExitoSectionComponent implements OnInit {
  casos: CasoExito[] = [];

  constructor(private casoFetcher: CasoExitoFetcherService) {}

  ngOnInit(): void {
    this.casoFetcher.getPublic().subscribe({
      next: (data) => (this.casos = data),
      error: () => (this.casos = []),
    });
  }
}
