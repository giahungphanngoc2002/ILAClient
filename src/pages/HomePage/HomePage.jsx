import React, { } from "react";

import "tailwindcss/tailwind.css";

import Banner from "../../components/Banner/Banner";
import Counters from "../../components/Counter/Counter";
import CourseCarousel from "../../components/CourseCarousel/CourseCarousel";
import FeaturesSection from "../../components/FeaturesSection/FeaturesSection";
import TrainersSection from "../../components/TrainersSection/TrainersSection";
import Footer from "../../components/Footer/Footer";
import Contact from "../../components/Contact/Contact";


export default function HomePage() {






  return (
    <div>
      <Banner />
      <FeaturesSection />
      <CourseCarousel />
      <Counters />
      <TrainersSection />
      <Contact />
      <Footer />

    </div>

  );
}