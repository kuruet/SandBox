import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
dotenv.config();

console.log("ADMIN_JWT_SECRET:", process.env.ADMIN_JWT_SECRET);

export function signAdminJwt(admin) {
  return jwt.sign(
    {
      sub: admin._id.toString(),
      role: "admin",
      jti: randomUUID(),
    },
    process.env.ADMIN_JWT_SECRET,
    {
      expiresIn: "15m",
      issuer: "sandbox-admin",
    }
  );
 
}
