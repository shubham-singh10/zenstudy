import React, { Fragment, lazy, Suspense } from "react";
import HomeText from "./Main/HomeText";
import RecentlyAddedCourse from "./Main/RecentlyAddedCourse";

// Lazy load heavier or below-the-fold components
const Carousel = lazy(() => import("./Carousel"));
const FeatureVideo = lazy(() => import("./FeatureVideo"));
const LearnAbousUs = lazy(() => import("./Main/LearnAbousUs"));

const Home = () => {
  return (
    <main className="w-full">
      {/* Hero Carousel */}
      <Suspense fallback={<div className="min-h-[50vh]">Loading carousel...</div>}>
        <section><Carousel /></section>
      </Suspense>

      {/* Welcome Section */}
      <section><HomeText /></section>

      {/* Recently Added Courses */}
      <section><RecentlyAddedCourse /></section>

      {/* Featured YouTube Videos */}
      <Suspense fallback={<div className="min-h-[50vh]">Loading videos...</div>}>
        <section><FeatureVideo /></section>
      </Suspense>

      {/* Learn About Us Section */}
      <Suspense fallback={<div className="min-h-[50vh]">Loading about section...</div>}>
        <section><LearnAbousUs /></section>
      </Suspense>
    </main>
  );
};

export default Home;
