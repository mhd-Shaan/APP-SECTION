import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginuser: (state, action) => {
      state.user = action.payload;
    },
    logoutuser: (state) => {
      state.user = null;
    },
    updateUserCity: (state, action) => {
      if (state.user) {
      
        state.user.city = action.payload;
        
        
      }
    },
  },
});

export const { loginuser, logoutuser, updateUserCity } = userSlice.actions;
export default userSlice.reducer;
