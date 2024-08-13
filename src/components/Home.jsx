import React, { Fragment } from "react";
import Carousel from "./Carousel";
import FeatureVideo from "./FeatureVideo";
import HomeText from "./Main/HomeText";
import RecentlyAddedCourse from "./Main/RecentlyAddedCourse";
import LearnAbousUs from "./Main/LearnAbousUs";
import ExploreArticles from "./ExploreArticles ";

const Home = () => {
  return (
    <Fragment>
      <Carousel />


      <HomeText />


      <RecentlyAddedCourse />
     
      {
      // <ExploreArticles/>
      }

      <FeatureVideo />


      <LearnAbousUs />
   
    </Fragment>
  );
};

export default Home;