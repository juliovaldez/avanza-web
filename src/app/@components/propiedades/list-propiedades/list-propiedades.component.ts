import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';
import { PropiedadService, PropiedadFetcherService } from '@services/api';
import DataSource from 'devextreme/data/data_source';

@Component({
  selector: 'app-list-propiedades',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './list-propiedades.component.html',
  styleUrl:    './list-propiedades.component.scss',
})
export class ListPropiedadesComponent implements OnInit {
  private router    = inject(Router);
  private service   = inject(PropiedadService);
  private fetcher   = inject(PropiedadFetcherService);

  dataSource!: DataSource;
  precioFormat = { type: 'currency', precision: 0 };

  // Arrow functions para los botones de la columna acciones
  onEditar  = (e: any) => this.editar(e.row.data.id);
  onEliminar = (e: any) => this.eliminar(e.row.data.id);

  ngOnInit(): void {
    this.dataSource = new DataSource({
      store: this.service.getStore(),
    });
  }

  nueva(): void {
    this.router.navigate(['/home/propiedades/nueva']);
  }

  editar(id: number): void {
    this.router.navigate(['/home/propiedades', id, 'editar']);
  }

  async eliminar(id: number): Promise<void> {
    const ok = await confirm(
      '¿Deseas eliminar esta propiedad? Esta acción no se puede deshacer.',
      'Eliminar propiedad'
    );
    if (!ok) return;
    this.fetcher.delete(id).subscribe({
      next: () => this.dataSource.reload(),
    });
  }

  onToolbarPreparing(e: any): void {
    e.toolbarOptions.items.unshift({
      location: 'before',
      widget: 'dxButton',
      options: {
        icon: 'plus',
        text: 'Nueva Propiedad',
        type: 'default',
        stylingMode: 'contained',
        onClick: () => this.nueva(),
      },
    });
  }
}
