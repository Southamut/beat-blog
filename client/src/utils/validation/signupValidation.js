export function validateSignupForm({ name, username, email, password }) {
  const errors = { name: "", username: "", email: "", password: "" };

  if (!name?.trim()) errors.name = "Name is required.";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  else if (name.trim().length > 50) errors.name = "Name must be 50 characters or less.";

  if (!username?.trim()) errors.username = "Username is required.";
  else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim()))
    errors.username = "3-20 chars, letters/numbers/underscore only.";

  if (!email?.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
    errors.email = "Please enter a valid email address.";

  if (!password) errors.password = "Password is required.";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters.";
  else if (password.length > 64) errors.password = "Password must be 64 characters or less.";
  else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
    errors.password = "Include at least one letter and one number.";

  return { isValid: !Object.values(errors).some(Boolean), errors };
}


