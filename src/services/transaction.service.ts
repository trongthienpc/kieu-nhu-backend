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
const getAllTransactions = async (search: string) => {
  let res: any;
  try {
    // check search params type
    if (parseInt(search)) {
      res = await prisma.transactions.findMany({
        where: {
          AND: {
            status: true,
            OR: [
              {
                price: {
                  gte: parseInt(search),
                },
              },
              {
                quantity: {
                  gte: parseInt(search),
                },
              },
              {
                discount: {
                  gte: parseInt(search),
                },
              },
              {
                cash: {
                  gte: parseInt(search),
                },
              },
              {
                debt: {
                  gte: parseInt(search),
                },
              },
            ],
          },
        },
      });
    } else {
      res = await prisma.transactions.findMany({
        where: {
          AND: {
            status: true,
            OR: [
              {
                fullName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                customerName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                serviceName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      });
    }
    if (res)
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
const getAllTransactionsByUsername = async (
  username: string,
  search: string
) => {
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

// analyze transactions by a period time
// @params fromDate: Date, toDate: Date
const analyzeTransaction = async (fromDate: Date, toDate: Date) => {
  console.log(fromDate, toDate);
  const lstUsers = await prisma.users.findMany({});
  try {
    const res = await prisma.transactions.groupBy({
      by: ["username"],
      _sum: {
        price: true,
        quantity: true,
        discount: true,
        cash: true,
        debt: true,
      },
      where: {
        AND: {
          status: true,
          transactionDate: {
            gte: fromDate,
            lte: toDate,
          },
        },
      },
    });

    const newRes = res?.map((r) => {
      let user = lstUsers.filter((u) => u.username === r.username);
      return { ...r, fullName: user[0]?.name };
    });
    console.log(newRes);

    return {
      success: true,
      message: GET_SUCCESS,
      data: newRes,
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

// analyze transactions by period time, username
// @params fromDate: Date, toDate: Date, username: string
// @desc analyze transactions of a user in a period time
const analyzeTransactionByUserNameAndDate = async (
  fromDate: Date,
  toDate: Date,
  username: string
) => {
  console.log("analyzeTransactionByUserNameAndDate");
  console.log(fromDate, toDate, username);
  const lstUsers = await prisma.users.findMany({});
  try {
    const res = await prisma.transactions.groupBy({
      by: ["username"],
      _sum: {
        price: true,
        quantity: true,
        discount: true,
        cash: true,
        debt: true,
      },
      where: {
        AND: {
          status: true,
          transactionDate: {
            gte: fromDate,
            lte: toDate,
          },
          username: username,
        },
      },
    });

    const newRes = res?.map((r) => {
      let user = lstUsers.filter((u) => u.username === r.username);
      return { ...r, fullName: user[0]?.name };
    });
    // console.log(newRes);

    return {
      success: true,
      message: GET_SUCCESS,
      data: newRes,
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

export {
  getAllTransactions,
  getAllTransactionsByUsername,
  getOneTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  analyzeTransaction,
  analyzeTransactionByUserNameAndDate,
};
