export default function createError(status, message, data = null) {
  const error = new Error();
  error.status = status;
  error.message = message;
  error.data = data;
  return error;
}
