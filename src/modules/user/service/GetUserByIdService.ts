import { IUserRepository } from "../repository/IUserRepository";
 
// Lógica para encontrar um usuário por ID
export class GetUserByIdService {
    constructor(private userRepository: IUserRepository) {
    }

    async execute(id: string) {
        const user = await this.userRepository.findById(id);
       
        return user;
    } 


} 