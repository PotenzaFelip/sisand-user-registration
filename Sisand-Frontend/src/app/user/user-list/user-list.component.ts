import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService, UserFilter } from '../../core/services/user.service'; 
import { User } from '../../core/models/user.model'; 

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  
  searchForm!: FormGroup;
  users: User[] = [];
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      username: [''],
    });
    
    this.searchUsers(); 
  }

  searchUsers(): void {
    const filters: UserFilter = this.searchForm.value;

    this.userService.search(filters).subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Erro ao buscar usuários:', err);
      }
    });
  }

  editUser(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  deleteUser(id: number): void {
    if (confirm(`Tem certeza que deseja deletar o usuário ID ${id}?`)) {
      
      this.userService.delete(id).subscribe({
        next: () => {
          console.log(`Usuário ID ${id} deletado com sucesso.`);
          this.searchUsers(); 
        },
        error: (err) => {
          console.error('Erro ao deletar usuário:', err);
          alert('Não foi possível deletar o usuário.');
        }
      });
    }
  }
}