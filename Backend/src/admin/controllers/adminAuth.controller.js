import { authenticateAdmin } from "../services/adminAuth.service.js";
import { validateAdminLogin } from "../validators/adminAuth.validator.js";

export async function adminLoginController(req, res) {
  const error = validateAdminLogin(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  try {
    const token = await authenticateAdmin({
      email: req.body.email,
      password: req.body.password,
      ip: req.ip,
    });

    return res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);

    return res.status(401).json({
      message: err.message,
    });
  }
}

