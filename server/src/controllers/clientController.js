import { ClientModel } from "../models/clientModel.js";

export const getClients = async (req, res, next) => {
  try {
    const clients = await ClientModel.getAll();
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};
