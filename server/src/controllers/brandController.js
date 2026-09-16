import { BrandModel } from "../models/brandModel.js";

export const getBrands = async (req, res, next) => {
  try {
    const { row } = req.query;

    if (row) {
      const brandsByRow = await BrandModel.getByRow(row);
      return res.status(200).json({
        success: true,
        count: brandsByRow.length,
        data: brandsByRow,
      });
    }

    const allBrands = await BrandModel.getAll();
    const row1 = allBrands.filter((b) => b.row === 1);
    const row2 = allBrands.filter((b) => b.row === 2);

    res.status(200).json({
      success: true,
      data: { row1, row2 },
    });
  } catch (error) {
    next(error);
  }
};
