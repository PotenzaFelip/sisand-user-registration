import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  standalone:false,
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnChanges {
  // Recebe o usuário (null para criar, User para editar)
  @Input() user: User | null = null;
  // Emite o evento quando o formulário é salvo
  @Output() userSaved = new EventEmitter<void>();

  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  // Detecta mudanças na propriedade 'user' (quando o modal é reaberto para outro usuário)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.userForm) {
      this.initForm(this.user);
    }
  }

  initForm(user?: User | null): void {
    this.userForm = this.fb.group({
      id: [user?.id || null],
      username: [user?.username || '', [Validators.required, Validators.minLength(3)]],
      password: ['', [!user?.id ? Validators.required : Validators.minLength(6)]], // Senha só é obrigatória na criação
      isAdmin: [user?.isAdmin || false]
    });

    if (user?.id) {
      this.userForm.get('password')?.clearValidators(); // Remove o required se estiver editando
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  // Helper para validação
  isInvalid(controlName: string) {
    const control = this.userForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = this.userForm.value;

    if (formData.id) {
      // Editar
      this.userService.update(formData.id, formData).subscribe(() => {
        this.userSaved.emit();
      });
    } else {
      // Criar
      this.userService.create(formData).subscribe(() => {
        this.userSaved.emit();
      });
    }
    // Nota: O fechamento do modal será tratado no UserListComponent após o userSaved.emit()
  }
}