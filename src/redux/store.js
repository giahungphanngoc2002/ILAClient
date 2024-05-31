import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import userReducer from "./slices/userSlide";
import quizReducer from "./slices/quizzSlice";
import classReducer from "./slices/classSlice";
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    quiz: quizReducer,
    class: classReducer,
  },
});
