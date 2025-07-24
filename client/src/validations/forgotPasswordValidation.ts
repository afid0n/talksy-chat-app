import * as Yup from 'yup';

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email address'
    ),
});

export default forgotPasswordValidationSchema;
