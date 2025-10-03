import { Component, OnInit } from '@angular/core';
// Importa as ferramentas de formulário
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';

// Seus serviços e modelos
import { AuthService } from '../../core/services/auth.service';
import { Credentials } from '../../core/models/credentials.model'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent implements OnInit {

  // Variáveis para o formulário e erros
  loginForm!: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder, // Injeção do construtor de formulários
    private authService: AuthService,
    private router: Router
  ) {
    // Se o usuário já estiver logado, redireciona para a tela de usuários
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/users']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // Define os campos e as regras de validação
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.error = null; // Limpa erros anteriores
    
    if (this.loginForm.invalid) {
      // Se o formulário for inválido, toca todos os campos para exibir as mensagens de erro
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: Credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Se a requisição retornou um token (sucesso), navega para a rota protegida
        if (response.token) {
          this.router.navigate(['/user']); 
        } 
      },
      error: (err) => {
        // Trata erros de autenticação do backend (ex: 401)
        this.error = 'Falha no login. Verifique suas credenciais.';
        console.error('Erro de autenticação:', err);
      }
    });
  }
}