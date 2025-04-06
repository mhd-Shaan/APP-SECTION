import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BannerCarousel = () => {
  const promoItems = [
    {
      title: "35% OFF ALL CAR PAINTERS",
      brand: "MANN FILTER",
      validity: "valid till April 30th",
      cta: "ORDER NOW",
      image: "https://d2p4skp3azwb5a.cloudfront.net/media/images/home_banners/030425054305-ktec.png"
    },
    {
      title: "30% OFF BRAKE PADS AND DRUMS",
      brand: "BREMBO",
      validity: "valid till April 30th",
      cta: "ORDER NOW",
      image: "https://d2p4skp3azwb5a.cloudfront.net/media/images/home_banners/270325035605-Boschassu.png"
    },
    {
      title: "ALL CAR SPARE PARTS IN STOCK READY TO SHIP",
      brand: "YELLOW/WHITE",
      validity: "EXPRESS DELIVERY",
      cta: "ORDER NOW",
      image: "https://d2p4skp3azwb5a.cloudfront.net/media/images/home_banners/040425103239-AMSOILban.png"
    },
    {
      title: "FREE SHIPPING ON ORDERS OVER $50",
      brand: "SPAREMART",
      validity: "limited time offer",
      cta: "SHOP NOW",
      image: "https://d2p4skp3azwb5a.cloudfront.net/media/images/home_banners/040425103239-AMSOILban.png"
    },
    {
      title: "PREMIUM CAR ACCESSORIES",
      brand: "KTEC",
      validity: "new arrivals",
      cta: "BROWSE NOW",
      image: "https://d2p4skp3azwb5a.cloudfront.net/media/images/home_banners/030425054305-ktec.png"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = promoItems.length - slidesToShow;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [slidesToShow, promoItems.length]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesToShow(3);
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, promoItems.length - slidesToShow)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      Math.max(prevIndex - 1, 0)
    );
  };

  return (
    <div className="mt-16 w-full relative">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          {/* Slides container */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(100 / promoItems.length) * currentIndex}%)`,
              width: `${(promoItems.length) * (100 / slidesToShow)}%`
            }}
          >
            {promoItems.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / promoItems.length}%` }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-md h-64">
                  <img
                    src={item.image}
                    alt={item.brand}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white font-medium">{item.brand}</p>
                        <p className="text-white text-sm">{item.validity}</p>
                      </div>
                      <button className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold hover:bg-yellow-400 transition">
                        {item.cta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hidden md:block hover:bg-black/50"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hidden md:block hover:bg-black/50"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: promoItems.length - slidesToShow + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-black' : 'bg-gray-300'}`}
              aria-label={`Go to promo ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
