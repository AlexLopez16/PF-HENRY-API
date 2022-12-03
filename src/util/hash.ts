import bcrypt from "bcryptjs";

export const hash = async (value: string) => {
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(value, salt);
  return hash;
};
