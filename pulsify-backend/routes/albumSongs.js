const express = require("express");
const { fetchAlbumSongs } = require("../services/fetchAlbumSongs");

const router = express.Router();

router.get("/:albumId/songs", async (req, res) => {
  try {
    const albumId = String(req.params.albumId); // Ensure it's a string
    console.log(`Fetching tracks for album ID: ${albumId}`);

    // Call fetchAlbumSongs without passing accessToken
    const tracks = await fetchAlbumSongs(albumId);
    res.json(tracks);
  } catch (error) {
    console.error("Error fetching album songs:", error.message);
    console.error("Full error:", error);
    res.status(500).send("Error fetching album songs");
  }
});

module.exports = router;
