import { body, param } from "express-validator";

export const vendorLoginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const fileIdParamValidator = [
  param("fileId")
    .isMongoId()
    .withMessage("Invalid file ID"),
];
