import express from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
import { bookingServices } from "./booking.services";


const router = express.Router();


router.post("/", auth("customer", "admin"),  bookingController.createBooking);

router.get("/", auth("customer", "admin"), bookingController.getAllBooking);

router.put("/:bookingId", auth("customer" , "admin"), bookingController.updateBooking);


export const bookingRouter = router;
