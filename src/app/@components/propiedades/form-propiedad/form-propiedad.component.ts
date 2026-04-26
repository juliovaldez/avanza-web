import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DxSelectBoxModule,
  DxTagBoxModule,
  DxNumberBoxModule,
  DxButtonModule,
  DxLoadIndicatorModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import { CatalogoService, PropiedadFetcherService, SepomexFetcherService } from '@services/api';
import { Propiedad } from '@models/index';
import DataSource from 'devextreme/data/data_source';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-propiedad',
  standalone: true,
  imports: [
    CommonModule,
    DxSelectBoxModule,
    DxTagBoxModule,
    DxNumberBoxModule,
    DxButtonModule,
    DxLoadIndicatorModule,
    DxTextBoxModule,
  ],
  templateUrl: './form-propiedad.component.html',
  styleUrl:    './form-propiedad.component.scss',
})
export class FormPropiedadComponent implements OnInit, OnDestroy {
  private route           = inject(ActivatedRoute);
  private router          = inject(Router);
  private catalogoService = inject(CatalogoService);
  private svc             = inject(PropiedadFetcherService);
  private sepomex         = inject(SepomexFetcherService);

  isEdit      = false;
  propiedadId: number | null = null;
  loading     = false;
  saving      = false;

  // Typed as any para compatibilidad con DxNumberBox que requiere number (no number|null)
  formData: any = new Propiedad();

  // DataSources para cada catálogo (cargado con isLoadingAll)
  tiposPropiedadDS!:     DataSource;
  calidadDS!:            DataSource;
  estadoConservacionDS!: DataSource;
  tipoAcabadoDS!:        DataSource;
  equipamientoDS!:       DataSource;
  documentoDS!:          DataSource;
  predialDS!:            DataSource;
  serviciosDS!:          DataSource;
  gravamenDS!:           DataSource;
  situacionLegalDS!:     DataSource;

  precioFormat = { type: 'currency', currency: 'MXN', precision: 0 };

  // ── Ubicación ──────────────────────────────────────────────────────────────
  private _sincronizando = false;

  cp                       = '';
  estados:    any[]        = [];
  municipios: any[]        = [];
  colonias:   any[]        = [];

  estadoIdSeleccionado:    number | null = null;
  municipioIdSeleccionado: number | null = null;

  estadosCargando    = false;
  municipiosCargando = false;
  coloniasCargando   = false;

  ciudadDisplay = '';

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.tiposPropiedadDS     = new DataSource({ store: this.catalogoService.getStore('tipo-propiedad') });
    this.calidadDS            = new DataSource({ store: this.catalogoService.getStore('calidad-construccion') });
    this.estadoConservacionDS = new DataSource({ store: this.catalogoService.getStore('estado-conservacion') });
    this.tipoAcabadoDS        = new DataSource({ store: this.catalogoService.getStore('tipo-acabado') });
    this.equipamientoDS       = new DataSource({ store: this.catalogoService.getStore('equipamiento') });
    this.documentoDS          = new DataSource({ store: this.catalogoService.getStore('documento-propiedad') });
    this.predialDS            = new DataSource({ store: this.catalogoService.getStore('predial') });
    this.serviciosDS          = new DataSource({ store: this.catalogoService.getStore('servicios-corriente') });
    this.gravamenDS           = new DataSource({ store: this.catalogoService.getStore('gravamen') });
    this.situacionLegalDS     = new DataSource({ store: this.catalogoService.getStore('situacion-legal') });

    // Cargar estados al iniciar
    this.estadosCargando = true;
    this.subs.push(
      this.sepomex.getEstados().subscribe({
        next: (e) => { this.estados = e; this.estadosCargando = false; },
        error: ()  => { this.estadosCargando = false; },
      })
    );

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit     = true;
      this.propiedadId = +id;
      this.cargarPropiedad();
    }
  }

  cargarPropiedad(): void {
    this.loading = true;
    this.subs.push(
      this.svc.getById(this.propiedadId!).subscribe({
        next: (p) => {
          this.formData = p;
          this.loading  = false;
          this.restaurarUbicacion(p);
        },
        error: () => { this.loading = false; },
      })
    );
  }

  // ── Ubicación: lógica de cascada ───────────────────────────────────────────

  /** Limpia todo lo que está debajo del nivel indicado */
  private limpiarDesde(nivel: 'estado' | 'municipio' | 'colonia'): void {
    if (nivel === 'estado') {
      this.municipioIdSeleccionado = null;
      this.municipios = [];
    }
    if (nivel === 'estado' || nivel === 'municipio') {
      this.colonias      = [];
      this.cp            = '';
    }
    this.ciudadDisplay         = '';
    this.formData.asentamiento = null;
  }

  onEstadoChange(id: number | null): void {
    if (this._sincronizando) return;
    this.limpiarDesde('estado');
    if (!id) return;
    this.municipiosCargando = true;
    this.subs.push(
      this.sepomex.getMunicipios(id).subscribe({
        next: (m) => { this.municipios = m; this.municipiosCargando = false; },
        error: ()  => { this.municipiosCargando = false; },
      })
    );
  }

  onMunicipioChange(id: number | null): void {
    if (this._sincronizando) return;
    this.limpiarDesde('municipio');
    if (!id) return;
    this.coloniasCargando = true;
    this.subs.push(
      this.sepomex.getAsentamientosByMunicipio(id).subscribe({
        next: (a) => { this.colonias = a; this.coloniasCargando = false; },
        error: ()  => { this.coloniasCargando = false; },
      })
    );
  }

  onCPChange(cp: string): void {
    if (this._sincronizando) return;
    this.limpiarDesde('colonia');
    this.colonias = [];
    if (cp?.length === 5) {
      this.coloniasCargando = true;
      this.subs.push(
        this.sepomex.getAsentamientosByCP(cp).subscribe({
          next: (lista) => { this.colonias = lista; this.coloniasCargando = false; },
          error: ()      => { this.coloniasCargando = false; },
        })
      );
    }
  }

  onColoniaChange(id: number | null): void {
    const a = this.colonias.find((c) => c.id === id);
    if (!a) {
      this.formData.asentamiento = null;
      this.ciudadDisplay         = '';
      return;
    }
    this.formData.asentamiento = a.id;
    this.ciudadDisplay         = a.ciudad || '';
    // Sincronizar estado y municipio sin disparar cascada
    this._sincronizando = true;
    this.cp                      = a.codigo_postal;
    this.estadoIdSeleccionado    = a.estado_id;
    this.municipioIdSeleccionado = a.municipio_id;
    this._sincronizando = false;
  }

  /** Restaura la ubicación completa al cargar una propiedad existente */
  private restaurarUbicacion(p: any): void {
    if (!p.asentamiento || !p.asentamiento_estado_id) return;
    this._sincronizando = true;
    this.cp                      = p.asentamiento_cp || '';
    this.estadoIdSeleccionado    = p.asentamiento_estado_id;
    this.municipioIdSeleccionado = p.asentamiento_municipio_id;
    this.ciudadDisplay           = p.asentamiento_ciudad || '';
    this._sincronizando = false;
    // Cargar municipios del estado guardado
    this.subs.push(
      this.sepomex.getMunicipios(p.asentamiento_estado_id).subscribe({
        next: (m) => { this.municipios = m; },
      })
    );
    // Cargar colonias del municipio guardado
    this.subs.push(
      this.sepomex.getAsentamientosByMunicipio(p.asentamiento_municipio_id).subscribe({
        next: (a) => { this.colonias = a; },
      })
    );
  }

  guardar(): void {
    this.saving = true;
    const req$ = this.isEdit
      ? this.svc.update(this.propiedadId!, this.formData)
      : this.svc.create(this.formData);

    this.subs.push(
      req$.subscribe({
        next: () => { this.saving = false; this.router.navigate(['/home/propiedades']); },
        error: ()  => { this.saving = false; },
      })
    );
  }

  cancelar(): void {
    this.router.navigate(['/home/propiedades']);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
