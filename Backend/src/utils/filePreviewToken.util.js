import jwt from "jsonwebtoken";

export const generatePreviewToken = ({ fileId, vendorId }) => {
  const secret = process.env.FILE_PREVIEW_SECRET;

  if (!secret) {
    throw new Error("FILE_PREVIEW_SECRET not loaded");
  }

  return jwt.sign(
    { fileId, vendorId, scope: "file-preview" },
    secret,
    { expiresIn: "5m" }
  );
};

export const verifyPreviewToken = (token) => {
  const secret = process.env.FILE_PREVIEW_SECRET;

  if (!secret) {
    throw new Error("FILE_PREVIEW_SECRET not loaded");
  }

  return jwt.verify(token, secret);
};
