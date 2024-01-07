import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_BACKEND_URL;

export const fetchUserProperties = createAsyncThunk(
  "properties/fetchUserProperties",
  async ({ userId }, { dispatch }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/properties/${userId}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data, "fetching user properties from redux");
      dispatch(setUserProperties(res.data));
      //   const userData = res.data;
      //   return userData;
      return res.data;
    } catch (error) {
      console.error("Error fetching user properties:", error);
      throw error;
    }
  }
);

export const fetchUserPropertyById = createAsyncThunk(
  "properties/fetchUserPropertyById",
  async ({ propertyId }, { dispatch }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/properties/view/${propertyId}`,
        {},
        { withCredentials: true }
      );
      dispatch(setCurrentProperty(res.data));
      // console.log(res.data, "is the current property with id", res.data.id);
    } catch (error) {
      console.error("Error fetching single property", error);
      throw error;
    }
  }
);

export const fetchUserPropertyImages = createAsyncThunk(
  "properties/fetchUserPropertyImages",
  async ({ propertyId }, { dispatch }) => {
    console.log(
      propertyId,
      "getting property Id for the property being edited"
    );
    try {
      const res = await axios.get(
        `${API_URL}/api/properties/images/retrieve/${propertyId}`,
        {},
        { withCredentials: true }
      );
      console.log(
        res.data,
        "data was fetched for the existing user property images"
      );
      return res.data;
      // dispatch(setCurrentPropertyImages(res.data));
    } catch (error) {
      console.error("Error fetching property images", error);
      throw error;
    }
  }
);

export const removeCurrentProperty = createAsyncThunk(
  "properties/removeCurrentProperty",
  async (_, { dispatch }) => {
    try {
      dispatch(setCurrentProperty(null));
    } catch (error) {
      console.error("Error removing current property", error);
      throw error;
    }
  }
);

export const createNewUserProperty = createAsyncThunk(
  "properties/createNewUserProperty",
  async ({ formData, amenities, imageFiles }, { dispatch }) => {
    console.log(amenities, "from redux");
    try {
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

      console.log(formData, "formData from redux");
      console.log(amenities, "amenities from redux");
      let res;
      try {
        res = await axios.post(
          `${API_URL}/api/properties/new/${host_id}`,
          {
            formData,
            amenities,
          },
          { withCredentials: true }
        );
        console.log(res.data.property.id, "add property formData from redux");
      } catch (error) {
        console.log(error);
      }
      console.log(imageFiles, "imagefiles from redux");
      try {
        // if (imageFiles.length > 1) {
        //   console.log("Uploading multiple images");
        //   const imagesRes = await axios.post(
        //     `${API_URL}/api/properties/images/multiple/${res.data.property.id}`,
        //     { imageFiles },
        //     { withCredentials: true }
        //   );
        // } else {
        // formData.append(imageFiles[0]);
        // console.log("Uploading one image", formData);
        for (let i = 0; i < imageFiles.length; i++) {
          const formData = new FormData();
          formData.append("image", imageFiles[i]);
          console.log(imageFiles[i].name, "uploading the image");
          const imagesRes = await axios.post(
            `${API_URL}/api/properties/images/single/${res.data.property.id}/${imageFiles[i].name}`,
            formData,
            { withCredentials: true }
          );
        }
        // }
        for (let i = 0; i < imageFiles.length; i++) {
          const imagesToDb = await axios.post(
            `${API_URL}/api/properties/images/toDb/${res.data.property.id}/${imageFiles[i].name}`,
            { withCredentials: true }
          );
        }
        // console.log(imagesRes.data, "image(s) were added via redux");
      } catch (imageUploadError) {
        console.error("Error uploading images", imageUploadError);
        console.log("Error details:", imageUploadError.response.data);
        throw imageUploadError;
      }
      let imageGetRes;
      try {
        imageGetRes = await axios.get(
          `${API_URL}/api/properties/images/retrieve/${res.data.property.id}`,
          {},
          { withCredentials: true }
        );
        // console.log(res.data, "fetching the images for the user");
      } catch (error) {
        console.error("Error fetching property images", error);
        throw error;
      }
      const propertyId = res.data.property.id;
      await dispatch(fetchUserPropertyImages(propertyId));
      await dispatch(fetchUserProperties({ userId: host_id }));
    } catch (error) {
      console.error("Error creating new user property", error);
      console.log("Error details:", error.response.data);
      throw error;
    }
  }
);

export const fetchUserPropertyImagesByPaths = createAsyncThunk(
  "properties/fetchUserPropertyImagesByPath",
  async ({ propertyId }, { dispatch }) => {
    try {
      console.log(propertyId, "getting property Id paths");
      const res = await axios.get(
        `${API_URL}/api/properties/images/retrieve/paths/${propertyId}`,
        {},
        { withCredentials: true }
      );
      const data = res.data;
      console.log(
        data,
        "data was fetched for the existing user property images"
      );
      return data;
      // dispatch(setCurrentPropertyImages(res.data));
    } catch (error) {
      console.error("Error fetching property images", error);
      throw error;
    }
  }
);

//edit user property
export const editUserPropertyById = createAsyncThunk(
  "properties/editUserProperty",
  async (
    { formData, amenities, imageFiles, propertyId, imageIndexesToDelete },
    { dispatch }
  ) => {
    try {
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

      console.log(imageIndexesToDelete, "image indexes to delete from redux");

      const res = await axios.patch(
        `${API_URL}/api/properties/edit/${propertyId}`,
        {
          formData,
          amenities,
        },
        { withCredentials: true }
      );
      console.log(res, "res from edit property");

      // Delete Images, if any
      if (imageIndexesToDelete.length > 0) {
        console.log("DELETETING " + imageIndexesToDelete.length + "IMAGESs");
        try {
          for (let i = 0; i < imageIndexesToDelete.length; i++) {
            console.log("deleting image at index ", imageIndexesToDelete[i]);
            const index = imageIndexesToDelete[i];
            const imagesRes = await axios.delete(
              `${API_URL}/api/properties/delete/images/${propertyId}/${index}`,
              { withCredentials: true }
            );
            console.log(imagesRes.data, "image was deleted via redux");
          }
        } catch (imageDeleteError) {
          console.error("Error deleting images", imageDeleteError);
          console.log(
            "Error details:",
            imageDeleteError.response?.data || "No error details available"
          );
          throw imageDeleteError;
        }
      }

      // Image Upload
      if (imageFiles.length > 0) {
        try {
          for (let i = 0; i < imageFiles.length; i++) {
            const formData = new FormData();
            formData.append("image", imageFiles[i]);
            console.log(imageFiles[i].name, "uploading the image");
            const imagesRes = await axios.post(
              `${API_URL}/api/properties/images/single/${propertyId}/${imageFiles[i].name}`,
              formData,
              { withCredentials: true }
            );
            console.log(imagesRes.data, "image was added via redux");
          }
        } catch (imageUploadError) {
          console.error("Error uploading images", imageUploadError);
          console.log(
            "Error details:",
            imageUploadError.response?.data || "No error details available"
          );
          throw imageUploadError;
        }
      }

      // Fetch Images
      let imageGetRes;
      try {
        imageGetRes = await axios.get(
          `${API_URL}/api/properties/images/retrieve/${res.data.property.id}`,
          {},
          { withCredentials: true }
        );
        console.log(imageGetRes.data, "fetching the images for the user");
        return imageGetRes.data;
      } catch (imageFetchError) {
        console.error("Error fetching property images", imageFetchError);
        console.log(
          "Error details:",
          imageFetchError.response?.data || "No error details available"
        );
        throw imageFetchError;
      }

      // Dispatch Actions to Refresh properties and their images for image carousel
      // await dispatch(fetchUserPropertyImages(propertyId));
      // await dispatch(fetchUserProperties({ userId: host_id }));
      setCurrentProperty([]);
    } catch (error) {
      console.error(`Error editing user property ${propertyId}`, error);
      console.log(
        "Error details:",
        error.response?.data || "No error details available"
      );
      throw error;
    }
  }
);

export const deleteUserPropertyImage = createAsyncThunk(
  "properties/deleteUserPropertyImages",
  async ({ propertyId, index }, { dispatch, getState }) => {
    try {
      const state = getState();
      const currentPropertyImages = state.properties.currentPropertyImages;
      console.log(index, "index to delete from images");
      if (index >= 0 && index < currentPropertyImages.length) {
        const imagepath = currentPropertyImages[index]?.imagepath;

        if (imagepath) {
          const imagesRes = await axios.delete(
            `${API_URL}/api/properties/delete/images/${propertyId}`,
            { withCredentials: true }
          );
          dispatch(deleteUserPropertyImage.fulfilled(index));
        } else {
          console.error("Error: Image path not found at the specified index");
        }
      } else {
        console.error("Error: Index out of bounds");
      }
    } catch (error) {
      console.error("Error deleting user property images", error);
      throw error;
    }
  }
);

export const deleteUserProperty = createAsyncThunk(
  "properties/deleteUserProperty",
  async ({ propertyId }, { dispatch }) => {
    try {
      const res = await axios.delete(
        `${API_URL}/api/properties/delete/${propertyId}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
    } catch (error) {
      console.error("Error deleting user property", error);
      throw error;
    }
  }
);

const initialState = {
  userProperties: [],
  currentProperty: null,
  currentPropertyImages: [],
  error: null,
};

const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setUserProperties: (state, action) => {
      state.userProperties = action.payload;
    },
    setCurrentProperty: (state, action) => {
      state.currentProperty = action.payload;
    },
    addUserPropertyToList: (state, action) => {
      state.userProperties.push(action.payload);
    },
    // setCurrentPropertyImages: (state, action) => {
    //   state.currentPropertyImages = action.payload;
    // },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProperties.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProperties.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.loggedInUser = action.payload;
      })
      // .addCase(fetchUserProperties.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = action.error.message;
      // })
      .addCase(fetchUserPropertyById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserPropertyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.loggedInUser = action.payload;
      })
      .addCase(fetchUserPropertyById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createNewUserProperty.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createNewUserProperty.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.loggedInUser = action.payload
      })
      .addCase(createNewUserProperty.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // .addCase(fetchUserPropertyImages.fulfilled, (state, action) => {
      //   const { propertyId, images } = action.payload;

      //   const propertyIndex = state.userProperties.findIndex(
      //     (property) => property.id === propertyId
      //   );

      //   if (propertyIndex !== -1) {
      //     state.userProperties[propertyIndex] = {
      //       ...state.userProperties[propertyIndex],
      //       images: images,
      //     };
      //   }
      // });
      .addCase(fetchUserPropertyImages.fulfilled, (state, action) => {
        console.log("Fulfilled Action Payload:", action.payload);
        state.currentPropertyImages = action.payload;
        state.status = "succeeded";
      })
      .addCase(editUserPropertyById.fulfilled, (state, action) => {
        state.currentPropertyImages = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteUserPropertyImage.fulfilled, (state, action) => {
        // Assuming the payload contains the deleted index
        const deletedIndex = action.payload;

        // Ensure the index is valid
        if (
          deletedIndex >= 0 &&
          deletedIndex < state.currentPropertyImages.length
        ) {
          // Use filter to create a new array excluding the item at the specified index
          state.currentPropertyImages = state.currentPropertyImages.filter(
            (_, index) => index !== deletedIndex
          );
        }
      });
  },
});

export const {
  setUserProperties,
  setCurrentProperty,
  addUserPropertyToList,
  setCurrentPropertyImages,
  setError,
} = propertiesSlice.actions;
export default propertiesSlice.reducer;
