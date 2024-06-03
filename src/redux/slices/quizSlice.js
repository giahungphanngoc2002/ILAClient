import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentQuestion: 0,
  selectedAnswer: null,
  score: 0,
  showResult: false,
  data: null,
  error: null,
  saveSelected: [],
  selectedOption: {},
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    setSelectedAnswer: (state, action) => {
      state.selectedAnswer = action.payload;
    },
    setScore: (state, action) => {
      state.score = action.payload;
    },
    setShowResult: (state, action) => {
      state.showResult = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSaveSelected: (state, action) => {
      state.saveSelected = action.payload;
    },
    setSelectedOption(state, action) {
      const { questionIndex, option } = action.payload;
      state.selectedOption[questionIndex] = option;
    },
  },
});

export const {
  setCurrentQuestion,
  setSelectedAnswer,
  setScore,
  setShowResult,
  setData,
  setError,
  setSaveSelected,
  setSelectedOption,
} = quizSlice.actions;

export default quizSlice.reducer;