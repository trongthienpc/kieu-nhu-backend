import {
  DELETE_SUCCESS,
  ERROR,
  GET_SUCCESS,
  POST_SUCCESS,
  UPDATE_SUCCESS,
} from "./../configs/constants";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get all services
const getAllServices = async () => {
  try {
    const res = await prisma.services.findMany({
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

// get a services
const getOneServices = async (id: any) => {
  try {
    const res = await prisma.services.findUnique({
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

// create a new service
const createService = async (data: any) => {
  console.log(data);
  try {
    const res = await prisma.services.create({
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

// update a service
const updateService = async (data: any) => {
  try {
    const { id, ...newObject } = data;
    const res = await prisma.services.update({
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

// delete a service
const deleteService = async (id: any) => {
  try {
    const res = await prisma.services.delete({
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
  getAllServices,
  createService,
  updateService,
  deleteService,
  getOneServices,
};
