import config from "../../config";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface AuthPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

interface UserPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

const login = async (payload: AuthPayload) => {
  const {email, password } = payload;
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  console.log(user);
  const match = await bcrypt.compare(password as string, user.password);
  if (!match) {
    return false;
  }

  //token generate
  const secret = config.jwt_secret;
  const token = jwt.sign({id: user.id, email: user.email, role: user.role }, secret as string, {
      expiresIn: "7d",
    },
  );

  return { token, user };
};

const creatUser = async (payload: UserPayload) => {
  const { name, email, password, phone, role } = payload;
  console.log("password Length: ", password.length);

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const emailLower = email.toLowerCase();
  const hashPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, emailLower, hashPassword, phone, role],
  );

  return result.rows[0];
};

export const authServices = {
  creatUser,
  login,
};
