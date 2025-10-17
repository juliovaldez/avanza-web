import { CommonModule } from "@angular/common";
import { Component, NgModule } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { DxFormModule } from "devextreme-angular/ui/form";
import { DxLoadIndicatorModule } from "devextreme-angular/ui/load-indicator";
import { AuthService } from "@services/core";

@Component({
  selector: "app-reset-password-form",
  standalone: true,
  imports: [CommonModule, RouterModule, DxFormModule, DxLoadIndicatorModule],
  templateUrl: "./reset-password-form.component.html",
  styleUrls: ["./reset-password-form.component.scss"],
})
export class ResetPasswordFormComponent {
  loading = false;
  formData: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit(e: Event) {
    e.preventDefault();
    this.authService.resetPassword(this.formData).subscribe();
  }
}
