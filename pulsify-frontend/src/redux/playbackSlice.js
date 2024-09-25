import { createSlice } from "@reduxjs/toolkit";

const playbackSlice = createSlice({
  name: "playback",
  initialState: {
    currentPlayUrl: "dfhgdh",
    currentTitle: "",
    currentArtist: "",
    currentImage: "",
  },
  reducers: {
    setPlayUrl: (state, action) => {
      state.currentPlayUrl = action.payload.url; // Set the play URL
      state.currentTitle = action.payload.title; // Set the song title
      state.currentArtist = action.payload.artist; // Set the artist name
      state.currentImage = action.payload.image; // Set the image URL
    },
  },
});

export const { setPlayUrl } = playbackSlice.actions;
export default playbackSlice.reducer;
