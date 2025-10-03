import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // 👈 Importe
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; // 👈 Ajuste o caminho conforme necessário
import { Credentials, AuthResponse } from '../models/credentials.model'; // 👈 Seus Models

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly LOGIN_URL = `${environment.apiUrl}/Auth/login`; // 👈 Rota do seu Backend

  constructor(
    private http: HttpClient, // 👈 Injeção do HttpClient
    private router: Router
  ) {}

  login(credentials: Credentials): Observable<AuthResponse> {
    // 1. Faz a requisição POST para o backend
    return this.http.post<AuthResponse>(this.LOGIN_URL, credentials).pipe(
      // 2. Se a resposta for um sucesso (código 200), salvamos o token
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    // Redireciona para a tela de login
    this.router.navigate(['/login']); 
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    // Em um projeto real, você verificaria se o token não expirou.
    return !!token; 
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}