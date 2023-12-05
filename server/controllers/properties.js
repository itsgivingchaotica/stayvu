import { pool } from "../config/database.js";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  getImages,
} from "../utils/firebase.js";
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
      "SELECT properties.id as id, properties.host_id, properties.address1, properties.address2, properties.city, properties.state, properties.country, properties.zipcode, properties.rating, properties.num_beds, properties.num_baths, properties.num_bedrooms, properties.property_type, propertyAmenities.id as amenities_id, propertyAmenities.wifi, propertyAmenities.dryer, propertyAmenities.washer, propertyAmenities.iron, propertyAmenities.air_conditioner, propertyAmenities.heater, propertyAmenities.pool, propertyAmenities.grill, propertyAmenities.hot_tub, propertyAmenities.free_parking, propertyAmenities.ev_charger, propertyAmenities.beach_front, propertyAmenities.water_front, propertyAmenities.mountain_view, propertyAmenities.city_view, propertyAmenities.gym, propertyAmenities.elevator, propertyAmenities.wheelchair_accessible, propertyAmenities.pet_friendly, propertyAmenities.smoking_allowed FROM properties LEFT JOIN propertyAmenities ON properties.id = propertyAmenities.property_id WHERE properties.id = $1",
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

// const urlCache = new Map();

const getPropertyImagesRecursive = async (directoryRef) => {
  const imageList = await listAll(directoryRef);

  const imageUrls = await Promise.all(
    imageList.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return url;
    })
  );

  const subdirectoryPromises = imageList.prefixes.map(
    async (subdirectoryRef) => {
      return getPropertyImagesRecursive(subdirectoryRef);
    }
  );

  const subdirectoryImageUrls = await Promise.all(subdirectoryPromises);

  return imageUrls.concat(...subdirectoryImageUrls);
};

const getPropertyImages = async (request, response) => {
  const propertyId = parseInt(request.params.propertyId);
  console.log("Getting property images for property id", propertyId);

  try {
    const storageFB = getStorage();
    const propertyImagesRef = ref(storageFB, `images/${propertyId}`);

    const allImages = await getPropertyImagesRecursive(propertyImagesRef);

    console.log(allImages, "from controller getting all image");
    response.status(200).json(allImages);
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

const getPropertyImagesByPaths = async (request, response) => {
  console.log("getting images paths");
  try {
    const propertyId = parseInt(request.params.propertyId);

    // Fetch images from the database
    const imagesResult = await pool.query(
      "SELECT * FROM propertyImages WHERE property_id = $1",
      [propertyId]
    );

    console.log(imagesResult.rows, "images from paths via controller");

    // Fetch images from Firebase storage
    // const imagesByPathsResult = await fetchImages(propertyId);
    const imagesByPathsResult = await getImages(propertyId);

    const combined = imagesResult.rows.map((row, index) => {
      const imagesByPaths = imagesByPathsResult[index] || []; // If the array is shorter, default to an empty array
      console.log(imagesByPaths, "images by paths");
      return {
        ...row, // Assuming row is an object, adjust accordingly if it's an array
        imagesByPaths,
      };
    });
    response.status(200).json(combined);
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
    const imagePath = request.params.imagePath;
    const buildImage = await uploadImage(file, propertyId, imagePath);
    response.send({
      status: "single image upload success",
      imageName: buildImage,
      propertyId: propertyId,
      imagePath: imagePath,
    });
  } catch (err) {
    console.log(err);
  }
};

const postNewPropertyImageToDb = async (request, response) => {
  const propertyId = parseInt(request.params.propertyId);
  const imagePath = request.params.imagePath;
  console.log(imagePath, "image path");
  try {
    const addedImage = await pool.query(
      "INSERT INTO propertyImages (property_id, imagePath) VALUES ($1, $2) RETURNING *",
      [propertyId, imagePath] // Assuming 'path' contains the file URL or path
    );
    response.status(200).json({ message: "image added to db" });
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

const deletePropertyImage = async (request, response) => {
  try {
    const propertyId = parseInt(request.params.propertyId);
    const imagepath = request.params.imagepath;
    const buildImage = await deleteImage(propertyId, imagepath);
    response.send({
      status: "single image upload success",
      imageName: buildImage,
      propertyId: propertyId,
    });
  } catch (err) {
    console.log(err);
  }
};

const patchPropertyById = async (request, response) => {
  const propertyId = parseInt(request.params.propertyId);
  const { formData, amenities } = request.body;

  console.log(amenities, "fromrequest body");
  const {
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
    // Update property in the properties table
    const updatedProperty = await pool.query(
      "UPDATE properties SET address1 = $1, address2 = $2, city = $3, state = $4, country = $5, zipcode = $6, num_beds = $7, num_baths = $8, num_bedrooms = $9, property_type = $10 WHERE id = $11 RETURNING *",
      [
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
        propertyId,
      ]
    );

    console.log(updatedProperty.rows[0], "updated property from controller");

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

    console.log(amenities, "fromcontroller this is the amentiies");
    // Update amenities in the propertyAmenities table
    const updatedAmenities = await pool.query(
      "UPDATE propertyAmenities SET wifi = $1, dryer = $2, washer = $3, iron = $4, air_conditioner = $5, heater = $6, pool = $7, grill = $8, hot_tub = $9, free_parking = $10, ev_charger = $11, beach_front = $12, water_front = $13, mountain_view = $14, city_view = $15, gym = $16, elevator = $17, wheelchair_accessible = $18, pet_friendly = $19, smoking_allowed = $20 WHERE property_id = $21 RETURNING *",
      [
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
        propertyId,
      ]
    );
    console.log(updatedAmenities.rows[0], "updated amenities from controller");

    response.status(200).json({
      property: updatedProperty.rows[0],
      amenities: updatedAmenities.rows[0],
    });
  } catch (error) {
    response.status(409).json({ error: error.message });
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
  getPropertyImagesByPaths,
  postNewPropertyImages,
  postNewPropertySingleImage,
  postNewPropertyImageToDb,
  patchPropertyById,
  deletePropertyById,
  deletePropertyImage,
};
