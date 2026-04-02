import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

const ageGroups = [
  {
    emoji: "🍼",
    label: "0 – 1 an",
    desc: "Éveil sensoriel et moteur",
    bg: "bg-ocre/15 border-ocre/30",
    query: { min: 0, max: 1 },
    color: "text-ocre",
  },
  {
    emoji: "🐣",
    label: "2 – 3 ans",
    desc: "Exploration et imagination",
    bg: "bg-terracotta/10 border-terracotta/25",
    query: { min: 2, max: 3 },
    color: "text-terracotta",
  },
  {
    emoji: "🌟",
    label: "4 – 6 ans",
    desc: "Créativité et jeux de rôle",
    bg: "bg-vert-sauge/15 border-vert-sauge/30",
    query: { min: 4, max: 6 },
    color: "text-vert-sauge",
  },
  {
    emoji: "🎨",
    label: "7 – 10 ans",
    desc: "Défis, science et loisirs créatifs",
    bg: "bg-brun/10 border-brun/20",
    query: { min: 7, max: 10 },
    color: "text-brun",
  },
  {
    emoji: "🧩",
    label: "10 ans et +",
    desc: "Jeux stratégiques et complexes",
    bg: "bg-sable border-ocre/20",
    query: { min: 10, max: 99 },
    color: "text-brun",
  },
  {
    emoji: "👨‍👩‍👧",
    label: "Toute la famille",
    desc: "Jeux pour jouer ensemble",
    bg: "bg-creme border-ocre/15",
    query: { min: 0, max: 99 },
    color: "text-ocre",
  },
];

const occasions = [
  { emoji: "🎂", label: "Anniversaire" },
  { emoji: "🎄", label: "Noël" },
  { emoji: "🐣", label: "Pâques" },
  { emoji: "🎓", label: "Fin d'année" },
  { emoji: "💐", label: "Fête des mères / pères" },
  { emoji: "👶", label: "Naissance" },
];

const IdeesCadeaux = () => {
  const [selectedAge, setSelectedAge] = useState<{ min: number; max: number } | null>(null);

  const filteredProducts = selectedAge
    ? products.filter((p) => p.ageMin <= selectedAge.max && p.ageMax >= selectedAge.min)
    : products.slice(0, 8);

  const selectedGroup = ageGroups.find(
    (g) => g.query.min === selectedAge?.min && g.query.max === selectedAge?.max
  );

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-sable to-creme py-16 md:py-20 text-center">
        <div className="container">
          <span className="inline-block bg-ocre/15 text-ocre text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase font-body">
            Guide cadeaux
          </span>
          <h1 className="mb-4">Trouvez le cadeau parfait</h1>
          <p className="font-body text-gris-chaud text-lg max-w-xl mx-auto">
            Sélectionnez l'âge de l'enfant pour découvrir nos coups de cœur, soigneusement choisis par notre équipe.
          </p>
        </div>
      </section>

      {/* Sélection par âge */}
      <section className="py-14 md:py-16">
        <div className="container">
          <h2 className="text-center mb-10">Par tranche d'âge</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto mb-12">
            {ageGroups.map((group) => {
              const isActive = selectedAge?.min === group.query.min && selectedAge?.max === group.query.max;
              return (
                <button
                  key={group.label}
                  onClick={() => setSelectedAge(isActive ? null : group.query)}
                  className={`${group.bg} border-2 rounded-card p-5 flex flex-col items-center gap-2 hover:shadow-soft transition-all duration-200 hover:-translate-y-1 ${
                    isActive ? "ring-2 ring-ocre ring-offset-2 shadow-md" : ""
                  }`}
                >
                  <span className="text-3xl md:text-4xl">{group.emoji}</span>
                  <span className={`font-body text-xs md:text-sm font-semibold ${group.color}`}>{group.label}</span>
                  <span className="font-body text-xs text-gris-chaud hidden md:block">{group.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Produits filtrés */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl">
                  {selectedGroup ? `${selectedGroup.emoji} Idées pour ${selectedGroup.label}` : "Nos coups de cœur"}
                </h3>
                <p className="font-body text-sm text-gris-chaud mt-0.5">
                  {filteredProducts.length} jouet{filteredProducts.length > 1 ? "s" : ""} trouvé{filteredProducts.length > 1 ? "s" : ""}
                </p>
              </div>
              {selectedAge && (
                <button
                  onClick={() => setSelectedAge(null)}
                  className="font-body text-sm text-gris-chaud hover:text-terracotta transition-colors underline"
                >
                  Réinitialiser
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">😕</p>
                <p className="font-body text-gris-chaud">Aucun jouet trouvé pour cette tranche d'âge.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSelectedAge(null)}>
                  Voir tous les jouets
                </Button>
              </div>
            )}

            <div className="text-center mt-10">
              <Button variant="outline" size="lg" asChild>
                <a href="/catalogue">
                  Voir tout le catalogue <ChevronRight size={16} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Par occasion */}
      <section className="py-14 bg-sable">
        <div className="container text-center">
          <h2 className="mb-3">Par occasion</h2>
          <p className="font-body text-gris-chaud mb-10">Vous cherchez un cadeau pour une occasion précise ?</p>
          <div className="flex flex-wrap justify-center gap-4">
            {occasions.map((occ) => (
              <a
                key={occ.label}
                href="/catalogue"
                className="bg-blanc-casse border border-ocre/20 rounded-card px-6 py-4 flex items-center gap-3 hover:shadow-soft hover:-translate-y-0.5 transition-all"
              >
                <span className="text-2xl">{occ.emoji}</span>
                <span className="font-body font-semibold text-brun text-sm">{occ.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA conseil */}
      <section className="py-14 md:py-20">
        <div className="container max-w-2xl text-center">
          <div className="text-5xl mb-5">🦌</div>
          <h2 className="mb-4">Vous ne savez pas quoi choisir ?</h2>
          <p className="font-body text-gris-chaud leading-relaxed mb-8">
            Notre équipe est là pour vous conseiller. Appelez-nous ou envoyez-nous un message, et on trouvera ensemble le cadeau idéal selon l'âge, la personnalité et votre budget.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="default" size="lg" asChild>
              <a href="/contact">Demander un conseil</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:0473648055">📞 04 73 64 80 55</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IdeesCadeaux;
