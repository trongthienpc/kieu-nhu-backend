import bcrypt from "bcrypt";
// get user

import { PrismaClient } from "@prisma/client";
import {
  DELETE_SUCCESS,
  ERROR,
  POST_SUCCESS,
  UPDATE_SUCCESS,
} from "../configs/constants";

const prisma = new PrismaClient();
export const getUser = async (username: any) => {
  try {
    const response = await prisma.users.findFirst({
      where: {
        username: username,
      },
    });

    if (response) {
      return {
        success: true,
        message: "Get user successfully!",
        data: response,
      };
    } else {
      return {
        success: false,
        message: "User not found!",
        data: null,
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "Oops! Something went wrong!",
      error: error?.message,
    };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await prisma.users.findMany({});
    if (response) {
      return {
        success: true,
        message: "Get users successfully!",
        data: response,
      };
    } else {
      return {
        success: false,
        message: "Have error ...!",
        data: null,
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "Oops! Something went wrong!",
      error: error?.message,
    };
  }
};

// reset password
export const resetPassword = async (username: string) => {
  if (username) {
    const user = await prisma.users.findUnique({
      where: {
        username: username,
      },
    });
    if (user) {
      const password = process.env.PASSWORD_DEFAULT || "";
      const passwordHash = await bcrypt.hash(password, 10);
      const result = await prisma.users.update({
        where: {
          username: username,
        },
        data: {
          password: passwordHash,
        },
      });
      if (result) {
        return {
          success: true,
          message: "Password reset successfully!",
        };
      }
    }
  }
};
