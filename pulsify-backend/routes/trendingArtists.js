const express = require("express");
const { fetchTrendingArtists } = require("../services/trendingArtists");
const router = express.Router();

router.get("/artsits/trending-artists", async (req, res) => {
  try {
    const artists = await fetchTrendingArtists();
    res.json({ global: artists, location: [] });
  } catch (error) {
    console.error("Error fetching trending artists:", error);
    res.status(500).send("Error fetching trending artists");
  }
});

module.exports = router;
