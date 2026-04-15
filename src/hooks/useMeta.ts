import { useEffect } from "react";

interface MetaOptions {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function useMeta({ title, description, image, url }: MetaOptions) {
  useEffect(() => {
    const fullTitle = title.includes("Caribou Nature") ? title : `${title} — Caribou Nature`;
    document.title = fullTitle;

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, true);
      setMeta("twitter:description", description, true);
    }

    setMeta("og:title", fullTitle, true);
    setMeta("twitter:title", fullTitle, true);

    if (image) {
      setMeta("og:image", image, true);
      setMeta("twitter:image", image, true);
      setMeta("twitter:card", "summary_large_image", true);
    }

    if (url) {
      const canonical = `https://caribounature-riom.fr${url}`;
      setMeta("og:url", canonical, true);
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    return () => {
      document.title = "Caribou Nature — Jouets en bois et jeux éducatifs à Riom (63)";
    };
  }, [title, description, image, url]);
}
