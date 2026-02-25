import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);
    res.status(201).json({
        success: true,
        message: "Booking created successfully",
        body: result,
    })
    return result;
  } catch (error: any) {
    res.status(500).json({
        success: false,
        message: error.message,
        details: error,
    })
  }
};


const getAllBooking = async (req: Request, res: Response) => {

  try {
    const result = await bookingServices.getAllBooking(req.user);
    if(result.bookings.length === 0){
      res.status(404).json({
        success: true,
        message: "No bookings found",
        data: result,
    });
    }

    console.log(result.role)

    if (result.role === "admin") {
      const dataFormatted = result.bookings.map((b: any) => ({
        id: b.id,
        customer_id: b.customer_id,
        vehicle_id: b.vehicle_id,
        rent_start_date: b.rent_start_date,
        rent_end_date: b.rent_end_date,
        total_price: b.total_price,
        status: b.status,
        customer: {
          id: b.id_1,
          name: b.name,
          email: b.email,
        },
        vehicle: {
          id: b.id_2,
          vehicle_name: b.vehicle_name,
          registration_number: b.registration_number,
        },
      }));

     return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: dataFormatted,
      });
    }

    // CUSTOMER VIEW
    const dataFormatted = result.bookings.map((b: any) => ({
      id: b.id,
      vehicle_id: b.vehicle_id,
      rent_start_date: b.rent_start_date,
      rent_end_date: b.rent_end_date,
      total_price: b.total_price,
      status: b.status,
      vehicle: {
        vehicle_name: b.vehicle_name,
        registration_number: b.registration_number,
        type: b.type,
      },
    }));

    return res.status(200).json({
      success: true,
      message: "Your bookings retrieved successfully",
      data: dataFormatted,
    });


  } catch (error: any) {
    res.status(500).json({
        success: false,
        message: error.message,
        details: error,
    })
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const userRole = req.user?.role;

  try {
    // Role-based checks
    if (status === "cancelled" && userRole !== "customer") {
      return res.status(403).json({ success: false, message: "Only customers can cancel bookings" });
    }
    if (status === "returned" && userRole !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can mark as returned" });
    }

    const updatedBooking = await bookingServices.updateBooking(Number(bookingId), status);

    return res.status(200).json({
      success: true,
      message: status === "cancelled"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available",
      data: updatedBooking,
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const bookingController = {
  createBooking,
  getAllBooking,
  updateBooking,
};
