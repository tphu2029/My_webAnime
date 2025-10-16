import React from "react";
import Header from "./components/Header";
import BannerList from "./components/BannerList";
import CareList from "./components/CareList";
import HeroBanner from "./components/HeroBanner";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <BannerList />
      <CareList type="anime1" />
      <HeroBanner />
      <CareList type="anime2" />
      <Footer />
    </>
  );
}

export default App;
