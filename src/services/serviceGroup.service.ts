import {
  DELETE_SUCCESS,
  ERROR,
  GET_SUCCESS,
  POST_SUCCESS,
  UPDATE_SUCCESS,
} from "./../configs/constants";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get all service groups
const getAllServiceGroups = async () => {
  try {
    const res = await prisma.serviceGroups.findMany({
      where: {
        status: true,
      },
    });
    console.log(res);
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

// get a service group
const getOneServiceGroup = async (id: any) => {
  try {
    const res = await prisma.serviceGroups.findUnique({
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

// create a new service group
const createServiceGroup = async (data: any) => {
  try {
    const oldEntity = await prisma.serviceGroups.findFirst({
      where: {
        label: data.label,
      },
    });

    // check if the service group exists
    if (oldEntity)
      return { success: false, message: "Tên nhóm dịch vụ đã tồn tại" };

    const res = await prisma.serviceGroups.create({
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

// update a service group
const updateServiceGroup = async (data: any) => {
  try {
    const res = await prisma.serviceGroups.update({
      where: {
        id: data?.id,
      },
      data: data,
    });
    return {
      success: false,
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

// delete a service group
const deleteServiceGroup = async (id: any) => {
  try {
    const res = await prisma.serviceGroups.delete({
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
  deleteServiceGroup,
  updateServiceGroup,
  createServiceGroup,
  getAllServiceGroups,
  getOneServiceGroup,
};
