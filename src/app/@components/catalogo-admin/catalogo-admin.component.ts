import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  DxDataGridModule,
  DxButtonModule,
} from 'devextreme-angular';
import { CatalogoService } from '@services/api';
import DataSource from 'devextreme/data/data_source';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-catalogo-admin',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './catalogo-admin.component.html',
  styleUrl:    './catalogo-admin.component.scss',
})
export class CatalogoAdminComponent implements OnInit, OnDestroy {
  private route          = inject(ActivatedRoute);
  private catalogoService = inject(CatalogoService);

  titulo     = '';
  subtitulo  = '';
  dataSource!: DataSource;

  private sub!: Subscription;

  ngOnInit(): void {
    // Cuando el usuario navega entre catálogos sin destruir el componente
    this.sub = this.route.data.subscribe((data) => {
      this.titulo    = data['titulo']    ?? 'Catálogo';
      this.subtitulo = data['subtitulo'] ?? '';
      this.dataSource = new DataSource({
        store: this.catalogoService.getStore(data['tipo']),
      });
    });
  }

  onToolbarPreparing(e: any): void {
    e.toolbarOptions.items.unshift({
      location: 'before',
      widget: 'dxButton',
      options: {
        icon: 'plus',
        text: 'Agregar',
        type: 'default',
        onClick: () => e.component.addRow(),
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
