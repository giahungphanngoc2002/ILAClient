import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  username: "",
  email: "",
  phone: "",
  address: "",
  age: "",
  cccd: "",
  avatar: "",
  id: "",
  access_token: "",
  password: "",
  gender: "",
  updatedAt: " ",
  createdAt: " ",

  isAuthenticated: false,
  role: " ",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        name = "",
        username = "",
        email = "",
        phone = "",
        _id = "",
        address = "",
        age = "",
        avatar = "",
        access_token = "",
        password = "",
        cccd = "",
        gender = "",
        createdAt = "",
        updatedAt = "",
        role = " ",

      } = action.payload;
      state.name = name;
      state.username = username;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.age = age;
      state.id = _id;
      state.role = role;
      state.gender = gender;
      state.avatar = avatar;
      state.password = password;
      state.cccd = cccd;
      state.updatedAt = updatedAt;
      state.createdAt = createdAt;
      state.access_token = access_token;
      state.isAuthenticated = !!access_token; // Ensure authentication
    },
    resetUser: (state) => {
      state.name = "";
      state.username = "";
      state.email = "";
      state.phone = "";
      state.address = "";
      state.gender = "";
      state.age = "";
      state.id = "";
      state.avatar = "";
      state.access_token = "";
      state.role = "";
      state.cccd = "";
      state.isAuthenticated = false; // Reset authentication
    },
  },
});

export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;