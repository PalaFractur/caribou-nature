import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  activeIndex: number;
  alt: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ImageLightbox({ images, activeIndex, alt, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[90] bg-brun/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Fermer */}
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="absolute top-4 right-4 text-creme hover:text-ocre transition-colors bg-white/10 rounded-full p-2"
      >
        <X size={24} />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Image précédente"
          className="absolute left-4 text-creme hover:text-ocre transition-colors bg-white/10 rounded-full p-3"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Image */}
      <div className="max-w-3xl max-h-[85vh] mx-16" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[activeIndex]}
          alt={`${alt} — vue ${activeIndex + 1}`}
          className="w-full h-full object-contain rounded-card shadow-2xl"
        />
        <p className="font-body text-sable text-xs text-center mt-3">
          {activeIndex + 1} / {images.length}
        </p>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Image suivante"
          className="absolute right-4 text-creme hover:text-ocre transition-colors bg-white/10 rounded-full p-3"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? "bg-ocre" : "bg-sable/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
