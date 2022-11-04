import {
  DELETE_SUCCESS,
  ERROR,
  GET_SUCCESS,
  POST_SUCCESS,
  UPDATE_SUCCESS,
} from "./../configs/constants";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get all transactions
const getAllTransactions = async () => {
  try {
    const res = await prisma.transactions.findMany({
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

// get all transactions by username
const getAllTransactionsByUsername = async (username: string) => {
  try {
    const res = await prisma.transactions.findMany({
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

// get a transactions
const getOneTransactions = async (id: any) => {
  try {
    const res = await prisma.transactions.findUnique({
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

// create a new transaction
const createTransaction = async (data: any) => {
  try {
    const res = await prisma.transactions.create({
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

// update a transaction
const updateTransaction = async (data: any) => {
  const { id, ...newObject } = data;
  console.log(data);
  try {
    const res = await prisma.transactions.update({
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

// delete a transaction
const deleteTransaction = async (data: any) => {
  try {
    const res = await prisma.transactions.delete({
      where: {
        id: data.id,
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
  getAllTransactions,
  getAllTransactionsByUsername,
  getOneTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
