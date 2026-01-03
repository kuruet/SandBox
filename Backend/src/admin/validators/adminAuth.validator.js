export function validateAdminLogin(body) {
  const { email, password } = body;

  if (!email || !password) {
    return "Email and password are required";
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return "Invalid input types";
  }

  if (!email.includes("@") || password.length < 8) {
    return "Invalid credentials format";
  }

  return null;
}
