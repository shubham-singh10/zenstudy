import React, { Fragment } from "react";
import Carousel from "./Carousel";
import FeatureVideo from "./FeatureVideo";
import HomeText from "./Main/HomeText";
import RecentlyAddedCourse from "./Main/RecentlyAddedCourse";
import LearnAbousUs from "./Main/LearnAbousUs";

const Home = () => {
  return (
    <Fragment>
      {/* Top Carousel */}
      <Carousel />

      {/* Small aboutUs */}
      <HomeText />

      {/* Recent Add Course */}
      <RecentlyAddedCourse />

      {/* Youtube Videos */}
      <FeatureVideo />

      {/* Learn About */}
      <LearnAbousUs />
    </Fragment>
  );
};

export default Home;