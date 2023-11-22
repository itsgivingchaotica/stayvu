import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import propertiesReducer from "./slices/propertiesSlice";
import listingsReducer from "./slices/listingsSlice";

const rootReducer = combineReducers({
  user: userReducer,
  properties: propertiesReducer,
  listings: listingsReducer,
});

export default rootReducer;
