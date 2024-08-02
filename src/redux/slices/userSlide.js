import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  age: "",
  avatar: "",
  id: "",
  access_token: "",
  password: "",
  isAdmin: false,
  isTeacher: false,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        name = "",
        email = "",
        phone = "",
        _id = "",
        address = "",
        age = "",
        avatar = "",
        access_token = "",
        password = "",
        isTeacher = false,
        isAdmin = false,
      } = action.payload;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.age = age;
      state.id = _id;
      state.isAdmin = isAdmin;
      state.isTeacher = isTeacher;
      state.avatar = avatar;
      state.password = password;
      state.access_token = access_token;
      state.isAuthenticated = !!access_token; // Ensure authentication
    },
    resetUser: (state) => {
      state.name = "";
      state.email = "";
      state.phone = "";
      state.address = "";
      state.age = "";
      state.id = "";
      state.avatar = "";
      state.access_token = "";
      state.isAdmin = false;
      state.isTeacher = false;
      state.isAuthenticated = false; // Reset authentication
    },
  },
});

export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;