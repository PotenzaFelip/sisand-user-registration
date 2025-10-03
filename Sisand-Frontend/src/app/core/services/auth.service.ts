import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root' // Torna o serviço um Singleton disponível em toda a aplicação
})
export class AuthService {
  // Propriedade interna para rastrear o estado de autenticação (simulação)
  private isAuthenticated = false;

  constructor() {
    // Você pode adicionar código aqui para checar o localStorage na inicialização
    // const token = localStorage.getItem('auth_token');
    // this.isAuthenticated = !!token;
  }

  /**
   * Tenta fazer o login com as credenciais fornecidas.
   * Em um projeto real, faria uma chamada HTTP POST para a API.
   */
  login(username: string, password: string): Observable<boolean> {
    // --- SIMULAÇÃO DE VALIDAÇÃO ---
    if (username === 'admin' && password === '123') {
      this.isAuthenticated = true;
      // Em um projeto real, você armazenaria o JWT aqui:
      // localStorage.setItem('auth_token', 'seu-token-jwt-aqui');
      return of(true); // Retorna Observable<true> para sucesso
    }

    this.isAuthenticated = false;
    return of(false); // Retorna Observable<false> para falha
  }

  /**
   * Verifica se o usuário está autenticado. Usado pelo AuthGuard.
   */
  isLoggedIn(): boolean {
    // Em um projeto real, checaria se o token existe e não expirou
    // return !!localStorage.getItem('auth_token');
    return this.isAuthenticated;
  }

  /**
   * Encerra a sessão do usuário.
   */
  logout(): void {
    this.isAuthenticated = false;
    // Em um projeto real: localStorage.removeItem('auth_token');
    
    // NOTA: O redirecionamento para /login será feito pelo componente
    // (UserListComponent ou um componente de NavBar) que chama este método.
  }
}