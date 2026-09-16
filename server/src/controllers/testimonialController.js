import { TestimonialModel } from "../models/testimonialModel.js";

export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await TestimonialModel.getAll();
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedTestimonial = async (req, res, next) => {
  try {
    const featured = await TestimonialModel.getFeatured();
    res.status(200).json({
      success: true,
      data: featured,
    });
  } catch (error) {
    next(error);
  }
};

export const getEndorsements = async (req, res, next) => {
  try {
    const all = await TestimonialModel.getAll();
    const endorsements = all.filter((t) => !t.is_featured);
    res.status(200).json({
      success: true,
      count: endorsements.length,
      data: endorsements,
    });
  } catch (error) {
    next(error);
  }
};
