import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="py-3">
      <ol className="flex flex-wrap items-center gap-1 font-body text-sm text-gris-chaud">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="text-sable shrink-0" />}
            {crumb.href ? (
              <Link to={crumb.href} className="hover:text-ocre transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-brun font-semibold">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
