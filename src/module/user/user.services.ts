import { pool } from "../../config/db";
import bcrypt from "bcrypt";

interface UserPayload {
  name: string;
  email: string;
  phone: string;
  role: string;
}

const getAllUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);

  return result.rows;
}

const updateUser = async (payload: UserPayload,  id: string) => {

  const {name, email, phone, role} = payload;

  const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,[name, email, phone, role, id]);

  return result.rows[0];
}

const deleteUser = async (userId: string) => {
  // Check active bookings
  const activeBooking = await pool.query(
    `SELECT id FROM bookings 
     WHERE customer_id = $1 
       AND status = 'active'`,
    [userId]
  );
  if (activeBooking.rows.length > 0) {
    throw new Error("User cannot be deleted. Active bookings exist.");
  }

  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [userId]);

  return result;
}



export const userService = {
  getAllUser,
  updateUser,
  deleteUser,
};
