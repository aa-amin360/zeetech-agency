import { Router } from "express";
import {
  getTestimonials,
  getFeaturedTestimonial,
  getEndorsements,
} from "../controllers/testimonialController.js";

const router = Router();

router.get("/", getTestimonials);
router.get("/featured", getFeaturedTestimonial);
router.get("/endorsements", getEndorsements);

export default router;
