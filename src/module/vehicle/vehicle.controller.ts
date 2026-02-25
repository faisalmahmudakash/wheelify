import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);
    // console.log(result)
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      body: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();
    if (result.length === 0) {
      res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const getVehiclesById = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehiclesById(
      req.params.id as string,
    );
    if (result.length === 0) {
      res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.updateVehicle(
      req.body,
      req.params.vehicleId as string,
    );
    if (result.length === 0) {
      res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.deleteVehicle(
      req.params.vehicleId as string,
    );

    if (result.activeBookings) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete vehicle: active bookings exist",
      });
    }

    if (!result) {
      res.status(404).json({
        success: true,
        message: "No vehicle found with this ID",
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
        // data: result,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehiclesById,
  updateVehicle,
  deleteVehicle,
};
