import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, PERMISSIONS, EventBusService, EventTypes } from '@services/core';
import { Testimonio, GridConf } from '@models/index';
import { TestimonioService } from '@services/api';
import {
  DxDataGridModule,
  DxAccordionModule,
  DxDataGridComponent,
} from 'devextreme-angular';
import { Subscription } from 'rxjs';
import { FormTestimonioComponent } from '../form-testimonio/form-testimonio.component';

@Component({
  selector: 'app-list-testimonios',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxAccordionModule, FormTestimonioComponent],
  templateUrl: './list-testimonios.component.html',
})
export class ListTestimoniosComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent | undefined;

  public selectedTestimonio: Testimonio = new Testimonio({});
  public showForm = false;
  public view_testimonio = false;
  public add_testimonio = false;
  public change_testimonio = false;
  public delete_testimonio = false;
  public dataGridConf: GridConf = new GridConf();

  private authService = inject(AuthService);
  private testimonioService = inject(TestimonioService);
  private eventBusService = inject(EventBusService);

  constructor() {
    this.initPermissions();
    this.initDataGrid();
    this.dataGridConf.dataSource = this.testimonioService.getStore();
    this.subscribeEvents();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  initPermissions(): void {
    this.view_testimonio = this.authService.hasPermission(PERMISSIONS.testimonials_view_testimonio);
    this.add_testimonio = this.authService.hasPermission(PERMISSIONS.testimonials_add_testimonio);
    this.change_testimonio = this.authService.hasPermission(PERMISSIONS.testimonials_change_testimonio);
    this.delete_testimonio = this.authService.hasPermission(PERMISSIONS.testimonials_delete_testimonio);
  }

  initDataGrid(): void {
    this.dataGridConf.setData({
      columns: [
        { dataField: 'id', caption: 'ID', width: 60 },
        { dataField: 'nombre_completo', caption: 'Nombre' },
        { dataField: 'ciudad', caption: 'Ciudad' },
        { dataField: 'estado', caption: 'Estado' },
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
        allowUpdating: this.change_testimonio,
        allowDeleting: this.delete_testimonio,
        allowAdding: false,
        useIcons: true,
      },
    });
  }

  subscribeEvents(): void {
    this.subscriptions.push(
      this.eventBusService
        .on([EventTypes.testimonio_added, EventTypes.testimonio_updated])
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
          text: 'Nuevo Testimonio',
          visible: this.add_testimonio,
          onClick: () => this.openForm(new Testimonio({})),
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

  openForm(testimonio: Testimonio): void {
    this.selectedTestimonio = testimonio;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }
}
