import { createSlice } from "@reduxjs/toolkit";
export const authenticationSlice = createSlice({
  name: "authentication_user",
  initialState: {
    name: null,
    email: null,
    isAuthenticated: false,
    isAdmin: false,
    usertype: null,
  },
  reducers: {
    set_Authentication: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isAdmin = action.payload.isAdmin;
    },
  },
});
export const { set_Authentication } = authenticationSlice.actions;
export default authenticationSlice.reducer;
