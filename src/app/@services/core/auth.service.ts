import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import DataSource from "devextreme/data/data_source";
import { User } from "@models/User";
import { catchError, Observable, of, switchMap } from "rxjs";
import { LocalstorageService } from "./";

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
