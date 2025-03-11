import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor() {}
  setToken(Token: string) {
    localStorage.setItem('token', Token);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  revokeToken() {
    return localStorage.removeItem('token');
  }
}
