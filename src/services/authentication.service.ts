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

const prisma = new PrismaClient();

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
      ? { status: true, message: `This ${queryType} is not taken` }
      : {
          status: false,
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
    if (!user?.username || !user?.password)
      return {
        status: false,
        message: "Please fill up all the required information",
      };

    // check email already exist
    const emailStatus = await checkEmailExist(user?.email);
    if (emailStatus != true) return { status: false, message: EMAIL_EXIST };

    // check username already exist
    const usernameStatus = await checkUsernameExist(user?.username);
    if (usernameStatus != true)
      return { status: false, message: USERNAME_EXIST };

    const passwordHash = await bcrypt.hash(user?.password, 10);
    let userObject = {
      username: user?.username?.toLowerCase(),
      password: passwordHash,
      email: user?.email?.toLowerCase(),
      name: user?.name?.toLowerCase(),
      admin: user?.admin || false,
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
        status: true,
        message: REGISTERED_SUCCESS,
        data: accessToken,
      };
    } else {
      return { status: false, message: REGISTERED_FAILED };
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
    return { status: false, message: errorMessage, data: error?.toString() };
  }
};

// user login
const userLogin = async (user: any) => {
  try {
    if (!user?.username || !user.password)
      return { status: false, message: "Please fill up all the fields" };

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
        let token = jwt.sign(
          {
            username: userObject?.username,
            email: userObject?.email,
          },
          process.env.TOKEN_SECRET || "",
          { expiresIn: "10m" }
        );
        return { status: true, message: "User login successful", data: token };
      } else {
        return {
          status: false,
          message: "Incorrect password",
        };
      }
    } else {
      return {
        status: false,
        message: "No user found",
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      status: false,
      message: "User login failed",
      error: error?.toString(),
    };
  }
};

// check token validity
const tokenVerification = async (req: any, res: Response, next: any) => {
  console.log(`authentication.service | tokenVerification ${req.originalUrl}`);
  try {
    if (
      req?.originalUrl?.includes("/login") ||
      req?.originalUrl?.includes("/user-exist") ||
      req?.originalUrl?.includes("/register") ||
      req?.originalUrl?.includes("/refresh-token")
    )
      return next();

    let token = req?.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
      jwt.verify(
        token,
        process.env.TOKEN_SECRET || "",
        (error: any, decoded: any) => {
          if (error) {
            return res.status(401).json({
              status: false,
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
        status: false,
        message: "Token is missing",
        error: "Token is missing",
      });
    }
  } catch (error: any) {
    return res.status(401).json({
      status: false,
      message: error?.message ? error?.message : "Authentication failed",
      error: `Authentication failed | ${error?.message}`,
    });
  }
};

// refresh token validity
const tokenRefresh = async (req: Request, res: any) => {
  console.log(`authentication.service | tokenRefresh | ${req?.originalUrl}`);
  try {
    let token = req?.headers["authorization"];
    console.log(token);
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token?.length);
      jwt.verify(
        token,
        process.env.TOKEN_SECRET || "",
        {
          ignoreExpiration: true,
        },
        async (error: any, decoded: any) => {
          if (error) {
            return res.status(401).json({
              status: false,
              message: error?.name ? error?.name : "Invalid token",
              error: `Invalid token | ${error?.message}`,
            });
          } else {
            if (decoded?.username && decoded?.email) {
              let newToken = jwt.sign(
                {
                  username: decoded?.username,
                  email: decoded?.email,
                },
                process.env.TOKEN_SECRET || "",
                { expiresIn: "10m" }
              );
              return res.json({
                status: true,
                message: "Token refreshed successfully",
                data: newToken,
              });
            } else {
              return res.status(401).json({
                status: false,
                message: error?.name ? error?.name : "Invalid Token",
                error: `Invalid token | ${error?.message}`,
              });
            }
          }
        }
      );
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Token not found or token not valid" });
    }
  } catch (error: any) {
    return res.status(404).json({
      status: false,
      message: error?.name ? error?.name : "Token refresh failed",
      error: `Token refresh failed | ${error?.message}`,
    });
  }
};

export {
  tokenRefresh,
  tokenVerification,
  userRegister,
  userLogin,
  checkEmailExist,
  checkUsernameExist,
  checkUserExist,
};
