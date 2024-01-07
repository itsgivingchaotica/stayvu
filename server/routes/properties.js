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
router.get(
  "/images/retrieve/paths/:propertyId",
  PropertiesController.getPropertyImagesByPaths
);
router.post("/new/:hostId", PropertiesController.postNewProperty);
router.post(
  "/images/single/:propertyId/:imagePath",
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
router.post(
  "/images/toDb/:propertyId/:imagePath",
  PropertiesController.postNewPropertyImageToDb
);
router.patch("/edit/:propertyId", PropertiesController.patchPropertyById);
router.delete("/delete/:propertyId", PropertiesController.deletePropertyById);
router.delete(
  "/delete/images/:propertyId/:index",
  PropertiesController.deletePropertyImage
);

export default router;
