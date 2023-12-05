import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
  list,
} from "firebase/storage";
import { auth } from "../config/firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "../config/dotenv.js";

const uploadImage = async (file, propertyId, imagePath) => {
  const storageFB = getStorage();

  console.log(imagePath, "uploading image to firebase");

  await signInWithEmailAndPassword(
    auth,
    process.env.FIREBASE_USER,
    process.env.FIREBASE_AUTH
  );

  // const dateTime = Date.now();
  const fileName = `images/${propertyId}/${imagePath}`;
  const storageRef = ref(storageFB, fileName);
  const metadata = {
    cacheControl: "public, max-age=900",
    contentType: file.type,
  };
  await uploadBytesResumable(storageRef, file.buffer, metadata);
  return fileName;
};

const uploadMultipleImages = async (files, propertyId) => {
  const storageFB = getStorage();

  await signInWithEmailAndPassword(
    auth,
    process.env.FIREBASE_USER,
    process.env.FIREBASE_AUTH
  );

  const buildImages = [];

  for (const file of files) {
    // const dateTime = Date.now();
    const fileName = `images/${propertyId}`;
    const storageRef = ref(storageFB, fileName);
    const metadata = {
      cacheControl: "public, max-age=900",
      contentType: file.mimetype,
    };

    await uploadBytesResumable(storageRef, file.buffer, metadata);
    buildImages.push(fileName);
  }

  return buildImages;
};

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

const getImages = async (propertyId) => {
  try {
    const storageFB = getStorage();
    const propertyImagesRef = ref(storageFB, `images/${propertyId}`);

    const allImages = await getPropertyImagesRecursive(propertyImagesRef);

    console.log(allImages, "from controller getting all image");
    return allImages;
  } catch (error) {
    console.log(error);
  }
};

const deleteImage = async (propertyId, imagepath) => {
  const storageFB = getStorage();

  // Construct the full path to the file
  const filePath = `images/${propertyId}/${imagepath}`;

  // Get a reference to the file
  const fileRef = ref(storageFB, filePath);

  try {
    // Delete the file
    await deleteObject(fileRef);
    console.log(`Successfully deleted ${filePath}`);
  } catch (error) {
    console.error(`Error deleting ${filePath}: ${error.message}`);
  }
};

export { uploadImage, uploadMultipleImages, getImages, deleteImage };
