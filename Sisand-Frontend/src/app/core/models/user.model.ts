// src/app/core/models/user.model.ts

/**
 * Define a estrutura de dados de um Usuário no Front-end.
 *
 * NOTA: Tipicamente, a senha (password) não deve ser incluída nesta interface,
 * pois ela não deve ser transmitida ou armazenada no front-end após o login.
 */
export interface User {
  id: number;
  username: string;
  isAdmin: boolean; // Para controlar permissões (se é administrador ou não)
}