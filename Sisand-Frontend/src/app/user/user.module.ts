// ...
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component'; // 👈 Importe
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent // 👈 Adicione aqui
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    UserFormComponent // 👈 Exporte para poder usar em UserListComponent
  ]
})
export class UserModule { }