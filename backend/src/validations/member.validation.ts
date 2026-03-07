import * as yup from 'yup';

// Member {
//     id        String   @id @default(cuid())
//     email     String?   @unique
    
//     name      String
//     birthDate DateTime
//     rg        String
//     cpf       String
//     phone     String 
//     role      Role @default(MEMBER)
//     baptismDate DateTime?
//     memberSince DateTime?
    
//   }

export const createMemberValidation = yup.object({
    name: yup.string().required({ message: 'Nome é obrigatório' }),
    email: yup.string().email({message: 'E-mail inválido'}).required(),
    birthDate: yup.date().required({ message: 'Data de nascimento é obrigatória' }),
    rg: yup.string().required({ message: 'RG é obrigatório' }),
    cpf: yup.string().required({ message: 'CPF é obrigatório' }),
    phone: yup.string().required({ message: 'Telefone é obrigatório' }),
    role: yup.string().required({ message: 'Cargo é obrigatório' }),
    baptismDate: yup.date(),
    memberSince: yup.date(),
})

export const updateMemberValidation = yup.object({
    name: yup.string(),
    email: yup.string(),
    birthDate: yup.date(),
    rg: yup.string(),
    cpf: yup.string(),
    phone: yup.string(),
    role: yup.string(),
    baptismDate: yup.date(),
    memberSince: yup.date(),
})