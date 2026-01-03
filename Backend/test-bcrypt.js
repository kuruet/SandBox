import bcrypt from "bcrypt";
const hash = await bcrypt.hash("doyoubleed@77", 12);
console.log(hash);
