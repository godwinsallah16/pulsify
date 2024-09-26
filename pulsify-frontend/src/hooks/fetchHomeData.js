import { useState, useEffect } from "react";
import axios from "axios";
import { hostUrl } from "../utils/constants";

const fetchHomeData = () => {
  const [artists, setArtists] = useState([]);
  const [recommendedAlbums, setRecommendedAlbums] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(
          `${hostUrl}/api/artsits/trending-artists`
        );
        setArtists(response.data.global || []);
      } catch (error) {
        console.error("Error fetching artists: ", error);
        setArtists([]);
      }
    };

    const fetchRecommendedAlbums = async () => {
      try {
        const response = await axios.get(`${hostUrl}/api/albums`);
        setRecommendedAlbums(response.data || []);
      } catch (error) {
        console.error("Error fetching recommended albums: ", error);
        setRecommendedAlbums([]);
      }
    };

    const fetchTrendingSongs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${hostUrl}/api/trending-songs`);
        setTrendingSongs(response.data || []);
      } catch (error) {
        console.error("Error fetching trending songs: ", error);
        setTrendingSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
    fetchRecommendedAlbums();
    fetchTrendingSongs();
  }, []);

  return { artists, recommendedAlbums, trendingSongs, loading };
};

export default fetchHomeData;
