import { Request, Response } from "express";
import { userService } from "./user.services";



const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUser();
    
    if(result.length === 0){
      res.status(404).json({
      success: false,
      message: "Users Not Found",
      data: result,
    });
    }else {
      res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
       data: result.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      })),
    });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
}

const updatedUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.updateUser(req.body, req.params.id as string);

    if(result.length === 0){
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result,
      })
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    })
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUser(req.params.id as string);
    if(result.rowCount === 0){
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    };
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    })
  }
};


export const userCollection = {
  getAllUser,
  updatedUser,
  deleteUser,
};
