import { createSlice } from "@reduxjs/toolkit";
export const authenticationSlice = createSlice({
  name: "authentication_user",
  initialState: {
    user_id: null,
    name: null,
    email: null,
    // profile_picture: null,
    isAuthenticated: false,
    isAdmin: false,
    // usertype: null,
  },
  reducers: {
    set_Authentication: (state, action) => {
      state.user_id = action.payload.user_id;
      console.log("thes staeuseriddddddddddddd",state.user_id);
      
      state.name = action.payload.name;
      console.log("thes staeuseriddddddddddddd",state.name);
      state.email = action.payload.email;
      // state.profile_picture = action.payload.profile_picture;
      // console.log("the profile pictuer of the profile",state.profile_picture);
      
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isAdmin = action.payload.isAdmin;
    },
    update_UserProfile: (state, action) => {
      state.name = action.payload.full_name;
      // Update other fields if necessary
    },
  },
});
export const { set_Authentication } = authenticationSlice.actions;
export default authenticationSlice.reducer;
