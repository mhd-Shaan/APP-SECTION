import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import TwoWheeler from "../assets/images/two_wheeler 1.png";
import FourWheeler from "../assets/images/passenger_car 1.png";
import ThreeWheeler from "../assets/images/three_wheeler 1.png";
import LightCommercial from "../assets/images/light_commercial_vehicle 1.png";
import HeavyCommercial from "../assets/images/electrical 1.png";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "TwoWheeler", img: TwoWheeler },
  { name: "ThreeWheeler", img: ThreeWheeler },
  { name: "FourWheeler", img: FourWheeler },
  { name: "Light Commercial", img: LightCommercial },
  { name: "Electrical vehicle ", img: HeavyCommercial },
];

const VehicleCategory = () => {
  const navigate = useNavigate()
  const handleCategoryClick = (categoryName) => {
    navigate(`/search?v=${categoryName}`);
  };

  return (
    <section className="py-6 px-4 relative">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        spaceBetween={20}
        slidesPerView={4}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className="relative"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <div
              className="cursor-pointer text-center"
              onClick={() => handleCategoryClick(category.name)}
            >
              <img
                src={category.img}
                alt={category.name}
                className="w-full h-56 object-contain rounded-lg shadow hover:scale-105 transition"
              />
              <div className="mt-2 text-sm font-medium text-gray-700">
                {category.name}
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="swiper-button-prev-custom absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md cursor-pointer z-10">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className="swiper-button-next-custom absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md cursor-pointer z-10">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Swiper>
    </section>
  );
};

export default VehicleCategory;
