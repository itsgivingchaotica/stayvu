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
    } catch (error) {
      console.error("Error fetching single property", error);
      throw error;
    }
  }
);

const fetchUserPropertyImages = createAsyncThunk(
  "properties/fetchUserPropertyImages",
  async (propertyId, { dispatch }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/properties/images/retrieve/${propertyId}`,
        {},
        { withCredentials: true }
      );
      return { propertyId, images: res.data };
    } catch (error) {
      console.error("Error fetching property images", error);
      throw error;
    }
  }
);

export const createNewUserProperty = createAsyncThunk(
  "properties/createNewUserProperty",
  async ({ formData, amenities, imageFiles }, { dispatch }) => {
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

      const res = await axios.post(
        `${API_URL}/api/properties/new/${host_id}`,
        {
          formData,
          amenities,
        },
        { withCredentials: true }
      );

      console.log(res.data.property.id, "add property formData from redux");

      let imagesRes = null;
      console.log(imageFiles, "imagefiles from redux");
      try {
        if (imageFiles.length > 1) {
          console.log("Uploading multiple images");
          imagesRes = await axios.post(
            `${API_URL}/api/properties/images/multiple/${res.data.property.id}`,
            { imageFiles },
            { withCredentials: true }
          );
        } else {
          const formData = new FormData();
          formData.append("image", imageFiles[0]);
          // console.log("Uploading one image", formData);
          imagesRes = await axios.post(
            `${API_URL}/api/properties/images/single/${res.data.property.id}`,
            formData,
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
      // const combinedData = {
      //   ...res.data.property,
      //   ...res.data.amenities,
      //   images: imagesRes.data,
      // };
      const propertyId = res.data.property.id;
      // console.log(combinedData, "full data for property");
      // dispatch(addUserPropertyToList(combinedData));
      // Wait for the addUserPropertyToList action to complete
      await dispatch(fetchUserPropertyImages(propertyId));
    } catch (error) {
      console.error("Error creating new user property", error);
      console.log("Error details:", error.response.data);
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
  currentProperty: [],
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
    addUserPropertyToList(state, action) {
      state.userProperties.push(action.payload);
    },
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
      .addCase(fetchUserPropertyImages.fulfilled, (state, action) => {
        const { propertyId, images } = action.payload;

        const propertyIndex = state.userProperties.findIndex(
          (property) => property.id === propertyId
        );

        if (propertyIndex !== -1) {
          state.userProperties[propertyIndex] = {
            ...state.userProperties[propertyIndex],
            images: images,
          };
        }
      });
  },
});

export const {
  setUserProperties,
  setCurrentProperty,
  addUserPropertyToList,
  setError,
} = propertiesSlice.actions;
export default propertiesSlice.reducer;
