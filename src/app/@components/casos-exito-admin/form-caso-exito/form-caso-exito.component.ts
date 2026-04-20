import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasoExito } from '@models/index';
import { CasoExitoFetcherService } from '@services/api';
import { EventBusService, EventTypes } from '@services/core';
import {
  DxPopupModule,
  DxButtonModule,
  DxFormModule,
  DxFormComponent,
  DxFileUploaderModule,
} from 'devextreme-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-caso-exito',
  standalone: true,
  imports: [CommonModule, DxPopupModule, DxButtonModule, DxFormModule, DxFileUploaderModule],
  templateUrl: './form-caso-exito.component.html',
})
export class FormCasoExitoComponent implements OnChanges, OnDestroy {
  @Input() caso: CasoExito = new CasoExito({});
  @Output() closed = new EventEmitter<void>();
  @ViewChild(DxFormComponent) form!: DxFormComponent;

  private subscriptions: Subscription[] = [];
  public formData: Partial<CasoExito> = {};
  public selectedFile: File | null = null;
  public isVisible = true;

  private casoFetcher = inject(CasoExitoFetcherService);
  private eventBusService = inject(EventBusService);

  ngOnChanges(): void {
    this.formData = { ...this.caso };
    this.selectedFile = null;
    this.isVisible = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onFileSelected(e: any): void {
    this.selectedFile = e.value?.[0] ?? null;
  }

  save(): void {
    if (!this.form.instance.validate().isValid) return;

    const payload = new FormData();
    payload.append('titulo', this.formData.titulo ?? '');
    payload.append('descripcion', this.formData.descripcion ?? '');
    if (this.selectedFile) {
      payload.append('fotografia', this.selectedFile);
    }

    const isNew = !this.caso.id;
    const request$ = isNew
      ? this.casoFetcher.create(payload)
      : this.casoFetcher.update(this.caso.id, payload);

    this.subscriptions.push(
      request$.subscribe({
        next: () => {
          this.eventBusService.emit(
            isNew ? EventTypes.caso_exito_added : EventTypes.caso_exito_updated
          );
          this.isVisible = false;
        },
        error: (err) => console.error(err),
      })
    );
  }

  onHidden(): void {
    this.closed.emit();
  }
}
