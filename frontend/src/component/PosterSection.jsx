import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import poster1 from "../assets/images/4721774. 1.png";
import poster2 from "../assets/images/4721777 1.png";
import poster3 from "../assets/images/5431132 1.png";
import poster4 from "../assets/images/7907128. 1.png";
import poster5 from "../assets/images/8463267. 1.png";
import poster6 from "../assets/images/11545611. 1.png";

const posters = [poster1, poster2, poster3, poster4, poster5, poster6, poster1, poster2];

const PosterSection = () => {
  return (
    <section className="py-8 px-4">
      {/* Header: Title + See more */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Posters</h2>
        <button className="text-blue-600 hover:underline text-sm">See more</button>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={6}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
      >
        {posters.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="p-1">
              <img
                src={src}
                alt={`poster-${i}`}
                className="rounded-xl w-full h-64 object-cover shadow"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PosterSection;
