const axios = require("axios");
const { getAccessToken } = require("./spotifyAccessToken");

const getTrendingAlbums = async () => {
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

    const albums = response.data.albums.items.slice(0, 5).map((album) => ({
      id: album.id,
      name: album.name,
      artist: album.artists.map((artist) => artist.name).join(", "),
      releaseDate: album.release_date,
      imageUrl: album.images[0].url,
      albumUrl: album.external_urls.spotify,
    }));

    return albums;
  } catch (error) {
    console.error(
      "Error fetching trending albums:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = { getTrendingAlbums };
