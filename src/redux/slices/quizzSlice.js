import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentQuestion: 0,
  selectedAnswer: null,
  score: 0,
  showResult: false,
  data: [
    {
      question: "What is Git?",
      answers: [
        "A remote repository platform.",
        "A programming language.",
        "A version control system.",
        "A nickname for GitHub.",
      ],
      correctAnswer: "A version control system.",
    },
    {
      question: "What is JSX?",
      answers: [
        "A programming language",
        "A file format",
        "A syntax extension for JavaScript",
        "A syntax extension for Java",
      ],
      correctAnswer: "A syntax extension for JavaScript",
    },
    {
      question: "What is Node.js?",
      answers: [
        "A runtime environment for executing JavaScript code server-side",
        "A front-end framework for building user interfaces",
        "A database management system",
        "A scripting language for automating tasks",
      ],
      correctAnswer:
        "A runtime environment for executing JavaScript code server-side",
    },
  ],
  error: null,
  saveSelected: [],
  selectedOption: {},
};

export const quizSlice = createSlice({
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

// const store = configureStore({
//   reducer: {
//     quiz: quizSlice.reducer,
//   },
// });

// export default store;
