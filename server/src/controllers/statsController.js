import { StatsModel } from "../models/statsModel.js";

export const getStats = async (req, res, next) => {
  try {
    const stats = await StatsModel.getAll();
    res.status(200).json({
      success: true,
      count: stats.length,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
