import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

// Definição da interface do payload de criação/edição (inclui senha opcional)
export interface UserPayload {
  id?: number;
  username: string;
  password?: string; // Opcional na edição
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Simulação do nosso banco de dados
  private users: User[] = [
    { id: 1, username: 'admin', isAdmin: true },
    { id: 2, username: 'joao', isAdmin: false },
  ];
  private nextId = 3;

  getAll(): Observable<User[]> {
    return of(this.users.map(u => ({...u}))); // Retorna uma cópia para evitar alteração direta
  }

  // --- CREATE ---
  create(payload: UserPayload): Observable<User> {
    const newUser: User = {
      id: this.nextId++,
      username: payload.username,
      isAdmin: payload.isAdmin,
      // Nota: A senha (password) não é armazenada na interface 'User' de front-end
    };
    this.users.push(newUser);
    return of(newUser);
  }

  // --- UPDATE ---
  update(id: number, payload: UserPayload): Observable<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index > -1) {
      const updatedUser: User = {
        ...this.users[index],
        username: payload.username,
        isAdmin: payload.isAdmin,
        // Senha não é atualizada aqui, seria feita em um endpoint separado no backend
      };
      this.users[index] = updatedUser;
      return of(updatedUser);
    }
    throw new Error('Usuário não encontrado');
  }

  // --- DELETE ---
  delete(id: number): Observable<void> {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);

    if (this.users.length === initialLength) {
      // throw new Error('Usuário não encontrado para exclusão'); // Em um ambiente real
    }
    return of(undefined);
  }
}