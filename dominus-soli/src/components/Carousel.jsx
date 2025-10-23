import { useEffect, useRef, useState } from "react";
import PropertyCard from "./PropertyCard";

export default function Carousel({ items = [] }) {
  const viewportRef = useRef(null);
  const [step, setStep] = useState(320);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const card = vp.querySelector("[data-card]");
    if (card) {
      const rect = card.getBoundingClientRect();
      setStep(Math.round(rect.width + 24));
    }
  }, [items]);

  const go = (dir) => {
    const vp = viewportRef.current;
    if (!vp) return;
    vp.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    let t = setInterval(() => go(1), 4000);
    const stop = () => clearInterval(t);
    vp.addEventListener("mouseenter", stop);
    vp.addEventListener("mouseleave", () => (t = setInterval(() => go(1), 4000)));
    return () => {
      stop();
      vp.removeEventListener("mouseenter", stop);
    };
  }, [step]);

  if (!items.length) return null;

  return (
  <div className="relative mx-8 flex items-center gap-4 min-h-[540px]">
      <button
        onClick={() => go(-1)}
        className="hidden md:flex w-10 h-10 rounded-full border-2 border-[#11397a]
                   text-[#11397a] hover:bg-[#11397a] hover:text-white
                   items-center justify-center transition"
        aria-label="Anterior"
      >
        ‹
      </button>

      <div
        ref={viewportRef}
        className="flex-1 overflow-x-auto scroll-smooth [scrollbar-width:none]
                   snap-x snap-mandatory"
      >
  <div className="flex gap-6 py-4 pb-20 min-w-full">
          {items.map((item, idx) => (
            <div
              key={idx}
              data-card
              className="snap-center flex-[0_0_320px] max-w-[340px]"
            >
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => go(1)}
        className="hidden md:flex w-10 h-10 rounded-full border-2 border-[#11397a]
                   text-[#11397a] hover:bg-[#11397a] hover:text-white
                   items-center justify-center transition"
        aria-label="Próximo"
      >
        ›
      </button>
    </div>
  );
}
