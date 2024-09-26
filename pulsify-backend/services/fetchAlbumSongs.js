const { getAccessToken } = require("./spotifyAccessToken");
const { fetchTrack } = require("./fetchTrack");
const axios = require("axios");

const fetchAlbumSongs = async (albumId) => {
  try {
    // Get the access token from spotifyService
    const accessToken = await getAccessToken();

    // Log the action, but avoid logging sensitive information
    console.log(`Fetching tracks for album ID: ${albumId}`);

    // Fetch the album's tracks using the Spotify API
    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Check if there are tracks available
    if (
      !response.data ||
      !response.data.items ||
      response.data.items.length === 0
    ) {
      return { firstSong: null, relatedSongs: [] };
    }

    // Get the first song's ID and fetch its details
    const firstSongId = response.data.items[0].id;
    const firstSongDetails = await fetchTrack(firstSongId);

    // Prepare to fetch remaining songs
    const remainingSongsPromises = response.data.items
      .slice(1)
      .map((track) => fetchTrack(track.id));

    // Fetch remaining song details in parallel
    const remainingSongs = await Promise.all(remainingSongsPromises).catch(
      (error) => {
        console.error("Error fetching remaining songs:", error.message);
        return []; // Return an empty array on error
      }
    );

    return {
      firstSong: firstSongDetails,
      relatedSongs: remainingSongs,
    };
  } catch (error) {
    console.error(
      "Error fetching album songs:",
      error.response?.data || error.message
    );
    throw new Error("Unable to fetch album songs");
  }
};

module.exports = { fetchAlbumSongs };
