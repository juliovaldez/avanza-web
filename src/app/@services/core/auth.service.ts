import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import DataSource from "devextreme/data/data_source";
import { User } from "@models/User";
import { catchError, Observable, of, switchMap } from "rxjs";
import { LocalstorageService } from "./";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private AuthUser: User | null = null;
  private headers = new HttpHeaders({
    "x-Show-Loading": "true",
  });
  get loggedIn(): boolean {
    return !!this.AuthUser;
  }
  constructor(
    private http: HttpClient,
    private localStorage: LocalstorageService
  ) {
    console.log("Service Auth Started");
  }
  login(credentials: any) {
    return this.http.post<any>(`/auth/token/`, credentials, {
      headers: this.headers,
    });
  }

  // ── Google OAuth 2.0 ────────────────────────────────────────────────────────

  /**
   * Construye la URL de autorización de Google.
   * Genera un `state` aleatorio para protección CSRF y lo guarda en sessionStorage.
   */
  buildGoogleAuthUrl(): string {
    const state = crypto.randomUUID();
    sessionStorage.setItem("google_oauth_state", state);

    const params = new URLSearchParams({
      client_id:     environment.googleClientId,
      redirect_uri:  environment.googleRedirectUri,
      response_type: "code",
      scope:         "openid email profile",
      access_type:   "online",
      prompt:        "select_account",
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Envía el authorization code al backend para obtener un SlidingToken.
   * El backend intercambia el código usando el client_secret (nunca expuesto aquí).
   */
  googleLogin(code: string): Observable<any> {
    return this.http.post<any>(
      `/auth/google/`,
      { code, redirect_uri: environment.googleRedirectUri },
      { headers: this.headers },
    );
  }

  /**
   * Verifica que el `state` devuelto por Google coincida con el generado localmente.
   */
  verifyGoogleState(state: string): boolean {
    const saved = sessionStorage.getItem("google_oauth_state");
    sessionStorage.removeItem("google_oauth_state");
    return !!saved && saved === state;
  }
  private getAuthUserInfo(): Observable<any> {
    return this.http.get<any>(`/user/authenticated/`, {
      headers: this.headers,
    });
  }
  logout() {
    return this.http.post<any>(`/auth/logout/`, {
      headers: this.headers,
    });
  }

  resetPassword(form: any) {
    return this.http.post<any>(`/auth/reset_password/`, form, {
      headers: this.headers,
    });
  }

  setPassword(form: any) {
    return this.http.post<any>(`/auth/set_password/`, form, {
      headers: this.headers,
    });
  }

  destroySession() {
    this.AuthUser = null;
    this.localStorage.revokeToken();
  }
  setAuthUser(User: User) {
    this.AuthUser = User;
  }

  getAuthUser(): User | null {
    return this.AuthUser;
  }
  authenticated(): Observable<boolean> {
    if (this.localStorage.getToken()) {
      return this.getAuthUserInfo().pipe(
        switchMap((response) => {
          console.log(response);
          this.setAuthUser(response.data);
          return of(true);
        }),
        catchError((error) => {
          console.log(error);
          this.localStorage.revokeToken();
          return of(false);
        })
      );
    }
    return of(false);
  }
  hasPermission(permission: string): boolean {
    return (
      this.AuthUser?.permissions?.includes(permission) ||
      !!this.AuthUser?.is_superuser
    );
  }
}
