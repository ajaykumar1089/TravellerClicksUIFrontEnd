"use client";

import { useEffect, useState } from "react";

export default function ItineraryImageSlider({ id }: { id: string }) {
  const [images, setImages] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!id) return;

    fetch(
      `http://127.0.0.1:8000/api/holidaypackages/itineraries/?holidaypackage=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        const imgs = data?.results?.[0]?.images || [];
        setImages(imgs);
      });
  }, [id]);

  if (!images.length) return <p>No images found</p>;

  return (
    <div style={{ width: "100%", maxWidth: 800, margin: "auto" }}>
      <img
        src={images[current].image}
        alt={images[current].alt_text || "Itinerary image"}
        style={{
          width: "100%",
          height: "400px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <button
          onClick={() =>
            setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))
          }
        >
          ⬅ Prev
        </button>

        <button
          onClick={() =>
            setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))
          }
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
