import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface UserFilter {
  username?: string;
}

// ATUALIZAÇÃO: UserPayload agora inclui todos os campos 
// de perfil e endereço necessários para a criação/edição.
export interface UserPayload {
  username: string;
  email: string;
  password?: string;

  // Dados Pessoais
  name: string; // Campo obrigatório
  phone?: string;
  cpf?: string;
  dateOfBirth?: Date | string; // Permite string para o input[type=date]

  // Endereço
  cep?: string;
  address?: string;
  city?: string;
  state?: string;

  // Acesso
  isAdmin?: boolean;
  status?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_API_URL = `${environment.apiUrl}/Users`;

  constructor(private http: HttpClient) { }

  search(filters: UserFilter): Observable<User[]> {
    const username = filters.username;

    if (username) {
      return this.http.get<User>(`${this.USER_API_URL}/By/${username}`).pipe(
        map(user => user ? [user] : []),
        catchError(error => {
          if (error.status === 404) {
            console.log(`Usuário '${username}' não encontrado.`);
            return of([]);
          }
          console.error('Erro ao buscar usuário no backend:', error);
          return throwError(() => new Error('Falha na comunicação com o servidor.'));
        })
      );
    } else {
      return this.http.get<User[]>(this.USER_API_URL).pipe(
        catchError(error => {
          console.error('Erro ao listar todos os usuários:', error);
          return throwError(() => new Error('Falha na listagem de usuários.'));
        })
      );
    }
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.USER_API_URL}/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao buscar usuário ${id}:`, error);
        return throwError(() => new Error(`Usuário ${id} não encontrado.`));
      })
    );
  }

  create(payload: UserPayload): Observable<User> {
    return this.http.post<User>(this.USER_API_URL, payload).pipe(
      catchError(error => {
        console.error('Erro ao criar usuário:', error);
        return throwError(() => new Error('Falha ao tentar criar novo usuário.'));
      })
    );
  }

  update(id: number, payload: UserPayload): Observable<User> {
    return this.http.put<User>(`${this.USER_API_URL}/${id}`, payload).pipe(
      catchError(error => {
        console.error(`Erro ao atualizar usuário ${id}:`, error);
        return throwError(() => new Error('Falha ao tentar atualizar o usuário.'));
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.USER_API_URL}/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao deletar usuário ${id}:`, error);
        return throwError(() => new Error('Falha ao tentar deletar o usuário.'));
      })
    );
  }
}
