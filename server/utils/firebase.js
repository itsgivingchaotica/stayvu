import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { auth } from "../config/firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "../config/dotenv.js";

const uploadImage = async (file, propertyId) => {
  const storageFB = getStorage();

  await signInWithEmailAndPassword(
    auth,
    process.env.FIREBASE_USER,
    process.env.FIREBASE_AUTH
  );

  const dateTime = Date.now();
  const fileName = `images/${propertyId}/${dateTime}`;
  const storageRef = ref(storageFB, fileName);
  const metadata = {
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
    const dateTime = Date.now();
    const fileName = `images/${propertyId}/${dateTime}`;
    const storageRef = ref(storageFB, fileName);
    const metadata = {
      contentType: file.mimetype,
    };

    await uploadBytesResumable(storageRef, file.buffer, metadata);
    buildImages.push(fileName);
  }

  return buildImages;
};

export { uploadImage, uploadMultipleImages };
