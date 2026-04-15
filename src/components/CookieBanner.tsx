import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "cn_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem(COOKIE_KEY, "refused");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] p-3 md:p-5 animate-fade-in"
      role="dialog"
      aria-label="Bandeau de consentement aux cookies"
    >
      <div className="max-w-5xl mx-auto bg-brun text-creme rounded-card shadow-2xl px-5 py-4 md:px-8 md:py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-display text-base font-semibold mb-1">
            🍪 Cookies et vie privée
          </p>
          <p className="font-body text-sm text-sable leading-relaxed">
            Nous utilisons des cookies pour le bon fonctionnement du site et, avec votre consentement, pour mesurer notre audience. Consultez notre{" "}
            <Link
              to="/cookies"
              className="text-ocre hover:text-creme underline underline-offset-2 transition-colors"
            >
              politique de cookies
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefuse}
            className="flex-1 sm:flex-none border-sable/40 text-creme bg-transparent hover:bg-white/10 hover:text-creme hover:border-sable/60"
          >
            Refuser
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="flex-1 sm:flex-none bg-ocre hover:bg-terracotta text-white border-0"
          >
            Tout accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
