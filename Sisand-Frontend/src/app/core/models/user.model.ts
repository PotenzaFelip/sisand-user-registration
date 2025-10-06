export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  createdAt?: Date;

  name: string;
  phone?: string;
  cpf?: string;
  dateOfBirth?: Date | string; 

  cep?: string;
  address?: string;
  city?: string;
  state?: string;

  isAdmin?: boolean;
  status?: boolean; 
}
