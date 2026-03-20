import * as yup from 'yup';

export const createUserValidation = yup.object({
    name: yup.string().required({ message: 'Nome é obrigatório' }),
    email: yup.string().email().required({ message: 'Email é obrigatório' }),
    password: yup.string().required({ message: 'Senha é obrigatória' }).min(6, { message: 'Senha precisa ter no mínimo 6 caracteres' })
})

