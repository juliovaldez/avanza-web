import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxTabPanelModule,
  DxFileUploaderModule,
  DxButtonModule,
  DxLoadIndicatorModule,
  DxProgressBarModule,
  DxDataGridModule,
  DxSelectBoxModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import { SepomexCargaService, SepomexFetcherService } from '@services/api';
import { CargaSepomex, Estado, Municipio } from '@models/index';
import { Subscription, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-sepomex',
  standalone: true,
  imports: [
    CommonModule,
    DxTabPanelModule,
    DxFileUploaderModule,
    DxButtonModule,
    DxLoadIndicatorModule,
    DxProgressBarModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxTextBoxModule,
  ],
  templateUrl: './sepomex.component.html',
  styleUrl: './sepomex.component.scss',
})
export class SepomexComponent implements OnInit, OnDestroy {
  private cargaService = inject(SepomexCargaService);
  private fetcherService = inject(SepomexFetcherService);

  private subs: Subscription[] = [];

  // Upload panel
  archivoSeleccionado: File | null = null;
  uploading = false;
  ultimaCarga: CargaSepomex | null = null;

  // Explorer
  estados: Estado[] = [];
  municipios: Municipio[] = [];
  asentamientosDS: DataSource | null = null;

  estadoFiltro: number | null = null;
  municipioFiltro: number | null = null;
  cpFiltro = '';

  ngOnInit(): void {
    this.cargarUltimoEstado();
    this.cargarEstados();
    this.actualizarDS();
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  onFileSelected(e: any): void {
    this.archivoSeleccionado = e.value?.[0] ?? null;
  }

  subirArchivo(): void {
    if (!this.archivoSeleccionado) return;
    this.uploading = true;
    this.subs.push(
      this.cargaService.cargar(this.archivoSeleccionado).subscribe({
        next: (carga) => {
          this.ultimaCarga = carga;
          this.uploading = false;
          this.archivoSeleccionado = null;
          this.iniciarPolling();
        },
        error: () => (this.uploading = false),
      })
    );
  }

  cargarUltimoEstado(): void {
    this.subs.push(
      this.cargaService.ultimoEstado().subscribe({
        next: (carga) => {
          this.ultimaCarga = carga;
          if (carga?.estado_proceso === 'procesando') {
            this.iniciarPolling();
          }
        },
      })
    );
  }

  iniciarPolling(): void {
    const poll$ = interval(3000).pipe(
      switchMap(() => this.cargaService.ultimoEstado()),
      takeWhile((c) => c?.estado_proceso === 'procesando', true)
    );
    this.subs.push(
      poll$.subscribe({
        next: (carga) => {
          this.ultimaCarga = carga;
          if (carga?.estado_proceso === 'completado') {
            this.cargarEstados();
            this.actualizarDS();
          }
        },
      })
    );
  }

  get estadoLabel(): string {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      procesando: 'Procesando...',
      completado: 'Completado',
      error: 'Error',
    };
    return this.ultimaCarga ? (labels[this.ultimaCarga.estado_proceso] ?? '') : '';
  }

  // ── Explorer ──────────────────────────────────────────────────────────────

  cargarEstados(): void {
    this.subs.push(
      this.fetcherService.getEstados().subscribe({
        next: (list) => (this.estados = list),
      })
    );
  }

  onEstadoChange(e: any): void {
    this.estadoFiltro = e.value ?? null;
    this.municipioFiltro = null;
    this.municipios = [];
    if (this.estadoFiltro) {
      this.subs.push(
        this.fetcherService.getMunicipios(this.estadoFiltro).subscribe({
          next: (list) => (this.municipios = list),
        })
      );
    }
    this.actualizarDS();
  }

  onMunicipioChange(e: any): void {
    this.municipioFiltro = e.value ?? null;
    this.actualizarDS();
  }

  onCpChange(e: any): void {
    this.cpFiltro = e.value ?? '';
    this.actualizarDS();
  }

  actualizarDS(): void {
    const storeConfig = this.fetcherService.getAsentamientosStore(
      this.estadoFiltro,
      this.municipioFiltro,
      this.cpFiltro
    );
    this.asentamientosDS = new DataSource({
      store: new CustomStore(storeConfig),
      pageSize: 20,
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
