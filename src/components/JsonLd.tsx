/**
 * JsonLd — injects a <script type="application/ld+json"> into <head>.
 * Accepts any JSON-LD object; no sanitisation needed since data comes from
 * trusted internal sources only.
 */
import { useEffect } from "react";

interface Props {
  /** A unique id so we can update/remove the right script tag */
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export default function JsonLd({ id, data }: Props) {
  useEffect(() => {
    const scriptId = `jsonld-${id}`;
    let el = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = scriptId;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => {
      document.getElementById(scriptId)?.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, JSON.stringify(data)]);

  return null;
}
