import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-caribou.jpg";
import boutiqueImage from "@/assets/boutique-caribou.jpg";
import { ChevronRight, Star } from "lucide-react";
import { useState } from "react";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ToyStore",
  name: "Caribou Nature",
  description: "Boutique de jouets en bois, jeux éducatifs et jeux de société à Riom, Puy-de-Dôme.",
  url: "https://caribounature-riom.fr",
  telephone: "+33473648055",
  email: "caribounature@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "12 rue Saint-Amable",
    addressLocality: "Riom",
    postalCode: "63200",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 45.8942,
    longitude: 3.1131,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "19:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/Caribounature/",
    "https://www.instagram.com/caribou.nature/",
  ],
  priceRange: "€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Cash, Credit Card",
};

const ageGroups = [
  { emoji: "🍼", label: "0 – 1 an", bg: "bg-ocre/15", query: "0-1" },
  { emoji: "🐣", label: "2 – 3 ans", bg: "bg-terracotta/15", query: "2-3" },
  { emoji: "🌟", label: "4 – 6 ans", bg: "bg-vert-sauge/15", query: "4-6" },
  { emoji: "🎨", label: "7 – 10 ans", bg: "bg-brun/10", query: "7-10" },
  { emoji: "🧩", label: "10 ans et +", bg: "bg-sable", query: "10+" },
  { emoji: "👨‍👩‍👧", label: "Toute la famille", bg: "bg-creme", query: "all" },
];

const reviews = [
  "Un magasin absolument charmant, véritable caverne d'Ali Baba pour les amateurs de jeux de qualité. L'accueil est chaleureux et les conseils excellents.",
  "La gérante connaît les jeux et les conseils sont au rendez-vous. On ne veut plus aller en grande surface après un passage à Caribou Nature !",
  "Une sélection variée avec des articles adaptés à tous les âges et budgets. Un vrai plaisir de soutenir un commerce local aussi bien tenu.",
  "Un magasin féerique avec des jouets qui sortent du lot. Les gérants sont d'une grande aide et compétents. Je recommande vivement.",
  "Une adresse incontournable pour vos achats anniversaires ou Noël. Des produits peu communs pour offrir un cadeau vraiment singulier.",
];

const reviewAuthors = ["Marie L.", "Thomas R.", "Sophie D.", "Laurent M.", "Claire B."];

const Index = () => {
  const newProducts = products.filter((p) => p.isNew).slice(0, 8);
  const [activeReview, setActiveReview] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd id="local-business" data={localBusinessSchema} />
      <TopBar />
      <Header />

      {/* Hero */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src={heroImage}
          alt="Enfant jouant avec des jouets en bois dans la boutique Caribou Nature à Riom"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-creme/50" />
        <div className="relative container h-full flex flex-col justify-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-brun leading-tight mb-4 animate-fade-in">
            Des jouets qui durent, des souvenirs qui restent
          </h1>
          <p className="font-body text-gris-chaud text-lg md:text-xl mb-8 animate-fade-in" style={{ animationDelay: "0.15s" }}>
            Boutique spécialisée jouets en bois et jeux éducatifs · Riom (63) depuis 2003
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="lg" asChild>
              <a href="/catalogue">Découvrir le catalogue</a>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <a href="/boutique">Notre histoire</a>
            </Button>
          </div>
        </div>
        {/* Floating review badge */}
        <div className="absolute bottom-6 right-6 bg-blanc-casse border border-ocre/30 rounded-card px-4 py-3 shadow-card hidden md:flex items-center gap-2">
          <div className="flex text-ocre">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 5 ? "currentColor" : "none"} />)}
          </div>
          <span className="font-body text-sm text-brun font-semibold">4,7/5 · 29 avis Google</span>
        </div>
      </section>

      {/* Wave separator */}
      <div className="relative -mt-1">
        <svg viewBox="0 0 1440 40" className="w-full block" preserveAspectRatio="none">
          <path fill="hsl(33, 28%, 85%)" d="M0,20 C360,40 720,0 1080,20 C1260,30 1380,25 1440,20 L1440,40 L0,40 Z" />
        </svg>
      </div>

      {/* Réassurance */}
      <section className="bg-sable py-8">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🚚", text: "Livraison gratuite dès 20 € sur Riom-Limagne" },
            { icon: "🎁", text: "Emballage cadeau offert sur chaque commande" },
            { icon: "🏪", text: "Click & Collect — prêt en 2h" },
            { icon: "❤️", text: "Commerce local indépendant depuis 2003" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <p className="font-body text-sm text-brun font-semibold">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Idées cadeaux par âge */}
      <section className="py-16 md:py-20">
        <div className="container text-center">
          <h2 className="mb-2">Trouvez le cadeau parfait</h2>
          <p className="font-body text-gris-chaud mb-10">Sélectionnez l'âge de l'enfant pour découvrir nos coups de cœur</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
            {ageGroups.map((group) => (
              <a
                key={group.query}
                href={`/catalogue?age=${group.query}`}
                className={`${group.bg} rounded-card p-4 md:p-6 flex flex-col items-center gap-2 hover:shadow-soft transition-all duration-200 hover:-translate-y-1`}
              >
                <span className="text-3xl md:text-4xl">{group.emoji}</span>
                <span className="font-body text-xs md:text-sm font-semibold text-brun">{group.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Wave */}
      <div className="relative">
        <svg viewBox="0 0 1440 30" className="w-full block" preserveAspectRatio="none">
          <path fill="hsl(38, 50%, 97%)" d="M0,15 C480,30 960,0 1440,15 L1440,30 L0,30 Z" />
        </svg>
      </div>

      {/* Nouveautés */}
      <section className="bg-blanc-casse py-16 md:py-20">
        <div className="container">
          <h2 className="text-center mb-2">Récemment arrivés en boutique</h2>
          <p className="font-body text-gris-chaud text-center mb-10">Découvrez nos dernières trouvailles</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <a href="/catalogue?new=true">Voir toutes les nouveautés <ChevronRight size={16} /></a>
            </Button>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-16 md:py-20 bg-kraft">
        <div className="container">
          <h2 className="text-center mb-10">Pourquoi choisir Caribou Nature ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🌿", title: "Jouets éco-responsables", text: "Nous sélectionnons des jouets fabriqués dans des matériaux durables, sûrs pour vos enfants et respectueux de l'environnement." },
              { icon: "🎓", title: "Jeux qui font grandir", text: "Chaque jouet proposé stimule la créativité, la motricité ou l'imaginaire. Parce que jouer c'est aussi apprendre." },
              { icon: "🧡", title: "Conseils personnalisés", text: "Notre équipe connaît chaque produit. On vous aide à trouver le jouet parfait selon l'âge, la personnalité et le budget." },
            ].map((item, i) => (
              <div key={i} className="bg-blanc-casse rounded-card p-8 text-center shadow-card">
                <span className="text-5xl block mb-4">{item.icon}</span>
                <h3 className="mb-3">{item.title}</h3>
                <p className="font-body text-gris-chaud">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avis clients */}
      <section className="py-16 md:py-20 bg-creme">
        <div className="container text-center">
          <h2 className="mb-2">Ils nous font confiance</h2>
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="flex text-ocre">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <span className="font-body text-brun font-semibold">4,7/5 sur Google</span>
          </div>

          {/* Desktop: all cards, Mobile: carousel */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-4">
            {reviews.map((review, i) => (
              <div key={i} className="bg-blanc-casse rounded-card p-6 shadow-card text-left transform rotate-[-1deg] hover:rotate-0 transition-transform duration-200" style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}>
                <div className="flex text-ocre mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
                </div>
                <p className="font-body text-sm text-brun mb-3 leading-relaxed">"{review}"</p>
                <p className="font-body text-xs text-gris-chaud font-semibold">— {reviewAuthors[i]}</p>
              </div>
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden">
            <div className="bg-blanc-casse rounded-card p-6 shadow-card text-left mx-auto max-w-sm">
              <div className="flex text-ocre mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
              </div>
              <p className="font-body text-sm text-brun mb-3 leading-relaxed">"{reviews[activeReview]}"</p>
              <p className="font-body text-xs text-gris-chaud font-semibold">— {reviewAuthors[activeReview]}</p>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReview(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeReview ? 'bg-ocre' : 'bg-sable'}`}
                  aria-label={`Avis ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <a href="https://g.page/caribounature/review" target="_blank" rel="noopener noreferrer" className="inline-block mt-8 font-body font-semibold text-ocre hover:text-terracotta transition-colors">
            Laisser un avis sur Google →
          </a>
        </div>
      </section>

      {/* Notre boutique */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <img
              src={boutiqueImage}
              alt="Façade de la boutique Caribou Nature à Riom"
              className="rounded-card shadow-card w-full"
              loading="lazy"
              width={1280}
              height={960}
            />
            <div>
              <h2 className="mb-4">Une boutique pensée pour l'émerveillement</h2>
              <p className="font-body text-gris-chaud leading-relaxed mb-6">
                Depuis 2003, Denis Bertrand et son équipe vous accueillent au cœur de Riom dans un espace pensé pour faire pétiller les yeux des petits… et des grands. Plus de 1 000 références soigneusement choisies, des conseils sincères, et la garantie de trouver ce que les grandes surfaces ne proposent pas.
              </p>
              <Button variant="outline" size="lg" asChild>
                <a href="/boutique">Découvrir notre histoire <ChevronRight size={16} /></a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wave */}
      <div className="relative">
        <svg viewBox="0 0 1440 30" className="w-full block" preserveAspectRatio="none">
          <path fill="hsl(33, 28%, 85%)" d="M0,10 C360,30 720,5 1080,20 C1260,28 1380,15 1440,10 L1440,30 L0,30 Z" />
        </svg>
      </div>

      {/* Infos pratiques */}
      <section className="bg-sable py-16 md:py-20">
        <div className="container">
          <h2 className="text-center mb-10">Infos pratiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Map */}
            <div className="rounded-card overflow-hidden shadow-card h-80 md:h-full min-h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2785.5!2d3.112793!3d45.893745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f71bdc25ed9c1d%3A0x3e64eb5c3b9f6e92!2s12%20Rue%20Saint-Amable%2C%2063200%20Riom!5e0!3m2!1sfr!2sfr!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Caribou Nature Riom"
              />
            </div>

            {/* Infos */}
            <div className="bg-blanc-casse rounded-card p-8 shadow-card">
              <h3 className="mb-6">📍 Caribou Nature</h3>
              <p className="font-body text-brun mb-1">12 rue Saint-Amable, 63200 Riom</p>
              <p className="font-body text-gris-chaud text-sm mb-6">Puy-de-Dôme, Auvergne</p>

              <h4 className="mb-3">Horaires d'ouverture</h4>
              <div className="font-body text-sm space-y-1.5 mb-6">
                <div className="flex justify-between text-brun"><span>Lundi</span><span className="text-terracotta">Fermé</span></div>
                <div className="flex justify-between text-brun"><span>Mardi – Vendredi</span><span>9h30-12h · 14h-19h</span></div>
                <div className="flex justify-between text-brun"><span>Samedi</span><span>9h30-12h30 · 14h30-19h</span></div>
                <div className="flex justify-between text-brun"><span>Dimanche</span><span className="text-terracotta">Fermé</span></div>
              </div>

              <div className="space-y-2 font-body text-sm">
                <p><a href="tel:0473648055" className="text-ocre hover:text-terracotta font-semibold transition-colors">📞 04 73 64 80 55</a></p>
                <p><a href="mailto:caribounature@gmail.com" className="text-ocre hover:text-terracotta font-semibold transition-colors">✉️ caribounature@gmail.com</a></p>
                <div className="flex gap-4 pt-2">
                  <a href="https://www.facebook.com/Caribounature/" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta font-semibold transition-colors">Facebook</a>
                  <a href="https://www.instagram.com/caribou.nature/" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta font-semibold transition-colors">Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
