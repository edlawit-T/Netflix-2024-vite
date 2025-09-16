import React, { useState, useEffect } from "react";
import "./Row.css";
import axios from "../../../utils/axios";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  const base_url = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    (async () => {
      try {
        console.log("Fetching from:", fetchUrl);
        const request = await axios.get(fetchUrl);
        console.log("Fetched Movies:", request.data.results);
        setMovies(request.data.results);
      } catch (error) {
        console.log("Error fetching movies:", error);
      }
    })();
  }, [fetchUrl]);

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name)
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((err) => console.log("Trailer not found:", err));
    }
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="row">
      <h1>{title}</h1>
      <div className="row_posters">
        {movies?.map((movie, index) => {
          const imagePath = isLargeRow
            ? movie.poster_path || movie.backdrop_path
            : movie.backdrop_path || movie.poster_path;

          return (
            imagePath && (
              <img
                onClick={() => handleClick(movie)}
                key={index}
                src={`${base_url}${imagePath}`}
                alt={movie?.title || movie?.name || movie?.original_name}
                className={`row_poster ${isLargeRow && "row_posterLarge"}`}
              />
            )
          );
        })}
      </div>
      <div style={{ padding: "40px" }}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
};

export default Row;
