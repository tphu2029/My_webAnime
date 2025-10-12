import React from "react";
import { Carousel } from "react-responsive-carousel";
import MovieCard from "./MovieCard";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../assets/css/carouselOverride.css";

const HorizontalCarousel = ({ title, movies }) => {
  return (
    <div className="relative mb-16 px-5">
      <h2 className="font-extrabold text-3xl text-amber-700 ml-2 mb-4">
        {title}
      </h2>
      <hr />
      <Carousel
        showThumbs={false}
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        centerMode
        centerSlidePercentage={20}
        emulateTouch
        swipeable
        interval={4000}
        autoPlay
        stopOnHover
        dynamicHeight={false}
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && (
            <button
              onClick={onClickHandler}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white 
                           rounded-full p-3 backdrop-blur-md shadow-lg transition duration-300 "
            >
              <ChevronLeft size={24} />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && (
            <button
              onClick={onClickHandler}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white 
                           rounded-full p-3 backdrop-blur-md shadow-lg transition duration-300"
            >
              <ChevronRight size={24} />
            </button>
          )
        }
      >
        {movies.map((movie) => (
          <div key={movie.id} className="px-2 ">
            <MovieCard movie={movie} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HorizontalCarousel;
