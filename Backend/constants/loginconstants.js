const LoginConstants = Object.freeze({
  ERRORS: {
    MISSING_FIELDS: 'All fields are required.',
    USER_NOT_FOUND: 'Invalid Email or Password',
    DECRYPTION_FAILED: 'Failed to decrypt password',
    PASSWORD_MISMATCH: 'Invalid email or password',
    NOT_VALID_USER: 'User is not valid'
  },
  SUCCESS: {
    LOGIN_SUCCESSFUL: 'Login successful',
  }
});

export default LoginConstants;