const DEFAULT_MESSAGE = "🚚 Livraison gratuite dès 20€ sur Riom · 🎁 Emballage cadeau offert · ⭐ 4,7/5 sur Google";
const BANNER_KEY = "cn_banner";

export function getBannerMessage(): string {
  try {
    const raw = localStorage.getItem(BANNER_KEY);
    if (!raw) return DEFAULT_MESSAGE;
    const { message, enabled } = JSON.parse(raw);
    return enabled && message ? message : DEFAULT_MESSAGE;
  } catch {
    return DEFAULT_MESSAGE;
  }
}

export function saveBanner(message: string, enabled: boolean) {
  try {
    localStorage.setItem(BANNER_KEY, JSON.stringify({ message, enabled }));
    // Déclencher mise à jour dans les autres onglets
    window.dispatchEvent(new Event("banner-updated"));
  } catch {}
}

import { useEffect, useState } from "react";

const TopBar = () => {
  const [message, setMessage] = useState(getBannerMessage);

  useEffect(() => {
    const handler = () => setMessage(getBannerMessage());
    window.addEventListener("banner-updated", handler);
    return () => window.removeEventListener("banner-updated", handler);
  }, []);

  return (
    <div className="bg-brun text-creme text-xs md:text-sm py-2 text-center font-body">
      <div className="container">{message}</div>
    </div>
  );
};

export default TopBar;
