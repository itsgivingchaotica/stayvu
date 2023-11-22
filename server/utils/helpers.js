import bcrypt from "bcrypt";

const saltRounds = 10;

const hashPassword = (password) => {
  console.log(password);
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (raw, hash) => {
  return bcrypt.compareSync(raw, hash);
};

export { hashPassword, comparePassword };
