import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // 👈 Roteamento
import { AuthModule } from './auth/auth.module';         // 👈 Módulo de Autenticação
import { UserModule } from './user/user.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // 👈 Formulários

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule, // Importe o roteamento principal
    AuthModule,       // Importe os módulos de feature
    UserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}