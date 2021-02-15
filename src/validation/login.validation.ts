import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Digite um e-mail')
    .email('Digite um e-mail válido'),
  senha: yup
    .string()
    .required('Digite a senha')
    .min(6, 'Minimo 6 caracteres'),
});

export default schema;