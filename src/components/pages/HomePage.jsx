import React from "react";
import BannerList from "../features/BannerList";
import CareList from "../features/CareList";
import HeroBanner from "../features/HeroBanner";

const API_BASE =
  "https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16";

const URL_BANNER_1 = `${API_BASE}&page=30`;
const URL_BANNER_2 = `${API_BASE}&page=31`;

const HomePage = () => {
  return (
    <>
      <BannerList />
      <CareList type="anime1" />

      <HeroBanner fetchUrl={URL_BANNER_1} />

      <CareList type="anime2" />

      <HeroBanner fetchUrl={URL_BANNER_2} />

      <CareList type="anime3" />
    </>
  );
};

export default HomePage;
