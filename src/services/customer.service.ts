import {
  DELETE_SUCCESS,
  ERROR,
  GET_SUCCESS,
  POST_SUCCESS,
  UPDATE_SUCCESS,
} from "./../configs/constants";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get all customers
const getAllCustomers = async () => {
  try {
    const res = await prisma.customers.findMany({
      where: {
        status: true,
      },
    });

    return {
      success: true,
      message: GET_SUCCESS,
      data: res,
    };
  } catch (error: any) {
    console.log(error?.message);
    return {
      success: false,
      message: ERROR,
      data: error?.message,
    };
  }
};

// get all customers by user name
const getAllCustomerByUsername = async (username: string) => {
  try {
    const res = await prisma.customers.findMany({
      where: {
        status: true,
        createdBy: username,
      },
    });

    return {
      success: true,
      message: GET_SUCCESS,
      data: res,
    };
  } catch (error: any) {
    console.log(error?.message);
    return {
      success: false,
      message: ERROR,
      data: error?.message,
    };
  }
};

// get a customers
const getOneCustomer = async (id: any) => {
  try {
    const res = await prisma.customers.findUnique({
      where: {
        id: id,
      },
    });

    return {
      success: true,
      message: GET_SUCCESS,
      data: res,
    };
  } catch (error: any) {
    console.log(error?.message);
    return {
      success: false,
      message: ERROR,
      data: error?.message,
    };
  }
};

// create a new customer
const createCustomer = async (data: any) => {
  console.log(data);
  try {
    const res = await prisma.customers.create({
      data: data,
    });
    if (res) {
      return {
        success: true,
        message: POST_SUCCESS,
        data: res,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: ERROR,
      data: error?.message,
    };
  }
};

// update a customer
const updateCustomer = async (data: any) => {
  try {
    const { id, ...newObject } = data;
    const res = await prisma.customers.update({
      where: {
        id: id,
      },
      data: newObject,
    });
    return {
      success: true,
      message: UPDATE_SUCCESS,
      data: res,
    };
  } catch (error: any) {
    return {
      success: false,
      message: ERROR,
      data: error?.message,
    };
  }
};

// delete a customer
const deleteCustomer = async (id: any) => {
  try {
    const res = await prisma.customers.delete({
      where: {
        id: id,
      },
    });
    return {
      success: true,
      message: DELETE_SUCCESS,
      data: res,
    };
  } catch (error: any) {
    return {
      success: false,
      message: ERROR,
      data: error?.message,
    };
  }
};

export {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getOneCustomer,
  getAllCustomerByUsername,
};
