import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { UserService, UserPayload } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

const dateLessThanTodayValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const dateValue = control.value;

  if (!dateValue) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  
  const selectedDate = new Date(dateValue);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate >= today) {
    return { dateMustBeInPast: true };
  }

  return null;
};

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html', 
  styleUrls: ['./user-form.component.css'] 
})
export class UserFormComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private userService = inject(UserService); 

  userForm!: FormGroup;
  isEditMode: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  private currentUserId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.currentUserId = idParam ? parseInt(idParam, 10) : null;
      this.isEditMode = !!this.currentUserId;
      
      this.initializeForm();

      if (this.isEditMode && this.currentUserId) {
        this.loadUser(this.currentUserId); 
      }
    });
  }

  private loadUser(userId: number): void {
    
    this.userService.getUserById(userId).pipe(first()).subscribe({
      next: (fetchedUser: User) => {
        
        if (fetchedUser.dateOfBirth && typeof fetchedUser.dateOfBirth === 'string') {
            fetchedUser.dateOfBirth = fetchedUser.dateOfBirth.substring(0, 10);
        }

        this.userForm.patchValue(fetchedUser);
      },
      error: (err) => {
        console.error(`Falha ao carregar usuário ${userId}:`, err);
        this.errorMessage = `Usuário não encontrado. Redirecionando...`;
        setTimeout(() => this.router.navigate(['/users']), 3000); 
      }
    });
  }

  private initializeForm(): void {
    const passwordValidators = this.isEditMode 
      ? [Validators.minLength(6)] 
      : [Validators.required, Validators.minLength(6)];

    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', passwordValidators],
      name: ['', [Validators.required]],
      cpf: [''],
      phone: [''],
      dateOfBirth: ['', [dateLessThanTodayValidator]], 
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      address: [''],
      city: [''],
      state: [''],
      isAdmin: [false],
      status: [false]
    });

    if (this.isEditMode) {
        this.userForm.get('password')?.valueChanges.subscribe(value => {
            if (value && value.length > 0) {
                this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
            } else {
                this.userForm.get('password')?.setValidators([]);
            }
            this.userForm.get('password')?.updateValueAndValidity({ emitEvent: false });
        });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    this.f['username'].setErrors(this.f['username'].errors?.['required'] ? { required: true } : null);

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      
      if (this.f['dateOfBirth'].errors?.['dateMustBeInPast']) {
         this.errorMessage = 'Atenção: A data de nascimento deve ser anterior à data atual.';
      } else {
         this.errorMessage = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      }
      return;
    }

    const userData: UserPayload = this.userForm.value;
    
    if (userData.dateOfBirth) {
        const localDate = new Date(userData.dateOfBirth);
        userData.dateOfBirth = localDate.toISOString();
    }
    
    let operation: Observable<any>;
    let successId: number | null = null;

    if (this.isEditMode && this.currentUserId) {
      if (!userData.password) {
        delete userData.password;
      }
      operation = this.userService.update(this.currentUserId, userData);
      successId = this.currentUserId;
    } else {
      operation = this.userService.create(userData);
    }
    
    operation.pipe(first()).subscribe({
      next: (response: User | Object) => {
        let finalId = successId;
        
        if (!this.isEditMode && (response as User).id) {
            finalId = (response as User).id!;
        }

        this.successMessage = this.isEditMode 
          ? `Usuário atualizado com sucesso!` 
          : `Novo usuário criado com sucesso!`;
        this.errorMessage = null;

        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 6000);
      },
      error: (errorResponse: HttpErrorResponse) => {
        console.error('Erro na submissão (Backend):', errorResponse);
        this.errorMessage = 'Falha na submissão. Por favor, verifique os dados.';
        
        const errorBody = errorResponse.error;
        
        if (errorResponse.status === 400 && errorBody && errorBody.errors) {
            
            if (errorBody.errors.Password && this.isEditMode) {
                this.errorMessage = 'Por gentileza insira uma senha válida.';
                this.f['password'].setErrors({ serverError: true });
                this.f['password'].markAsTouched();
                return;
            }
            
            if (errorBody.errors.username) {
                const usernameError = errorBody.errors.username[0];
                this.f['username'].setErrors({ serverError: usernameError });
                this.f['username'].markAsTouched(); 
                this.errorMessage = 'O nome de usuário escolhido não está disponível. Por favor, corrija.';
                return;
            }

            this.errorMessage = 'Erro de validação de dados. Por favor, revise todos os campos.';
            
        } else if (errorResponse.status === 409 || errorResponse.status === 400) {
            let backendErrorMessage: string = 'Erro de validação do servidor.';

            if (typeof errorBody === 'string' && errorBody.includes('nome de usuário já está em uso')) {
                backendErrorMessage = errorBody;
            } else if (errorBody && errorBody.message) {
                backendErrorMessage = errorBody.message;
            } 

            if (backendErrorMessage.toLowerCase().includes('nome de usuário')) {
                this.f['username'].setErrors({ 
                    serverError: backendErrorMessage 
                });
                this.f['username'].markAsTouched(); 
                this.errorMessage = 'O nome de usuário escolhido não está disponível. Por favor, corrija.';
            } else {
                 this.errorMessage = backendErrorMessage;
            }
        } else {
            this.errorMessage = 'Ocorreu um erro inesperado na comunicação com o servidor.';
        }
      }
    });
  }
}