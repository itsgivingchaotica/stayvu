import express from "express";

import PropertiesController from "../controllers/properties.js";
import { upload, uploadMultiple } from "../utils/multer.js";

const router = express.Router();

router.get("/:userId", PropertiesController.getUserProperties);
router.get("/view/:propertyId", PropertiesController.getPropertyById);
router.get(
  "/images/retrieve/:propertyId",
  PropertiesController.getPropertyImages
);
router.post("/new/:hostId", PropertiesController.postNewProperty);
router.post(
  "/images/single/:propertyId",
  (req, res, next) => {
    upload(req, res, next);
  },
  PropertiesController.postNewPropertySingleImage
);
router.post(
  "/images/multiple/:propertyId",
  (req, res, next) => {
    uploadMultiple(req, res, next);
  },
  PropertiesController.postNewPropertyImages
);
router.delete("/delete/:propertyId", PropertiesController.deletePropertyById);

export default router;
