import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function LegalPage({ title, subtitle, lastUpdated, children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <div className="container py-4">
        <Breadcrumb crumbs={[
          { label: "Accueil", href: "/" },
          { label: title },
        ]} />
      </div>

      <section className="container pb-16 max-w-4xl">
        <div className="bg-blanc-casse rounded-card shadow-card p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl mb-2">{title}</h1>
          {subtitle && <p className="font-body text-gris-chaud mb-2">{subtitle}</p>}
          <p className="font-body text-xs text-gris-chaud mb-8 pb-6 border-b border-sable">
            Dernière mise à jour : {lastUpdated}
          </p>
          <div className="prose-legal">
            {children}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl mb-4 text-brun">{title}</h2>
      <div className="font-body text-sm text-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-semibold text-brun mb-2">{title}</h3>
      <div className="font-body text-sm text-foreground leading-relaxed space-y-2 pl-4 border-l-2 border-sable">
        {children}
      </div>
    </div>
  );
}

export function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="bg-ocre/10 border border-ocre/25 rounded-card p-4 my-4 font-body text-sm text-brun">
      {children}
    </div>
  );
}
