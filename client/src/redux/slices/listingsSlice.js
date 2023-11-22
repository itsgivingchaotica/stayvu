import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_SERVER_URL
    : "http://localhost:3001";

export const filterListingsBySearch = createAsyncThunk(
  "listings/filterListingsBySearch",
  async ({ startDate, endDate }, { dispatch }) => {
    console.log("Action Creator: Start Date -", startDate);
    console.log("Action Creator: End Date -", endDate);
    try {
      const res = await axios.get(
        `${API_URL}/api/listings/${startDate}/${endDate}`,
        {},
        { withCredentials: true }
      );
      console.log(`${API_URL}/api/listings/${startDate}/${endDate}`);
      dispatch(setFilteredListings(res.data));
      //   const userData = res.data;
      //   return userData;
    } catch (error) {
      console.error("Error fetching user properties:", error);
      throw error;
    }
  }
);

export const fetchUserListingById = createAsyncThunk(
  "listings/fetchUserListingById",
  async ({ listingId }, { dispatch }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/listings/view/${listingId}`,
        {},
        { withCredentials: true }
      );
      dispatch(setCurrentListing(res.data));
    } catch (error) {
      console.error("Error fetching single property", error);
      throw error;
    }
  }
);

export const createNewListing = createAsyncThunk(
  "listings/createNewListing",
  async ({ title, propertyId, price }, { dispatch }) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/listings/${propertyId}`,
        {
          title,
          propertyId,
          price,
        },
        { withCredentials: true }
      );
      dispatch(addUserListingToList(res.data));
    } catch (error) {
      console.error("Error creating new user property", error);
      throw error;
    }
  }
);

const initialState = {
  filteredListings: [],
  userListings: [],
  currentListing: null,
  newListing: null,
  error: null,
};

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    setFilteredListings: (state, action) => {
      state.filteredListings = action.payload;
    },
    setUserListings: (state, action) => {
      state.userListings = action.payload;
    },
    setCurrentListing: (state, action) => {
      state.currentProperty = action.payload;
    },
    addUserListingToList(state) {
      if (state.newListing) {
        state.userListings.push(state.newListing);
      }
      newListing = null;
    },
    clearFilteredListings: (state, action) => {
      state.filteredListings = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(filterListingsBySearch.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(filterListingsBySearch.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.loggedInUser = action.payload;
      })
      .addCase(filterListingsBySearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setFilteredListings, setError, clearFilteredListings } = listingsSlice.actions;
export default listingsSlice.reducer;
