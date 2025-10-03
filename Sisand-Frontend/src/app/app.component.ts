import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div *ngIf="!authService.isLoggedIn()">
      <router-outlet></router-outlet>
    </div>

    <div *ngIf="authService.isLoggedIn()">
      <app-navbar></app-navbar> 
      
      <main class="container mt-4">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  constructor(public authService: AuthService) {} 
}