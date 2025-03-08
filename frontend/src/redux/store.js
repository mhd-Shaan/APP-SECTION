import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice";
// import contractorReducer from "./contractorslice";

const store = configureStore({
  reducer: {
    user: userReducer
  },
});

export default store;