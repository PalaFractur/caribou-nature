import { useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useMeta } from "@/hooks/useMeta";
import { ChevronLeft } from "lucide-react";

type AgeRange = "0-1 an" | "2-3 ans" | "4-6 ans" | "7-10 ans" | "10+ ans" | "Toute la famille";
type Budget = "Moins de 20 €" | "20 – 40 €" | "40 – 70 €" | "Plus de 70 €";
type Interest =
  | "Créativité"
  | "Nature & sciences"
  | "Histoires & imaginaire"
  | "Musique"
  | "Jeux de société"
  | "Sport & plein-air"
  | "Construction"
  | "Poupées & peluches";
type Occasion = "Anniversaire" | "Noël" | "Naissance" | "Cadeau sans occasion";

interface Answers {
  age: AgeRange | null;
  budget: Budget | null;
  interests: Interest[];
  occasion: Occasion | null;
}

const AGE_RANGES: AgeRange[] = ["0-1 an", "2-3 ans", "4-6 ans", "7-10 ans", "10+ ans", "Toute la famille"];
const BUDGETS: Budget[] = ["Moins de 20 €", "20 – 40 €", "40 – 70 €", "Plus de 70 €"];
const INTERESTS: Interest[] = [
  "Créativité", "Nature & sciences", "Histoires & imaginaire", "Musique",
  "Jeux de société", "Sport & plein-air", "Construction", "Poupées & peluches",
];
const OCCASIONS: Occasion[] = ["Anniversaire", "Noël", "Naissance", "Cadeau sans occasion"];

const STEPS = [
  { title: "Quel âge a l'enfant ?", subtitle: "Sélectionnez la tranche d'âge" },
  { title: "Quel est votre budget ?", subtitle: "Choisissez votre enveloppe" },
  { title: "Quels sont ses centres d'intérêt ?", subtitle: "Sélectionnez au moins 2 centres d'intérêt" },
  { title: "Quelle est l'occasion ?", subtitle: "Pour quel événement est ce cadeau ?" },
];

function ageMatches(ageRange: AgeRange, ageMin: number, ageMax: number): boolean {
  if (ageRange === "Toute la famille") return true;
  const ranges: Record<AgeRange, [number, number]> = {
    "0-1 an": [0, 1],
    "2-3 ans": [2, 3],
    "4-6 ans": [4, 6],
    "7-10 ans": [7, 10],
    "10+ ans": [10, 99],
    "Toute la famille": [0, 99],
  };
  const [rMin, rMax] = ranges[ageRange];
  // Product age range overlaps with selected range
  return ageMin <= rMax && ageMax >= rMin;
}

function budgetMatches(budget: Budget, price: number): boolean {
  if (budget === "Moins de 20 €") return price < 20;
  if (budget === "20 – 40 €") return price >= 20 && price <= 40;
  if (budget === "40 – 70 €") return price > 40 && price <= 70;
  if (budget === "Plus de 70 €") return price > 70;
  return true;
}

function interestMatches(interests: Interest[], category: string): boolean {
  if (interests.length === 0) return true;
  const map: Record<Interest, string[]> = {
    "Créativité": ["Loisirs créatifs & puzzles", "Marionnettes & figurines", "Déguisements & accessoires"],
    "Nature & sciences": ["Jeux de société & éducatifs", "Plein-air & musique"],
    "Histoires & imaginaire": ["Marionnettes & figurines", "Naissance & bébé", "Déguisements & accessoires"],
    "Musique": ["Plein-air & musique"],
    "Jeux de société": ["Jeux de société & éducatifs"],
    "Sport & plein-air": ["Plein-air & musique"],
    "Construction": ["Jeux d'imitation & construction", "Jouets en bois & éveil"],
    "Poupées & peluches": ["Poupées & peluches", "Naissance & bébé"],
  };
  return interests.some((i) => map[i]?.includes(category));
}

export default function Quiz() {
  useMeta({
    title: "Quiz cadeau — Caribou Nature",
    description: "Trouvez le cadeau idéal pour l'enfant grâce à notre quiz d'aide au choix.",
  });

  const [step, setStep] = useState(1);
  const [visible, setVisible] = useState(true);
  const [answers, setAnswers] = useState<Answers>({
    age: null,
    budget: null,
    interests: [],
    occasion: null,
  });

  function transition(fn: () => void) {
    setVisible(false);
    setTimeout(() => {
      fn();
      setVisible(true);
    }, 220);
  }

  function nextStep() {
    transition(() => setStep((s) => s + 1));
  }

  function prevStep() {
    transition(() => setStep((s) => s - 1));
  }

  function selectAge(age: AgeRange) {
    setAnswers((a) => ({ ...a, age }));
    nextStep();
  }

  function selectBudget(budget: Budget) {
    setAnswers((a) => ({ ...a, budget }));
    nextStep();
  }

  function toggleInterest(interest: Interest) {
    setAnswers((a) => {
      const has = a.interests.includes(interest);
      return {
        ...a,
        interests: has
          ? a.interests.filter((i) => i !== interest)
          : [...a.interests, interest],
      };
    });
  }

  function selectOccasion(occasion: Occasion) {
    setAnswers((a) => ({ ...a, occasion }));
    nextStep();
  }

  // Filter products for results
  const matchingProducts = products.filter((p) => {
    if (answers.age && !ageMatches(answers.age, p.ageMin, p.ageMax)) return false;
    if (answers.budget && !budgetMatches(answers.budget, p.price)) return false;
    if (answers.interests.length > 0 && !interestMatches(answers.interests, p.category)) return false;
    return true;
  }).slice(0, 6);

  const progressPercent = Math.min(((step - 1) / 4) * 100, 100);

  function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className={`px-5 py-3 rounded-card font-body font-semibold text-sm border-2 transition-all duration-150 ${
          selected
            ? "bg-ocre text-white border-ocre shadow-md"
            : "bg-blanc-casse text-brun border-sable hover:border-ocre/60 hover:bg-ocre/5"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-background page-transition">
      <TopBar />
      <Header />

      <section className="container max-w-2xl py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">🎁</span>
          <h1 className="text-3xl md:text-4xl mb-2">Aide au choix cadeau</h1>
          <p className="font-body text-gris-chaud">
            Répondez à 4 questions pour trouver le cadeau parfait
          </p>
        </div>

        {step <= 4 && (
          <>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="font-body text-xs text-gris-chaud">Étape {step} / 4</span>
                <span className="font-body text-xs text-gris-chaud">{Math.round(progressPercent)} %</span>
              </div>
              <div className="h-2 bg-sable rounded-full overflow-hidden">
                <div
                  className="h-full bg-ocre rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Step content */}
            <div
              style={{ opacity: visible ? 1 : 0, transition: "opacity 0.22s ease-out" }}
              className="bg-blanc-casse rounded-card shadow-card p-8"
            >
              {/* Back button */}
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-1 font-body text-sm text-gris-chaud hover:text-brun transition-colors mb-5"
                >
                  <ChevronLeft size={16} /> Retour
                </button>
              )}

              <h2 className="text-2xl mb-1">{STEPS[step - 1].title}</h2>
              <p className="font-body text-sm text-gris-chaud mb-6">{STEPS[step - 1].subtitle}</p>

              {/* Step 1 — Age */}
              {step === 1 && (
                <div className="flex flex-wrap gap-3">
                  {AGE_RANGES.map((age) => (
                    <Chip
                      key={age}
                      label={age}
                      selected={answers.age === age}
                      onClick={() => selectAge(age)}
                    />
                  ))}
                </div>
              )}

              {/* Step 2 — Budget */}
              {step === 2 && (
                <div className="flex flex-wrap gap-3">
                  {BUDGETS.map((budget) => (
                    <Chip
                      key={budget}
                      label={budget}
                      selected={answers.budget === budget}
                      onClick={() => selectBudget(budget)}
                    />
                  ))}
                </div>
              )}

              {/* Step 3 — Interests (multi-select) */}
              {step === 3 && (
                <div>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {INTERESTS.map((interest) => (
                      <Chip
                        key={interest}
                        label={interest}
                        selected={answers.interests.includes(interest)}
                        onClick={() => toggleInterest(interest)}
                      />
                    ))}
                  </div>
                  <Button
                    onClick={nextStep}
                    disabled={answers.interests.length < 2}
                    className="w-full"
                  >
                    Continuer
                    {answers.interests.length < 2 && (
                      <span className="ml-2 text-xs opacity-70">
                        (sélectionnez au moins 2)
                      </span>
                    )}
                  </Button>
                </div>
              )}

              {/* Step 4 — Occasion */}
              {step === 4 && (
                <div className="flex flex-wrap gap-3">
                  {OCCASIONS.map((occasion) => (
                    <Chip
                      key={occasion}
                      label={occasion}
                      selected={answers.occasion === occasion}
                      onClick={() => selectOccasion(occasion)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Results — step 5 */}
        {step === 5 && (
          <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.22s ease-out" }}>
            <div className="text-center mb-8">
              <span className="text-3xl block mb-3">✨</span>
              <h2 className="text-2xl mb-2">Nos suggestions pour vous</h2>
              {answers.age && answers.budget && (
                <p className="font-body text-sm text-gris-chaud">
                  Pour <strong>{answers.age}</strong> · Budget : <strong>{answers.budget}</strong>
                </p>
              )}
            </div>

            {matchingProducts.length === 0 ? (
              <div className="bg-blanc-casse rounded-card shadow-card p-10 text-center">
                <span className="text-5xl block mb-4">🦌</span>
                <h3 className="text-xl mb-3">Aucun résultat trouvé</h3>
                <p className="font-body text-gris-chaud mb-6">
                  Nous n'avons pas trouvé de produit correspondant exactement à vos critères.
                  Explorez notre catalogue complet pour découvrir tous nos jouets.
                </p>
                <Button asChild>
                  <Link to="/catalogue">Voir tout le catalogue</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {matchingProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <div className="text-center space-y-3">
                  <Button asChild variant="outline" size="lg">
                    <Link to="/catalogue">Voir tout le catalogue</Link>
                  </Button>
                  <p className="font-body text-xs text-gris-chaud">
                    <button
                      onClick={() => transition(() => setStep(1))}
                      className="text-ocre hover:text-terracotta underline"
                    >
                      Recommencer le quiz
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
