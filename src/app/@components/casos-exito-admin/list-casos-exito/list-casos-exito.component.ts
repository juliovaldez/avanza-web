import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, PERMISSIONS, EventBusService, EventTypes } from '@services/core';
import { CasoExito, GridConf } from '@models/index';
import { CasoExitoService } from '@services/api';
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
} from 'devextreme-angular';
import { Subscription } from 'rxjs';
import { FormCasoExitoComponent } from '../form-caso-exito/form-caso-exito.component';

@Component({
  selector: 'app-list-casos-exito',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, FormCasoExitoComponent],
  templateUrl: './list-casos-exito.component.html',
})
export class ListCasosExitoComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;

  public selectedCaso: CasoExito = new CasoExito({});
  public showForm = false;
  public view_caso = false;
  public add_caso = false;
  public change_caso = false;
  public delete_caso = false;
  public dataGridConf: GridConf = new GridConf();

  private authService = inject(AuthService);
  private casoExitoService = inject(CasoExitoService);
  private eventBusService = inject(EventBusService);

  constructor() {
    this.initPermissions();
    this.initDataGrid();
    this.dataGridConf.dataSource = this.casoExitoService.getStore();
    this.subscribeEvents();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  initPermissions(): void {
    this.view_caso = this.authService.hasPermission(PERMISSIONS.casos_exito_view_casoexito);
    this.add_caso = this.authService.hasPermission(PERMISSIONS.casos_exito_add_casoexito);
    this.change_caso = this.authService.hasPermission(PERMISSIONS.casos_exito_change_casoexito);
    this.delete_caso = this.authService.hasPermission(PERMISSIONS.casos_exito_delete_casoexito);
  }

  initDataGrid(): void {
    this.dataGridConf.setData({
      columns: [
        { dataField: 'id', caption: 'ID', width: 60 },
        { dataField: 'titulo', caption: 'Título' },
        { dataField: 'created_at', caption: 'Fecha', dataType: 'date' },
      ],
      buttons: [],
      paging: { pageSize: 10, pageIndex: 0 },
      pager: {
        visible: true,
        showPageSizeSelector: true,
        allowedPageSizes: [10, 25, 50],
      },
      searchPanel: { visible: true, placeholder: 'Buscar...' },
      headerFilter: { visible: true },
      editing: {
        mode: 'row',
        allowUpdating: this.change_caso,
        allowDeleting: this.delete_caso,
        allowAdding: false,
        useIcons: true,
      },
    });
  }

  subscribeEvents(): void {
    this.subscriptions.push(
      this.eventBusService
        .on([EventTypes.caso_exito_added, EventTypes.caso_exito_updated])
        .subscribe(() => {
          this.dataGrid?.instance.getDataSource()?.reload();
          this.showForm = false;
        })
    );
  }

  onToolbarPreparing(e: any): void {
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          text: 'Nuevo Caso de Éxito',
          visible: this.add_caso,
          onClick: () => this.openForm(new CasoExito({})),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          onClick: () => this.dataGrid?.instance.getDataSource()?.reload(),
        },
      }
    );
  }

  onEditingStart(e: any): void {
    e.cancel = true;
    this.openForm(e.data);
  }

  openForm(caso: CasoExito): void {
    this.selectedCaso = caso;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }
}
