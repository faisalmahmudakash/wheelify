import { pool } from "../../config/db"

interface vehiclePayload {
    vehicle_name: string;
    type: string;
    registration_number: string;
    daily_rent_price: string;
    availability_status: string;
}

const createVehicle = async (payload: vehiclePayload) => {
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload;

    const result = await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,[vehicle_name, type, registration_number, daily_rent_price, availability_status]);


    return result.rows[0];
};

const getAllVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);

    return result.rows;
}


const getVehiclesById = async (id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

    return result.rows;
}

const updateVehicle = async (payload:  vehiclePayload, vehicleId: string) => {
    const {vehicle_name, daily_rent_price, availability_status} = payload;
    const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, daily_rent_price=$2, availability_status=$3 WHERE id = $4 RETURNING *`, [vehicle_name, daily_rent_price, availability_status, vehicleId]);

    return result.rows;
}

const deleteVehicle = async (vehicleId: string) =>{
    // Check active bookings
  const activeBooking = await pool.query(
    `SELECT id FROM bookings 
     WHERE vehicle_id = $1 
       AND status = 'active'`,
    [vehicleId]
  );
  if (activeBooking.rows.length > 0) {
    throw new Error("Vehicle cannot be deleted. Active bookings exist.");
  }

    const check = await pool.query(`SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`, [vehicleId]);

    if(check.rows.length > 0){
        throw new Error("Cannot delete vehicle: active booking exist");
    }

    const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [vehicleId]);
    if(!result.rows[0]) {
        throw new Error("Vehicle not found");
    }

    return result.rows[0];
}


export const vehicleServices = {
    createVehicle,
    getAllVehicles,
    getVehiclesById,
    updateVehicle,
    deleteVehicle,
}