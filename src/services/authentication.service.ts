import {
  USERNAME_EXIST,
  EMAIL_EXIST,
  REGISTERED_FAILED,
  REGISTERED_SUCCESS,
} from "../configs/constants";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { decode } from "punycode";
// import prisma from "../../lib/prisma";

const prisma = new PrismaClient();
// const prisma = new PrismaClient({ log: ["query", "info", "warn"] });

// check [type] is exist
const checkUserExist = async (query: any) => {
  let messages = {
    email: EMAIL_EXIST,
    username: USERNAME_EXIST,
  };
  // console.log(query);
  try {
    let queryType = Object.keys(query)[0];
    let userObject = await prisma.users.findFirst({
      where: query,
    });

    return !userObject
      ? { success: true, message: `This ${queryType} is not taken` }
      : {
          success: false,
          message: messages[queryType as keyof typeof messages],
        };
  } catch (error: any) {
    console.log(error);
  }
};

// check username already exist
const checkUsernameExist = async (query: any) => {
  const user = await prisma.users.findFirst({
    where: {
      username: query,
    },
  });

  if (user) return USERNAME_EXIST;

  return true;
};

// check email already exist
const checkEmailExist = async (query: string) => {
  const user = await prisma.users.findFirst({
    where: {
      email: query,
    },
  });

  if (user) return EMAIL_EXIST;

  return true;
};

// user register
const userRegister = async (user: any) => {
  try {
    console.log(`Authentication | user registration`);
    if (!user?.username || !user?.password || !user?.fullName)
      return {
        success: false,
        message: "Please fill up all the required information",
      };

    // check email already exist
    // const emailStatus = await checkEmailExist(user?.email);
    // if (emailStatus != true) return { success: false, message: EMAIL_EXIST };

    // check username already exist
    const usernameStatus = await checkUsernameExist(user?.username);
    if (usernameStatus != true)
      return { success: false, message: USERNAME_EXIST };

    const passwordHash = await bcrypt.hash(user?.password, 10);
    let userObject = {
      username: user?.username?.toLowerCase().trim(),
      password: passwordHash,
      email: user?.email?.toLowerCase().trim(),
      name: user?.fullName?.toLowerCase().trim(),
      admin: user?.admin || false,
      createdDate: new Date(),
      createdBy: user?.createdBy,
    };

    // save to database
    const newUser = await prisma.users.create({
      data: userObject,
    });

    // create toke for user registration
    if (newUser) {
      let accessToken = jwt.sign(
        { username: userObject?.username, email: userObject?.email },
        process.env.TOKEN_SECRET || "",
        {
          expiresIn: "10m",
        }
      );
      return {
        success: true,
        message: REGISTERED_SUCCESS,
        data: newUser,
      };
    } else {
      return { success: false, message: REGISTERED_FAILED };
    }
  } catch (error: any) {
    console.log(error?.message);
    let errorMessage = REGISTERED_FAILED;
    error?.code === 11000 && error?.keyPattern?.username
      ? (errorMessage = "Username already exist")
      : null;
    error?.code === 11000 && error?.keyPattern?.email
      ? (errorMessage = "Email already exist")
      : null;
    return { success: false, message: errorMessage, data: error?.toString() };
  }
};

// user login
const userLogin = async (user: any) => {
  try {
    if (!user?.username || !user.password)
      return { success: false, message: "Please fill up all the fields" };

    const userObject = await prisma.users.findFirst({
      where: {
        username: user.username.toLowerCase(),
      },
    });
    if (userObject) {
      let isPasswordVerified = await bcrypt.compare(
        user?.password,
        userObject.password
      );
      if (isPasswordVerified) {
        const { password, ...userInfo } = userObject;
        let accessToken = generateAccessToken(userObject.username);

        const refreshToken = generateRefreshToken(userObject.username);
        await prisma.users.update({
          where: {
            id: userObject.id,
          },
          data: {
            refreshToken: refreshToken,
          },
        });
        return {
          success: true,
          message: "User login successful",
          data: { ...userInfo, accessToken },
          refreshToken: refreshToken,
        };
      } else {
        return {
          success: false,
          message: "Incorrect password",
        };
      }
    } else {
      return {
        success: false,
        message: "No user found",
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "User login failed",
      error: error?.toString(),
    };
  }
};

// @desc generate new access token
// @param user id
export const generateAccessToken = (username: string) => {
  return jwt.sign({ username: username }, process.env.TOKEN_SECRET || "", {
    expiresIn: "3s",
  });
};

export const generateRefreshToken = (username: string) => {
  return jwt.sign({ username: username }, process.env.TOKEN_SECRET || "", {
    expiresIn: "1d",
  });
};

// check token validity
const tokenVerification = async (req: any, res: Response, next: any) => {
  console.log(`authentication.service | tokenVerification ${req.originalUrl}`);
  try {
    if (
      req?.originalUrl?.includes("/login") ||
      req?.originalUrl?.includes("/user-exist") ||
      req?.originalUrl?.includes("/register") ||
      req?.originalUrl?.includes("/refresh") ||
      req?.originalUrl?.includes("/logout")
    )
      return next();

    let token = req?.headers.token;
    // console.log(token);
    if (token && token.startsWith("Bearer ")) {
      const accessToken = token.split(" ")[1];
      jwt.verify(
        accessToken,
        process.env.TOKEN_SECRET || "",
        (error: any, decoded: any) => {
          if (error) {
            return res.status(401).json({
              success: false,
              message: error?.name ? error?.name : "Invalid Token",
              error: `Invalid token | ${error?.message}`,
            });
          } else {
            req.username = decoded?.username;
            next();
          }
        }
      );
    } else {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
        error: "Token is missing",
      });
    }
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error?.message ? error?.message : "Authentication failed",
      error: `Authentication failed | ${error?.message}`,
    });
  }
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// refresh token validity
const tokenRefresh = async (refreshToken: string) => {
  console.log(`authentication.service | tokenRefresh `);
  try {
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET || "",
      {
        ignoreExpiration: true,
      },
      async (error: any, decoded: any) => {
        if (error) {
          return {
            success: false,
            message: error?.name ? error?.name : "Invalid token",
            error: `Invalid token | ${error?.message}`,
          };
        } else {
          console.log("decoded: ", decoded);
          if (decoded?.username) {
            const newAccessToken = generateAccessToken(decoded?.username);
            console.log(newAccessToken);
            return {
              success: true,
              message: "Token refreshed successfully",
              accessToken: newAccessToken,
            };
          } else {
            return {
              success: false,
              message: error?.name ? error?.name : "Invalid Token",
              error: `Invalid token | ${error?.message}`,
            };
          }
        }
      }
    );
  } catch (error: any) {
    return {
      success: false,
      message: error?.name ? error?.name : "Token refresh failed",
      error: `Token refresh failed | ${error?.message}`,
    };
  }
};

const checkAdminRole = async (username: string) => {
  let isAdmin = false;
  const user = await prisma.users.findFirst({
    where: {
      username: username,
    },
  });
  if (user) isAdmin = user.admin || false;
  return isAdmin;
};

// check admin role by token
const checkAdminRoleByToken = async (token: string) => {
  // decoded the token
  jwt.verify(
    token,
    process.env.TOKEN_SECRET || "",
    async (error: any, decoded: any) => {
      if (error) {
        return {
          success: false,
          message: error?.message
            ? error?.message
            : "Oops! Something went wrong!",
          error: `Check admin role By token failed | ${error?.message}`,
        };
      } else {
        const username = decoded.username;
        const user = await prisma.users.findUnique({
          where: { username: username },
        });
        const isAdmin = user?.admin;
        return isAdmin ? true : false;
      }
    }
  );
};

export {
  checkAdminRoleByToken,
  tokenRefresh,
  tokenVerification,
  userRegister,
  userLogin,
  checkEmailExist,
  checkUsernameExist,
  checkUserExist,
  checkAdminRole,
};
