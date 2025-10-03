import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Helper para verificar a validade do campo (uso no template)
  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  onSubmit(): void {
    this.error = null; // Limpa erros anteriores
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (success) => {
        if (success) {
          // Autenticação bem-sucedida, navega para a tela de usuários
          this.router.navigate(['/user']);
        } else {
          this.error = 'Usuário ou senha inválidos.';
        }
      },
      error: () => {
        this.error = 'Ocorreu um erro na tentativa de login.';
      }
    });
  }
}