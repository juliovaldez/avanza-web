import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ValidationCallbackData } from "devextreme-angular/common";
import { DxFormModule } from "devextreme-angular/ui/form";
import { AuthService } from "@services/core";
@Component({
  selector: "app-change-passsword-form",
  standalone: true,
  imports: [CommonModule, RouterModule, DxFormModule],
  templateUrl: "./change-password-form.component.html",
})
export class ChangePasswordFormComponent {
  formData: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.formData.token = params.get("recoveryCode") || "";
    });
  }
  async onSubmit(e: Event) {
    e.preventDefault();
    this.authService.setPassword(this.formData).subscribe({
      next: (response) => {
        this.router.navigate(["/login-form"]);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  confirmPassword = (e: ValidationCallbackData) => {
    return e.value === this.formData.pass1;
  };
}
