import * as Yup from 'yup'

// Candidate login form
export const validateLoginForm = Yup.object().shape({
  email: Yup.string()
    .required('Email is required.')
    .test(
      'is-gmail',
      'Only gmail.com addresses are allowed.',
      value => !value || /^[^\s@]+@gmail\.com$/.test(value)
    ),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long.')
    .required('Password is required.'),
});

//Candidate signup form validation
export const validateSignupForm = Yup.object().shape({
  username: Yup.string()
    .matches(/^[a-zA-Z.]+$/, 'Username can only contain letters and periods, without spaces.') 
    .min(3, 'Must be at least 3 characters long.')
    .required('Username is required.'),
  email: Yup.string()
    .email('Email must be a valid email address.')
    .matches(/^[^\s@]+@gmail\.com$/, 'Email must be a valid gmail.com address.')
    .required('Email is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/\d/, 'Password must contain at least one number.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .required('Confirm password is required.')
    .oneOf([Yup.ref('password'), null], 'Passwords must match.')
});



//Recruiter signup form validation
export const validateRecruiterSignupForm = Yup.object().shape({
  recruitername: Yup.string()
    .matches(/^[a-zA-Z.]+$/, 'Recruiter name must only contain letters.')
    .min(3, 'Must be at least 3 characters long.')
    .required('Recruiter name is required.'),
  email: Yup.string()
    .email('Email must be a valid email address.')
    .matches(/^[^\s@]+@gmail\.com$/, 'Email must be a valid gmail.com address.')
    .required('Email is required.'),
  companyName: Yup.string()
    .matches(/^[\w\d\s-]+$/, 'Company name can only contain letters, numbers, spaces, and hyphens.')
    .required('Company name is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/\d/, 'Password must contain at least one number.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .required('Confirm password is required.')
    .oneOf([Yup.ref('password'), null], 'Passwords must match.')
});


export const validateCompanySignupForm = Yup.object().shape({
  companyName: Yup.string()
    .matches(/^[a-zA-Z.]+$/, 'Company name must only contain letters and periods without spaces.')
    .min(3, 'Must be at least 3 characters long.')
    .required('Company name is required.'),
  email: Yup.string()
    .email('Email must be a valid email address.')
    .matches(/^[^\s@]+@gmail\.com$/, 'Email must be a valid gmail.com address.')
    .required('Email is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/\d/, 'Password must contain at least one number.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .required('Confirm password is required.')
    .oneOf([Yup.ref('password'), null], 'Passwords must match.')
});


export const validateResetPassword = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Must be at least 6 characters long.')
    .required('Password is required.'),
});
