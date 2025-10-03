import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // 👈 Roteamento
import { AuthModule } from './auth/auth.module';         // 👈 Módulo de Autenticação
import { UserModule } from './user/user.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // 👈 Formulários
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule, // Importa HttpClientModule para chamadas HTTP
    AppRoutingModule, // Importe o roteamento principal
    AuthModule,       // Importe os módulos de feature
    UserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}