export const validateEnv = () => {
  console.log("ENV FILE_PREVIEW_SECRET =", process.env.FILE_PREVIEW_SECRET);

  const requiredVars = [
    "MONGODB_URI",
    "JWT_SECRET",
    "FILE_PREVIEW_SECRET",
     "FRONTEND_PUBLIC_URL",
  ];

  requiredVars.forEach((key) => {
    if (!process.env[key]) {
      console.error(`❌ Missing environment variable: ${key}`);
      process.exit(1);
    }
  });
};
