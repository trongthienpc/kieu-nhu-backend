// get user

import { PrismaClient } from "@prisma/client";

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
