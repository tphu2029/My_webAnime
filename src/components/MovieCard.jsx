import React from "react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // Use a specific size

const MovieCard = ({ movie }) => {
  if (!movie || !movie.poster_path) {
    return null; // Don't render if movie data is missing
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform-gpu hover:scale-105">
      <img
        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
        alt={movie.title || movie.name}
        className="w-full h-[350px] object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 opacity-0 transition-opacity duration-300 hover:opacity-100">
        <div className="text-white">
          <h3 className="text-lg font-bold">{movie.title || movie.name}</h3>
          <p className="text-sm">
            Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
