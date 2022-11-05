import {
  DELETE_SUCCESS,
  ERROR,
  GET_SUCCESS,
  KPI_EXIST,
  POST_SUCCESS,
  UPDATE_SUCCESS,
} from "./../configs/constants";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get all kpis
const getAllKpis = async () => {
  try {
    const res = await prisma.kpis.findMany({
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

// get all Kpis by username
const getAllKpisByUsername = async (username: string) => {
  try {
    const res = await prisma.kpis.findMany({
      where: {
        status: true,
        username: username,
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

// get a kpis
const getOneKpis = async (id: any) => {
  try {
    const res = await prisma.kpis.findUnique({
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

// create a new kpi
const createKpi = async (data: any) => {
  console.log(data);
  let isExist;
  if (data && data.username && data.month && data.year)
    isExist = await checkKpiIsExist(data?.username, data?.month, data?.year);
  if (isExist === true) {
    return {
      success: false,
      message: KPI_EXIST,
    };
  } else {
    try {
      const res = await prisma.kpis.create({
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
  }
};

// update a kpi
const updateKpi = async (data: any) => {
  try {
    const { id, ...newObject } = data;
    const res = await prisma.kpis.update({
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

// delete a kpi
const deleteKpi = async (id: any) => {
  try {
    const res = await prisma.kpis.delete({
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

const checkKpiIsExist = async (
  username: string,
  month: number,
  year: number
) => {
  try {
    const kpi = await prisma.kpis.findFirst({
      where: {
        month: month,
        year: year,
        username: username,
      },
    });
    if (kpi) return true;
    return false;
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
};

export {
  getOneKpis,
  createKpi,
  updateKpi,
  deleteKpi,
  getAllKpis,
  getAllKpisByUsername,
};
