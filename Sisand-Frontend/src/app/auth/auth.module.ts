import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-rounting.module';


@NgModule({
  declarations: [
    // coloque aqui LoginComponent, RegisterComponent, etc.
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
