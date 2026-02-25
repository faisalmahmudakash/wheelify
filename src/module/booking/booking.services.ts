import { pool } from "../../config/db";

interface BookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  status?: string;
}

export interface Booking {
  id: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: "active" | "cancelled" | "returned";
}

const autoReturnExpiredBookings = async () => {
  // Update expired active bookings in ONE query
  await pool.query(`
    UPDATE bookings
    SET status = 'returned'
    WHERE status = 'active'
      AND rent_end_date < CURRENT_DATE
  `);

  // Update vehicles that belong to returned bookings
  await pool.query(`
    UPDATE vehicles
    SET availability_status = 'available'
    WHERE id IN (
      SELECT vehicle_id FROM bookings
      WHERE status = 'returned'
        AND rent_end_date < CURRENT_DATE
    )
  `);
};

const createBooking = async (payload: BookingPayload) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date, status } =
    payload;

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  if (endDate <= startDate) {
    throw new Error("End date is not valid!");
  }

  const overlapCheck = await pool.query( `SELECT * FROM bookings WHERE vehicle_id = $1 AND STATUS = 'active' AND NOT (rent_end_date < $2 OR rent_start_date > $3)`, [vehicle_id, rent_start_date, rent_end_date]);
  if(overlapCheck.rows.length > 0){
    throw new Error("Vehicle already booked for these dates!");
  }

  //get daily_rent_price from vehicles table
  const vehicleResult = await pool.query(
    `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id=$1`, [vehicle_id]);
  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  //  const daily_rent_price = Number(vehicleResult.rows[0].daily_rent_price);
  const { vehicle_name, daily_rent_price } = vehicleResult.rows[0];

  //calculate number of days
  const timeDifference = endDate.getTime() - startDate.getTime();
  const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  //calculate total price
  const total_price = daily_rent_price * numberOfDays;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status || "active",
    ],
  );

  const booking = result.rows[0];

  await pool.query(
    `UPDATE vehicles 
     SET availability_status = 'booked' 
     WHERE id = $1`,
    [vehicle_id]
  );

  return {
    id: booking.id,
    customer_id: booking.customer_id,
    vehicle_id: booking.vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price: booking.total_price,
    status: booking.status,
    vehicle: {
      vehicle_name,
      daily_rent_price,
    },
  };
};

const getAllBooking = async (user: any) => {
  //System automatically marks bookings as "returned" when rent_end_date has passed
  await autoReturnExpiredBookings();

  let result;

  if (user.role === "admin") {
    result = await pool.query(`SELECT * FROM bookings JOIN users ON customer_id = users.id JOIN vehicles ON vehicle_id = vehicles.id`);
    return {
      role: "admin",
      bookings: result.rows,
    };
  } else {
    result = await pool.query(`SELECT * FROM bookings JOIN vehicles ON vehicle_id = vehicles.id WHERE customer_id=$1`, [user.id]);
    console.log(user.id);

    return {
      role: "customer",
      bookings: result.rows,
    };
  }
};

const updateBooking = async (
  bookingId: number,
  status: "cancelled" | "returned"
) => {
  // Update booking status in one query
  const res = await pool.query(
    `UPDATE bookings 
     SET status = $1 
     WHERE id = $2 
     RETURNING *`,
    [status, bookingId]
  );

  const booking = res.rows[0];
  if (!booking) {
    throw new Error("Booking not found");
  }

  // If returned, mark vehicle available
  let vehicleInfo = null;
  if (status === "returned" || status === "cancelled") {
    const vehicleRes = await pool.query(
      `UPDATE vehicles 
       SET availability_status = 'available' 
       WHERE id = $1 
       RETURNING availability_status`,
      [booking.vehicle_id]
    );
    vehicleInfo = vehicleRes.rows[0];
  }

  // Return booking + vehicle info if updated
  return { ...booking, vehicle: vehicleInfo };
};



export const bookingServices = {
  createBooking,
  getAllBooking,
  updateBooking,
  autoReturnExpiredBookings,
};
