import { CommonModule } from "@angular/common";
import { Component, NgModule } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { DxFormModule } from "devextreme-angular/ui/form";
import { DxLoadIndicatorModule } from "devextreme-angular/ui/load-indicator";
import {
  AuthService,
  LocalstorageService,
  SpinnerService,
} from "@services/core";
import { DxButtonModule } from "devextreme-angular";

@Component({
  selector: "app-login-form",
  standalone: true,
  imports: [CommonModule, RouterModule, DxFormModule, DxLoadIndicatorModule, DxButtonModule],
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent {
  formData: any = {};
  constructor(
    private authService: AuthService,
    private router: Router,
    private localstorageService: LocalstorageService,
    private spinnerService: SpinnerService
  ) {}

  async onSubmit(e: Event) {
    e.preventDefault();
    this.authService.login(this.formData).subscribe({
      next: (response) => {
        this.localstorageService.setToken(response.token);
        this.router.navigate(["/"]);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onCreateAccountClick = () => {
    this.router.navigate(["/create-account"]);
  };

  loginWithGoogle(): void {
    // Redirige al usuario a Google — el backend nunca es llamado aquí
    window.location.href = this.authService.buildGoogleAuthUrl();
  }
}
