const axios = require("axios");
const { getAccessToken } = require("./spotifyAccessToken");

const fetchTrendingArtists = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      "https://api.spotify.com/v1/browse/new-releases",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const artistIds = response.data.albums.items
      .flatMap((album) => album.artists.map((artist) => artist.id))
      .slice(0, 10);

    const artistResponses = await Promise.all(
      artistIds.map((id) =>
        axios.get(`https://api.spotify.com/v1/artists/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      )
    );

    const artists = artistResponses
      .map((res) => res.data)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);

    return artists;
  } catch (error) {
    console.error("Error fetching trending artists:", error);
    throw new Error("Unable to fetch trending artists");
  }
};

module.exports = { fetchTrendingArtists };
