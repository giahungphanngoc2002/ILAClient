import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import userReducer from './slices/userSlide'
import classReducer from './slices/classSlice'
import quizReducer from './slices/quizSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    class: classReducer,
    quiz: quizReducer,
  },
})