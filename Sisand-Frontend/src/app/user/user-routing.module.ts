import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  { path: '', component: UserListComponent },            // /users
  { path: 'new', component: UserFormComponent },         // /users/new
  { path: ':id/edit', component: UserFormComponent },    // /users/123/edit
  { path: ':id', component: UserFormComponent }          // /users/123 (pode ser detalhe ou edição)
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }