import { configureStore } from "@reduxjs/toolkit";
import playbackReducer from "./playbackSlice"; // Adjust the path if needed

const store = configureStore({
  reducer: {
    playback: playbackReducer,
  },
});

export default store;
