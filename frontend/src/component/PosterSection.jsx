import React from "react";

const posters = [
  "/images/poster1.png",
  "/images/poster2.png",
  "/images/poster3.png",
  "/images/poster4.png",
];

const PosterSection = () => {
  return (
    <section className="py-8 px-4">
      <h2 className="text-xl font-bold mb-4">Posters</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {posters.map((src, i) => (
          <img key={i} src={src} alt={`poster-${i}`} className="rounded-xl w-full object-cover" />
        ))}
      </div>
    </section>
  );
};

export default PosterSection;
