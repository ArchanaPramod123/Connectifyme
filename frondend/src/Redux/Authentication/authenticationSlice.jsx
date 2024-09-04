import { createSlice } from "@reduxjs/toolkit";
export const authenticationSlice = createSlice({
  name: "authentication_user",
  initialState: {
    user_id: null,
    name: null,
    email: null,
    isAuthenticated: false,
    isAdmin: false,
  },
  reducers: {
    set_Authentication: (state, action) => {
      state.user_id = action.payload.user_id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isAdmin = action.payload.isAdmin;
    },
    update_UserProfile: (state, action) => {
      state.name = action.payload.full_name;
    },
  },
});
export const { set_Authentication } = authenticationSlice.actions;
export default authenticationSlice.reducer;
