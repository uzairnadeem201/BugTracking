const validateUserInput = (user) => {
    const errors = [];
  
    const isEmpty = (value) => !value || value.trim().length === 0;
  
    if (isEmpty(user.name)) {
      errors.push({ field: 'name', message: 'Name is required.' });
    } else if (user.name.trim().length < 3) {
      errors.push({ field: 'name', message: 'Name must be at least 3 characters long.' });
    } else if (!/^[A-Za-z\s]+$/.test(user.name)) {
      errors.push({ field: 'name', message: 'Name must contain only letters and spaces.' });
    }
  
    if (isEmpty(user.email)) {
      errors.push({ field: 'email', message: 'Email is required.' });
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.push({ field: 'email', message: 'Please provide a valid email address.' });
    }
  
    if (isEmpty(user.phonenumber)) {
      errors.push({ field: 'phonenumber', message: 'Phone number is required.' });
    } else if (!/^\d{11}$/.test(user.phonenumber)) {
      errors.push({ field: 'phonenumber', message: 'Phone number must be exactly 11 digits.' });
    }
  
    if (isEmpty(user.password)) {
      errors.push({ field: 'password', message: 'Password is required.' });
    } else if (user.password.length < 6) {
      errors.push({ field: 'password', message: 'Password must be at least 6 characters long.' });
    }
  
    if (isEmpty(user.role)) {
      errors.push({ field: 'role', message: 'Role is required.' });
    }
  
    if (errors.length > 0) {
      return { success: false, errors };
    }
  
    return { success: true };
  };
  
  export default validateUserInput;
  