import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  isProfileComplete: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.isProfileComplete = action.payload.isProfileComplete;
    },

    clearUser: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isProfileComplete = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
