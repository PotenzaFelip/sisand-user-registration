import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { UserPayload } from '../../core/services/user.service';
import { User } from '../../core/models/user.model'; 
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean = false;
  userId: number | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initForm(); 
    
    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        this.userId = idParam ? +idParam : null;

        if (this.userId) {
          this.isEditMode = true;
          // Corrigindo a chamada do initForm para garantir que o isEditMode esteja correto
          this.initForm(); 
          return this.userService.getUserById(this.userId);
        } else {
          return of(null); 
        }
      })
    ).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.loadUser(user);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar usuário:', err);
        this.errorMessage = 'Não foi possível carregar os dados do usuário.';
      }
    });
  }


  initForm(): void {
    const passwordValidators = !this.isEditMode ? 
      [Validators.required, Validators.minLength(6)] : 
      []; 

    this.userForm = this.fb.group({
      // --- DADOS DE LOGIN ---
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', passwordValidators],
      
      // --- DADOS PESSOAIS (EXPANDIDO) ---
      name: ['', Validators.required], // << ESSENCIAL: Resolve o erro de NOT NULL
      phone: [''],
      cpf: [''],
      dateOfBirth: [''],
      
      // --- ENDEREÇO (EXPANDIDO) ---
      cep: [''],
      address: [''],
      city: [''],
      state: [''],
      
      // --- ADMIN/STATUS ---
      isAdmin: [false],
      status: [true] // Assumindo que status padrão é true
    });
  }

  loadUser(user: User): void {
    // Mapeando a data para o formato de input (YYYY-MM-DD)
    const dateOfBirthFormatted = user.dateOfBirth 
      ? new Date(user.dateOfBirth).toISOString().substring(0, 10) 
      : null;
      
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin || false,

      // NOVOS CAMPOS PREENCHIDOS PARA EDIÇÃO
      name: user.name,
      phone: user.phone,
      cpf: user.cpf,
      dateOfBirth: dateOfBirthFormatted,
      cep: user.cep,
      address: user.address,
      city: user.city,
      state: user.state,
      status: user.status
    });
  }


  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      return;
    }
    
    const payload = this.userForm.value as UserPayload;
    
    // Converte a data de volta para um objeto Date (ou string ISO)
    if (payload.dateOfBirth) {
        payload.dateOfBirth = new Date(payload.dateOfBirth);
    }
    
    if (this.isEditMode && this.userId !== null) {
      if (!payload.password) {
        delete payload.password;
      }
      
      this.userService.update(this.userId, payload).subscribe({
        next: () => {
          this.successMessage = 'Usuário atualizado com sucesso!';
          setTimeout(() => this.router.navigate(['/users']), 2000); 
        },
        error: (err) => {
          console.error('Erro na atualização:', err);
          this.errorMessage = `Falha ao atualizar usuário: ${err.message || 'Erro de servidor.'}`;
        }
      });
    } else {
      this.userService.create(payload).subscribe({
        next: () => {
          this.successMessage = 'Novo usuário criado com sucesso!';
          setTimeout(() => this.router.navigate(['/users']), 2000); 
        },
        error: (err) => {
          console.error('Erro na criação:', err);
          this.errorMessage = `Falha ao criar usuário: ${err.message || 'Erro de servidor.'}`;
        }
      });
    }
  }

  get f() { return this.userForm.controls; }
}
