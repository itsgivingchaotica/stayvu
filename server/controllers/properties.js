import { pool } from "../config/database.js";
import { listAll, getDownloadURL } from "firebase/storage";
import { getStorage, ref } from "firebase/storage";
import { uploadImage, uploadMultipleImages } from "../utils/firebase.js";
import { response } from "express";

const getUserProperties = async (request, response) => {
  try {
    // Validate and parse userId as an integer
    const parsedUserId = parseInt(request.params.userId);
    if (isNaN(parsedUserId)) {
      throw new Error("Invalid userId");
    }

    // Your SQL query with the parsed userId
    const properties = await pool.query(
      "SELECT  properties.id as id, properties.host_id, properties.address1, properties.address2, properties.city, properties.state, properties.country, properties.zipcode, properties.rating, properties.num_beds, properties.num_baths, properties.num_bedrooms, properties.property_type, propertyAmenities.id as amenities_id, propertyAmenities.wifi, propertyAmenities.dryer, propertyAmenities.washer, propertyAmenities.iron, propertyAmenities.air_conditioner, propertyAmenities.heater, propertyAmenities.pool, propertyAmenities.grill, propertyAmenities.hot_tub, propertyAmenities.free_parking, propertyAmenities.ev_charger, propertyAmenities.beach_front, propertyAmenities.water_front, propertyAmenities.mountain_view, propertyAmenities.city_view, propertyAmenities.gym, propertyAmenities.elevator, propertyAmenities.wheelchair_accessible, propertyAmenities.pet_friendly, propertyAmenities.smoking_allowed FROM properties LEFT JOIN propertyAmenities ON properties.id = propertyAmenities.property_id WHERE properties.host_id = $1",
      [parsedUserId]
    );

    console.log(properties.rows);

    return response.status(200).json(properties.rows);
  } catch (err) {
    console.error("⚠️ error fetching user properties", err);
    throw err; // Rethrow the error to handle it in the calling code
  }
};

const getPropertyById = async (request, response) => {
  try {
    const propertyId = parseInt(request.params.propertyId);
    const singleProperty = await pool.query(
      "SELECT * FROM properties WHERE id = $1",
      [propertyId]
    );
    response.status(200).json(singleProperty.rows[0]);
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

const deletePropertyById = async (request, response) => {
  try {
    const propertyId = parseInt(request.params.propertyId);
    const deletedProperty = await pool.query(
      "DELETE FROM properties WHERE id = $1",
      [propertyId]
    );
    response.status(200).json({ message: "property deleted" });
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

const getPropertyImages = async (request, response) => {
  const propertyId = parseInt(request.params.propertyId);
  try {
    const storageFB = getStorage();
    const imagesRef = ref(storageFB, `images/${propertyId}`);
    const imageList = await listAll(imagesRef);
    const imageUrls = await Promise.all(
      imageList.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return url;
      })
    );
    response.status(200).json(imageUrls);
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

const postNewPropertyImages = async (request, response) => {
  console.log("post new property images hit");
  try {
    const files = request.files;
    console.log("several files");

    const propertyId = parseInt(request.params.propertyId);
    console.log(propertyId);
    let buildImages = await uploadMultipleImages(files, propertyId);

    response.send({
      status: "multiple image upload success",
      imageNames: buildImages,
      propertyId: propertyId,
    });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const postNewPropertySingleImage = async (request, response) => {
  const file = {
    type: request.file.mimetype,
    buffer: request.file.buffer,
  };
  try {
    const propertyId = parseInt(request.params.propertyId);
    const buildImage = await uploadImage(file, propertyId);
    response.send({
      status: "single image upload success",
      imageName: buildImage,
      propertyId: propertyId,
    });
  } catch (err) {
    console.log(err);
  }
};

//post a new property with its images and amenities
const postNewProperty = async (request, response) => {
  const hostId = parseInt(request.params.hostId);
  const { formData, amenities } = request.body;

  const {
    host_id,
    address1,
    address2,
    city,
    state,
    country,
    zipcode,
    num_beds,
    num_baths,
    num_bedrooms,
    property_type,
  } = formData;

  const parsedNumBeds = parseInt(num_beds);
  const parsedNumBaths = parseInt(num_baths);
  const parsedNumBedrooms = parseInt(num_bedrooms);
  try {
    //add property to properties table
    const property = await pool.query(
      "INSERT INTO properties (host_id, address1, address2, city, state, country, zipcode, num_beds, num_baths, num_bedrooms, property_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        hostId,
        address1,
        address2,
        city,
        state,
        country,
        zipcode,
        parsedNumBeds,
        parsedNumBaths,
        parsedNumBedrooms,
        property_type,
      ]
    );

    console.log(property.rows[0], "new property from controller");

    const propertyId = property.rows[0].id;

    console.log(propertyId, "new property id from controller");

    const {
      wifi,
      dryer,
      washer,
      iron,
      air_conditioner,
      heater,
      pool_available,
      grill,
      hot_tub,
      free_parking,
      ev_charger,
      beach_front,
      water_front,
      mountain_view,
      city_view,
      gym,
      elevator,
      wheelchair_accessible,
      pet_friendly,
      smoking_allowed,
    } = amenities;

    //add all amenities to propertyAmenities table
    const addedAmenities = await pool.query(
      "INSERT INTO propertyAmenities (property_id, wifi, dryer, washer, iron, air_conditioner, heater, pool, grill, hot_tub, free_parking, ev_charger, beach_front, water_front, mountain_view, city_view, gym, elevator, wheelchair_accessible, pet_friendly, smoking_allowed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *",
      [
        propertyId,
        wifi,
        dryer,
        washer,
        iron,
        air_conditioner,
        heater,
        pool_available,
        grill,
        hot_tub,
        free_parking,
        ev_charger,
        beach_front,
        water_front,
        mountain_view,
        city_view,
        gym,
        elevator,
        wheelchair_accessible,
        pet_friendly,
        smoking_allowed,
      ]
    );
    console.log(addedAmenities.rows[0], "from controller");
    //each image is an array of urls
    // Add images to listingImages table
    // const addedImages = [];
    // for (const image of imageFiles) {
    //   try {
    //     const addedImage = await pool.query(
    //       "INSERT INTO listingImages (property_id, path) VALUES ($1, $2) RETURNING *",
    //       [propertyId, image.path] // Assuming 'path' contains the file URL or path
    //     );
    //     addedImages.push(addedImage.rows[0]);
    //   } catch (error) {
    //     response.status(409).json({ error: error.message });
    //   }
    // }
    response.status(200).json({
      property: property.rows[0],
      amenities: addedAmenities.rows[0],
      // images: addedImages.rows[0],
    });
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

export default {
  getUserProperties,
  postNewProperty,
  getPropertyById,
  getPropertyImages,
  postNewPropertyImages,
  postNewPropertySingleImage,
  deletePropertyById,
};
