// CreateUserDTO

// DTO para entrada do Controller/Service (antes do hash)
export interface ICreateUserRequest {
  name: string;
  email: string;
  avatar?: string; // Path do arquivo de avatar
  password: string; // Senha sem hash
}
