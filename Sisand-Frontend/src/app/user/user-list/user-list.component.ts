import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone:false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  userToDelete: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe(data => {
      this.users = data;
    });
  }

  // Prepara o formulário/modal para criar ou editar
  selectUser(user: User | null): void {
    this.selectedUser = user ? { ...user } : null; // Clonar para evitar alteração direta
    // Em uma estrutura de rotas, isso faria this.router.navigate(['/users/edit', user.id])
  }

  // Prepara o usuário para a exclusão
  selectUserToDelete(user: User): void {
    this.userToDelete = user;
  }

  // Ação de Excluir (Chamada do modal de Confirmação)
  deleteUser(): void {
    if (this.userToDelete) {
      // Chamar o método delete do UserService e recarregar a lista
      this.userService.delete(this.userToDelete.id).subscribe(() => {
        this.loadUsers(); // Recarrega a lista após a exclusão
        this.userToDelete = null; // Limpa
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}