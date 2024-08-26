import * as Yup from 'yup';

export const initialValues = {
    password:"",
    confirm_password:"",
}

export const ResetPasswordSchema = Yup.object().shape({
    password:Yup.string()
        .min(8,'Password should be minimum 8 charecters')
        .matches(/[A-Z]/,'Password should have atleast one uppercase')
        .matches(/[a-z]/,'Password should have atleast one lowercase')
        .matches(/[0-9]/,'Password should have atleast one number')
        .matches(/[!@#$%^&*]/,'Password should have atleast one special character')
        .required('Required'),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('password'),null],'Password must match')
        .required('Required')
})