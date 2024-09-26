const express = require("express");
const { getTrendingAlbums } = require("../services/fetchAlbums");

const router = express.Router();

// GET /api/albums/trending
router.get("/albums", async (req, res) => {
  try {
    const albums = await getTrendingAlbums();
    res.json(albums);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trending albums",
      error: error.message,
    });
  }
});

module.exports = router;
