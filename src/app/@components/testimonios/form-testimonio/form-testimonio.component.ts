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
import { Testimonio } from '@models/index';
import { TestimonioFetcherService } from '@services/api';
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
  selector: 'app-form-testimonio',
  standalone: true,
  imports: [CommonModule, DxPopupModule, DxButtonModule, DxFormModule, DxFileUploaderModule],
  templateUrl: './form-testimonio.component.html',
})
export class FormTestimonioComponent implements OnChanges, OnDestroy {
  @Input() testimonio: Testimonio = new Testimonio({});
  @Output() closed = new EventEmitter<void>();
  @ViewChild(DxFormComponent) form!: DxFormComponent;

  private subscriptions: Subscription[] = [];
  public formData: Partial<Testimonio> = {};
  public selectedFile: File | null = null;
  public isVisible = true;

  private testimonioFetcher = inject(TestimonioFetcherService);
  private eventBusService = inject(EventBusService);

  ngOnChanges(): void {
    this.formData = { ...this.testimonio };
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
    payload.append('nombre_completo', this.formData.nombre_completo ?? '');
    payload.append('ciudad', this.formData.ciudad ?? '');
    payload.append('estado', this.formData.estado ?? '');
    payload.append('descripcion', this.formData.descripcion ?? '');
    if (this.selectedFile) {
      payload.append('fotografia', this.selectedFile);
    }

    const isNew = !this.testimonio.id;
    const request$ = isNew
      ? this.testimonioFetcher.create(payload)
      : this.testimonioFetcher.update(this.testimonio.id, payload);

    this.subscriptions.push(
      request$.subscribe({
        next: () => {
          this.eventBusService.emit(
            isNew ? EventTypes.testimonio_added : EventTypes.testimonio_updated
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
