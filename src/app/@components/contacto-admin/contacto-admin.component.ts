import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactoConfig } from '@models/index';
import { ContactoService } from '@services/api';
import {
  DxFormModule,
  DxFormComponent,
  DxButtonModule,
  DxLoadIndicatorModule,
} from 'devextreme-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacto-admin',
  standalone: true,
  imports: [CommonModule, DxFormModule, DxButtonModule, DxLoadIndicatorModule],
  templateUrl: './contacto-admin.component.html',
  styleUrl: './contacto-admin.component.scss',
})
export class ContactoAdminComponent implements OnInit {
  @ViewChild(DxFormComponent) form!: DxFormComponent;

  public formData: Partial<ContactoConfig> = {};
  public loading = false;
  public saved = false;
  private recordId = 0;
  private subscriptions: Subscription[] = [];

  private contactoService = inject(ContactoService);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.subscriptions.push(
      this.contactoService.getAll().subscribe({
        next: (data) => {
          this.loading = false;
          if (data.length > 0) {
            this.recordId = data[0].id;
            this.formData = { ...data[0] };
          }
        },
        error: () => (this.loading = false),
      })
    );
  }

  save(): void {
    if (!this.form.instance.validate().isValid) return;
    this.loading = true;
    this.saved = false;

    const request$ = this.recordId
      ? this.contactoService.update(this.recordId, this.formData as ContactoConfig)
      : this.contactoService.create(this.formData as ContactoConfig);

    this.subscriptions.push(
      request$.subscribe({
        next: (result) => {
          this.loading = false;
          this.saved = true;
          this.recordId = result.id;
          setTimeout(() => (this.saved = false), 3000);
        },
        error: () => (this.loading = false),
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
