import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment'; 
import { Credentials, AuthResponse } from '../models/credentials.model'; 

import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  [key: string]: any;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly LOGIN_URL = `${environment.apiUrl}/Auth/login`;
  
  private readonly USERNAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.LOGIN_URL, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']); 
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; 
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getDecodedUsername(): string | null {
    const token = this.getToken();

    if (token) {
      try {
        const decodedToken = jwtDecode(token) as JwtPayload;
        
        if (decodedToken[this.USERNAME_CLAIM]) {
             return decodedToken[this.USERNAME_CLAIM];
        }
        
        if (decodedToken.username) {
            return decodedToken.username;
        }

        console.warn('Claim de Username não encontrado no token decodificado:', decodedToken);
        return null;

      } catch (error) {
        console.error('Erro ao decodificar token. O token pode estar malformado.', error);
        return null;
      }
    }
    return null;
  }
}