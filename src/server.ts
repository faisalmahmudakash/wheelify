import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRoute } from "./module/user/user.router";
import { vehicleRouter } from "./module/vehicle/vehicle.router";
import { bookingRouter } from "./module/booking/booking.router";
import { authRouter } from "./module/auth/auth.router";


const app = express();
const port = 5000;

//parser
app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Wheelify"); 
});

app.use("/api/v1/auth/", authRouter);

app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/bookings", bookingRouter);

app.use("/api/v1/users", userRoute);

app.listen(port, ()=>{
    console.log(`port is running on ${port}`);
});