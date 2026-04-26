import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService, LocalstorageService } from "@services/core";

/**
 * Maneja el redirect de Google tras la autenticación.
 * URL esperada: /auth/google/callback?code=XXX&state=YYY
 *
 * Flujo:
 *  1. Extrae `code` y `state` de los query params.
 *  2. Verifica que `state` coincida con el guardado (protección CSRF).
 *  3. Envía el `code` al backend para obtener el SlidingToken.
 *  4. Guarda el token y redirige a /home.
 */
@Component({
  selector: "app-google-callback",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="google-callback">
      <div class="google-callback__spinner">
        <div class="spinner"></div>
        <p *ngIf="!error">Iniciando sesión con Google...</p>
        <p *ngIf="error" class="google-callback__error">
          {{ error }}
          <br />
          <a href="/login-form">Volver al login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .google-callback {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #f5f5f5;
    }
    .google-callback__spinner {
      text-align: center;
      font-family: sans-serif;
      color: #555;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 5px solid #ddd;
      border-top-color: #4285f4;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .google-callback__error { color: #c62828; }
    a { color: #4285f4; }
  `],
})
export class GoogleCallbackComponent implements OnInit {
  error = "";

  constructor(
    private route:         ActivatedRoute,
    private router:        Router,
    private authService:   AuthService,
    private localStorage:  LocalstorageService,
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const code   = params.get("code");
    const state  = params.get("state");
    const errorParam = params.get("error");

    // El usuario canceló en la pantalla de Google
    if (errorParam) {
      this.router.navigate(["/login-form"]);
      return;
    }

    if (!code || !state) {
      this.error = "Parámetros de autenticación inválidos.";
      return;
    }

    // Verificar state (protección CSRF)
    if (!this.authService.verifyGoogleState(state)) {
      this.error = "Error de seguridad: estado inválido. Intenta iniciar sesión de nuevo.";
      return;
    }

    // Intercambiar el code por un token a través del backend
    this.authService.googleLogin(code).subscribe({
      next: (response) => {
        this.localStorage.setToken(response.data.token);
        this.router.navigate(["/"]);
      },
      error: (err) => {
        const msg = err?.error?.detail || "Error al autenticar con Google.";
        this.error = msg;
      },
    });
  }
}
