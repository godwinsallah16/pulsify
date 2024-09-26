const axios = require("axios");

// Function to get an access token from Spotify
const getAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error obtaining access token:", error);
    throw new Error("Unable to obtain access token");
  }
};

module.exports = { getAccessToken };
