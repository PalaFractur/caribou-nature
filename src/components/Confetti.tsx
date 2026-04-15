import { useEffect, useState } from "react";

const COLORS = [
  "#C8861A", // ocre
  "#A8432A", // terracotta
  "#6A8F5A", // vert-sauge
  "#D4BFA0", // sable
  "#FFFFFF", // white
];

interface Piece {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

function generatePieces(): Piece[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100, // vw %
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 6, // 6-12px
    duration: 1.5 + Math.random() * 1.5, // 1.5-3s
    delay: Math.random() * 0.8,
  }));
}

interface ConfettiProps {
  onDone?: () => void;
}

export default function Confetti({ onDone }: ConfettiProps) {
  const [pieces] = useState<Piece[]>(generatePieces);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDone?.();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}vw`,
            top: "-20px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}
