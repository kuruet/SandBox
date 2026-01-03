import bcrypt from "bcrypt";
import Admin from "../models/admin.model.js";
import { signAdminJwt } from "../utils/adminJwt.util.js";
import { createAuditLog } from "../audit/audit.service.js";

export async function authenticateAdmin({ email, password, ip }) {
  console.log("[ADMIN AUTH] Login attempt started");

  // 1. Clean the email input
  const cleanEmail = email.toLowerCase().trim();
  console.log("[ADMIN AUTH] Clean email:", cleanEmail);

  // 2. Find the admin in the database
  const admin = await Admin.findOne({ email: cleanEmail }).select("+passwordHash");
  console.log("[ADMIN AUTH] Admin found:", !!admin);

  // 3. Basic existence check
  if (!admin) {
    console.log("[ADMIN AUTH] Admin not found");
    throw new Error("INVALID_CREDENTIALS");
  }

  // 4. Status check
  console.log("[ADMIN AUTH] Admin status:", admin.status);
  if (admin.status !== "active") {
    throw new Error("ADMIN_DISABLED");
  }

  // 5. Lock check
  console.log("[ADMIN AUTH] Locked until:", admin.lockedUntil);
  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    throw new Error("ADMIN_LOCKED");
  }

  // 6. Verify the password
  const isValid = await bcrypt.compare(password, admin.passwordHash);
  console.log("[ADMIN AUTH] Password valid:", isValid);

  if (!isValid) {
    admin.failedLoginAttempts += 1;
    console.log("[ADMIN AUTH] Failed attempts:", admin.failedLoginAttempts);

    if (admin.failedLoginAttempts >= 3) {
      admin.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
      console.log("[ADMIN AUTH] Admin account locked");
    }

    await admin.save();
    console.log("[ADMIN AUTH] Admin security state saved");

    throw new Error("INVALID_CREDENTIALS");
  }

  // 7. Login success updates
  admin.failedLoginAttempts = 0;
  admin.lockedUntil = null;
  admin.lastLoginAt = new Date();

  await admin.save();
  console.log("[ADMIN AUTH] Login success, admin state updated");

  // 8. Generate JWT
  const token = signAdminJwt(admin);
  console.log("[ADMIN AUTH] JWT generated");

  // 9. Audit logging (SAFE, NON-BLOCKING FOR NOW)
  try {
    console.log("[ADMIN AUDIT] Attempting audit log");

    await createAuditLog({
      actorType: "admin",
      actorId: admin._id,
      action: "admin.login.success",
      ipAddress: ip,
      metadata: {
        email: admin.email,
      },
    });

    console.log("[ADMIN AUDIT] Audit log written successfully");
  } catch (err) {
    console.error("[ADMIN AUDIT] AUDIT FAILED (TEMP BYPASS):", err.message);
  }

  console.log("[ADMIN AUTH] Login flow completed");

  return token;
}
