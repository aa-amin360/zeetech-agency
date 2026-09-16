import { ProjectModel } from "../models/projectModel.js";

export const getProjects = async (req, res, next) => {
  try {
    const projects = await ProjectModel.getAll();
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.getById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};
