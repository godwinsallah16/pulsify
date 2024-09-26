const express = require("express");
const cors = require("cors"); // If you're working with CORS issues
const albums = require("./routes/albums");
const albumSongs = require("./routes/albumSongs");
const trendingArtists = require("./routes/trendingArtists");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", albums);
app.use("/api/album", albumSongs);
app.use("/api", trendingArtists);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
