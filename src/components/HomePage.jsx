import React from "react";
import BannerList from "../components/BannerList";
import CareList from "../components/CareList";
import HeroBanner from "../components/HeroBanner";

const HomePage = () => {
  return (
    <>
      <BannerList />
      <CareList type="anime1" />
      <HeroBanner />
      <CareList type="anime2" />
    </>
  );
};

export default HomePage;
