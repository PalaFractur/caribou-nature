import { useState, useMemo } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const categories = [
  "Jouets en bois & éveil",
  "Jeux de société & éducatifs",
  "Loisirs créatifs & puzzles",
  "Marionnettes & figurines",
  "Naissance & bébé",
  "Plein-air & musique",
  "Poupées & peluches",
  "Jeux d'imitation & construction",
  "Déguisements & accessoires",
];

const ageRanges = [
  { label: "0 – 1 an", min: 0, max: 1 },
  { label: "2 – 3 ans", min: 2, max: 3 },
  { label: "4 – 6 ans", min: 4, max: 6 },
  { label: "7 – 10 ans", min: 7, max: 10 },
  { label: "10+ ans", min: 10, max: 99 },
];

type SortOption = "pertinence" | "prix-asc" | "prix-desc" | "nouveautes";

const Catalogue = () => {
  const [searchParams] = useSearchParams();
  const ageQuery = searchParams.get("age");

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>(ageQuery ? [ageQuery] : []);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150]);
  const [newOnly, setNewOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("pertinence");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const toggleAge = (label: string) =>
    setSelectedAges((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );

  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedAges([]);
    setPriceRange([0, 150]);
    setNewOnly(false);
    setSort("pertinence");
  };

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Categories
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Age ranges
    if (selectedAges.length > 0) {
      result = result.filter((p) =>
        selectedAges.some((label) => {
          const range = ageRanges.find((r) => r.label === label);
          if (!range) return false;
          return p.ageMin <= range.max && p.ageMax >= range.min;
        })
      );
    }

    // Price
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // New only
    if (newOnly) result = result.filter((p) => p.isNew);

    // Sort
    switch (sort) {
      case "prix-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "prix-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nouveautes":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [search, selectedCategories, selectedAges, priceRange, newOnly, sort]);

  const visibleProducts = filtered.slice(0, visibleCount);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Catégories */}
      <div>
        <h4 className="font-display text-lg text-brun mb-3">Catégorie</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm font-body text-foreground hover:text-ocre transition-colors">
              <Checkbox
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Âge */}
      <div>
        <h4 className="font-display text-lg text-brun mb-3">Âge recommandé</h4>
        <div className="space-y-2">
          {ageRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer text-sm font-body text-foreground hover:text-ocre transition-colors">
              <Checkbox
                checked={selectedAges.includes(range.label)}
                onCheckedChange={() => toggleAge(range.label)}
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <h4 className="font-display text-lg text-brun mb-3">Budget</h4>
        <Slider
          min={0}
          max={150}
          step={5}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          className="my-4"
        />
        <div className="flex justify-between text-sm font-body text-gris-chaud">
          <span>{priceRange[0]} €</span>
          <span>{priceRange[1]} €</span>
        </div>
      </div>

      {/* Nouveautés */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-body text-foreground">Nouveautés uniquement</span>
        <Switch checked={newOnly} onCheckedChange={setNewOnly} />
      </div>

      {/* Reset */}
      <Button variant="outline" className="w-full" onClick={resetFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-creme">
      <TopBar />
      <Header />

      {/* Hero */}
      <section className="bg-sable py-10 md:py-14">
        <div className="container text-center">
          <h1 className="font-display text-brun mb-3">Notre catalogue</h1>
          <p className="font-body text-gris-chaud text-lg mb-6">
            Plus de 1 000 références sélectionnées avec soin
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-chaud" size={18} />
            <Input
              placeholder="Rechercher un jouet, un jeu…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-blanc-casse border-sable h-12 text-base rounded-btn"
            />
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="flex gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0 sticky top-28 self-start bg-blanc-casse rounded-card p-6 shadow-card">
            <FilterPanel />
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="font-body text-sm text-gris-chaud">
                <span className="font-semibold text-brun">{filtered.length}</span> produit{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
              </p>

              <div className="flex items-center gap-3">
                {/* Mobile filter btn */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal size={16} /> Filtres
                </Button>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="font-body text-sm bg-blanc-casse border border-sable rounded-btn px-3 py-2 text-brun focus:outline-none focus:ring-2 focus:ring-ocre"
                >
                  <option value="pertinence">Pertinence</option>
                  <option value="prix-asc">Prix croissant</option>
                  <option value="prix-desc">Prix décroissant</option>
                  <option value="nouveautes">Nouveautés</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-display text-xl text-brun mb-2">Aucun produit trouvé</p>
                <p className="font-body text-gris-chaud mb-4">Essayez de modifier vos filtres</p>
                <Button variant="outline" onClick={resetFilters}>Réinitialiser les filtres</Button>
              </div>
            )}

            {/* Load more */}
            {visibleCount < filtered.length && (
              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => setVisibleCount((c) => c + 12)}>
                  Voir plus de produits
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brun/40" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-blanc-casse p-6 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg text-brun">Filtres</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-brun">
                <X size={20} />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Catalogue;
