export default function validatePassword(password) {
  const has_uppercase = /[A-Z]/.test(password);
  const has_number = /\d/.test(password);
  const is_valid_length = password.length >= 8;

  return has_uppercase && has_number && is_valid_length;
}
