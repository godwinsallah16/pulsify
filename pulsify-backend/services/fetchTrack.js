const axios = require("axios");
const FormData = require("form-data");
const { getAccessToken } = require("./spotifyAccessToken"); // Adjust the path accordingly

// Function to fetch the Spotify album cover image and other details
async function fetchyTrackCover(trackId) {
  const accessToken = await getAccessToken();

  const options = {
    method: "GET",
    url: `https://api.spotify.com/v1/tracks/${trackId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.request(options);
    const trackData = response.data;

    // Extract necessary details
    const imageUrl = trackData.album?.images[0]?.url || ""; // Album cover image URL
    return imageUrl;
  } catch (error) {
    console.error("Error fetching Spotify track details:", error.message);
    throw new Error("Unable to fetch Spotify track details");
  }
}

// Function to fetch track data from RapidAPI and Spotify
const fetchTrack = async (trackId) => {
  const data = new FormData();
  data.append("url", `https://open.spotify.com/track/${trackId}`);

  const options = {
    method: "POST",
    url: "https://spotify-scraper2.p.rapidapi.com/download",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "spotify-scraper2.p.rapidapi.com",
      ...data.getHeaders(),
    },
    data: data,
  };

  try {
    // Fetch track info (title, artist, and audio URL) from RapidAPI
    const rapidApiResponse = await axios.request(options);
    const trackData = rapidApiResponse.data;

    const title = trackData.metadata?.title || "Unknown Title";
    const artist = trackData.metadata?.artist || "Unknown Artist";
    const songUrl = trackData.result || "";

    // Fetch album cover image from Spotify API
    const imageUrl = await fetchyTrackCover(trackId);

    return { title, artist, songUrl, imageUrl };
  } catch (error) {
    console.error("Error fetching track details:", error.message);
    throw new Error("Unable to fetch track details");
  }
};

module.exports = { fetchTrack };
