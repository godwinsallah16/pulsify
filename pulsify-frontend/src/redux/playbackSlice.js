// redux/playbackSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSong: null,
  relatedSongs: [], // To store related songs
};

const playbackSlice = createSlice({
  name: "playback",
  initialState,
  reducers: {
    setPlayUrl: (state, action) => {
      state.currentSong = action.payload;
      state.relatedSongs = []; // Clear related songs when a new song is played
    },
    setRelatedSongs: (state, action) => {
      state.relatedSongs = action.payload; // Update related songs when they are fetched
    },
  },
});

export const { setPlayUrl, setRelatedSongs } = playbackSlice.actions;
export default playbackSlice.reducer;
