import { Request, Response } from "express";
import { authServices } from "./auth.services";

const login = async (req: Request, res: Response) => {
  // const {name, email, password} = req.body;
  try {
    const result = await authServices.login(req.body);

    if (result === null) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (result === false) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const { user, token } = result;
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      deatils: error,
    });
  }
};

const creatUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.creatUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        role: result.role
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

export const authController = {
  creatUser,
  login,
};
