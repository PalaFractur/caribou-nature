import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import SkeletonCard from "@/components/SkeletonCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useMeta } from "@/hooks/useMeta";

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

// ─── helpers ─────────────────────────────────────────────────────────────────

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function buildParams(
  base: URLSearchParams,
  patch: Record<string, string | null>
): URLSearchParams {
  const next = new URLSearchParams(base);
  for (const [key, val] of Object.entries(patch)) {
    if (val === null || val === "") {
      next.delete(key);
    } else {
      next.set(key, val);
    }
  }
  return next;
}

// ─────────────────────────────────────────────────────────────────────────────

const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── read filters from URL ─────────────────────────────────────────────────
  const search = searchParams.get("q") ?? "";
  const selectedCategories = parseList(searchParams.get("cat"));
  const selectedAges = parseList(searchParams.get("age"));
  const priceMin = Number(searchParams.get("min") ?? 0);
  const priceMax = Number(searchParams.get("max") ?? 150);
  const priceRange: [number, number] = [priceMin, priceMax];
  const newOnly = searchParams.get("new") === "1";
  const sort = (searchParams.get("sort") as SortOption) ?? "pertinence";

  // ── local UI state ────────────────────────────────────────────────────────
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const firstRender = useRef(true);

  useMeta({
    title: "Catalogue — Jouets en bois et jeux éducatifs",
    description: "Plus de 1 000 références de jouets en bois, jeux éducatifs et jeux de société. Filtrez par âge, catégorie et budget.",
    url: "/catalogue",
  });

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setLoading(false);
    }
  }, []);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [searchParams.toString()]);

  // ── setters that update URL ───────────────────────────────────────────────

  const setSearch = useCallback((val: string) => {
    setSearchParams((prev) => buildParams(prev, { q: val || null }), { replace: true });
  }, [setSearchParams]);

  const toggleCategory = useCallback((cat: string) => {
    setSearchParams((prev) => {
      const current = parseList(prev.get("cat"));
      const next = current.includes(cat)
        ? current.filter((c) => c !== cat)
        : [...current, cat];
      return buildParams(prev, { cat: next.join(",") || null });
    }, { replace: true });
  }, [setSearchParams]);

  const toggleAge = useCallback((label: string) => {
    setSearchParams((prev) => {
      const current = parseList(prev.get("age"));
      const next = current.includes(label)
        ? current.filter((a) => a !== label)
        : [...current, label];
      return buildParams(prev, { age: next.join(",") || null });
    }, { replace: true });
  }, [setSearchParams]);

  const setPriceRange = useCallback((val: [number, number]) => {
    setSearchParams((prev) => buildParams(prev, {
      min: val[0] === 0 ? null : String(val[0]),
      max: val[1] === 150 ? null : String(val[1]),
    }), { replace: true });
  }, [setSearchParams]);

  const setNewOnly = useCallback((val: boolean) => {
    setSearchParams((prev) => buildParams(prev, { new: val ? "1" : null }), { replace: true });
  }, [setSearchParams]);

  const setSort = useCallback((val: SortOption) => {
    setSearchParams((prev) => buildParams(prev, { sort: val === "pertinence" ? null : val }), { replace: true });
  }, [setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters =
    search || selectedCategories.length > 0 || selectedAges.length > 0 ||
    priceMin > 0 || priceMax < 150 || newOnly || sort !== "pertinence";

  // ── filtering & sorting ───────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedAges.length > 0) {
      result = result.filter((p) =>
        selectedAges.some((label) => {
          const range = ageRanges.find((r) => r.label === label);
          if (!range) return false;
          return p.ageMin <= range.max && p.ageMax >= range.min;
        })
      );
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (newOnly) result = result.filter((p) => p.isNew);

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

  // ── filter panel (reused for desktop & mobile) ────────────────────────────

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
      <Button variant="outline" className="w-full" onClick={resetFilters} disabled={!hasActiveFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-creme page-transition">
      <TopBar />
      <Header />

      <div className="container py-3">
        <Breadcrumb crumbs={[{ label: "Accueil", href: "/" }, { label: "Catalogue" }]} />
      </div>

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
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gris-chaud hover:text-brun transition-colors"
                aria-label="Effacer la recherche"
              >
                <X size={16} />
              </button>
            )}
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
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-body text-sm text-gris-chaud">
                  <span className="font-semibold text-brun">{filtered.length}</span> produit{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 font-body text-xs text-terracotta hover:underline"
                  >
                    <X size={12} /> Effacer les filtres
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter btn */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal size={16} /> Filtres
                  {hasActiveFilters && (
                    <span className="ml-1 bg-ocre text-white rounded-full text-xs w-4 h-4 flex items-center justify-center shrink-0">
                      {[
                        selectedCategories.length,
                        selectedAges.length,
                        newOnly ? 1 : 0,
                        priceMin > 0 || priceMax < 150 ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}
                    </span>
                  )}
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

            {/* Active filter chips */}
            {(selectedCategories.length > 0 || selectedAges.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-1 bg-ocre/10 border border-ocre/30 text-ocre text-xs font-body font-semibold px-2.5 py-1 rounded-full hover:bg-ocre/20 transition-colors"
                  >
                    {cat} <X size={11} />
                  </button>
                ))}
                {selectedAges.map((age) => (
                  <button
                    key={age}
                    onClick={() => toggleAge(age)}
                    className="flex items-center gap-1 bg-vert-sauge/10 border border-vert-sauge/30 text-vert-sauge text-xs font-body font-semibold px-2.5 py-1 rounded-full hover:bg-vert-sauge/20 transition-colors"
                  >
                    {age} <X size={11} />
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : visibleProducts.length > 0 ? (
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
                  Voir plus de produits ({filtered.length - visibleCount} restants)
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
