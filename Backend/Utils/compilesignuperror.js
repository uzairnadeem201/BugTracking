const ErrorMessages = (result)=>{
  const errorMessages = result.errors.map(err => err.message).join(', ');
  return errorMessages;
}
export default ErrorMessages;