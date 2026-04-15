import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import boutiqueImage from "@/assets/boutique-caribou.jpg";
import { ChevronRight, Leaf, BookOpen, Heart, Award, MapPin, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMeta } from "@/hooks/useMeta";

const timeline = [
  { year: "2003", title: "Ouverture de la boutique", desc: "Denis Bertrand ouvre Caribou Nature au cœur de Riom avec une idée simple : proposer des jouets qui ont du sens." },
  { year: "2008", title: "1ère sélection éco-responsable", desc: "La boutique s'engage à ne référencer que des jouets fabriqués dans des matériaux durables et naturels." },
  { year: "2015", title: "Passage au Click & Collect", desc: "Pour répondre aux besoins des familles pressées, Caribou Nature lance son service Click & Collect." },
  { year: "2020", title: "Plus de 1 000 références", desc: "Le catalogue dépasse le millier de références soigneusement sélectionnées pour tous les âges." },
  { year: "2023", title: "4,7/5 sur Google", desc: "29 avis Google qui témoignent de la confiance des familles du Puy-de-Dôme depuis 20 ans." },
];

const values = [
  {
    icon: <Leaf size={22} className="text-emerald-600" />,
    bg: "bg-emerald-50 border-emerald-200",
    title: "Éco-responsable",
    points: [
      "Bois certifié FSC et PEFC",
      "Matériaux naturels : coton bio, laine, bambou",
      "Fabricants européens privilégiés",
      "Jouets durables, conçus pour durer des années",
    ],
  },
  {
    icon: <BookOpen size={22} className="text-violet-600" />,
    bg: "bg-violet-50 border-violet-200",
    title: "Éducatif & éveil",
    points: [
      "Développement de la motricité fine",
      "Stimulation de la curiosité et de la créativité",
      "Jeux qui accompagnent chaque étape du développement",
      "Sélection testée avec des pédiatres et éducateurs",
    ],
  },
  {
    icon: <Heart size={22} className="text-rose-600" />,
    bg: "bg-rose-50 border-rose-200",
    title: "Commerce local",
    points: [
      "Boutique indépendante depuis 2003",
      "Partenariats avec des artisans régionaux",
      "Conseils personnalisés pour chaque famille",
      "Ancré dans la vie du centre-ville de Riom",
    ],
  },
];

const Boutique = () => {
  useMeta({ title: "Notre boutique — Caribou Nature à Riom", description: "Découvrez l'histoire de Caribou Nature, boutique indépendante de jouets en bois et jeux éducatifs à Riom depuis 2003." });
  return (
  <div className="min-h-screen bg-background page-transition">
    <TopBar />
    <Header />
    <div className="container py-3">
      <Breadcrumb crumbs={[{ label: "Accueil", href: "/" }, { label: "Notre boutique" }]} />
    </div>

    {/* Hero */}
    <section className="relative h-64 md:h-80 overflow-hidden">
      <img
        src={boutiqueImage}
        alt="Façade de la boutique Caribou Nature à Riom"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-brun/60" />
      <div className="relative container h-full flex flex-col justify-center">
        <h1 className="text-3xl md:text-5xl font-display font-semibold text-creme mb-3">
          Notre boutique
        </h1>
        <p className="font-body text-sable text-lg max-w-xl">
          Depuis 2003 à Riom, une boutique pensée pour l'émerveillement des enfants et la tranquillité des parents.
        </p>
      </div>
    </section>

    {/* Notre histoire */}
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-ocre/15 text-ocre text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase font-body">
              Notre histoire
            </span>
            <h2 className="mb-5">Un projet né de la passion</h2>
            <p className="font-body text-gris-chaud leading-relaxed mb-4">
              Denis Bertrand a ouvert Caribou Nature en 2003 avec une conviction : il est possible de proposer des jouets beaux, durables et éducatifs sans passer par les grandes surfaces.
            </p>
            <p className="font-body text-gris-chaud leading-relaxed mb-4">
              Installé au cœur de Riom, au 12 rue Saint-Amable, le magasin s'est progressivement imposé comme une référence pour les familles du Puy-de-Dôme cherchant des alternatives de qualité.
            </p>
            <p className="font-body text-gris-chaud leading-relaxed">
              Chaque jouet est sélectionné à la main, testé et conseillé avec sincérité. Ici, on ne vend pas juste un produit — on propose une expérience d'achat humaine, chaleureuse et éclairée.
            </p>
          </div>

          {/* Citation */}
          <div className="bg-gradient-to-br from-ocre/20 to-terracotta/10 rounded-card p-10 text-center border border-ocre/20">
            <div className="text-6xl mb-6">🦌</div>
            <p className="font-display text-xl text-brun font-medium leading-relaxed italic mb-4">
              « Un jouet de qualité, c'est un jouet qui dure, qui grandit avec l'enfant et nourrit son imagination pour des années. »
            </p>
            <p className="font-body text-gris-chaud text-sm font-semibold">
              — Denis Bertrand, gérant de Caribou Nature
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="py-16 bg-sable">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-3">23 ans d'histoire</h2>
          <p className="font-body text-gris-chaud">Les grandes étapes de Caribou Nature</p>
        </div>
        <div className="relative max-w-3xl mx-auto">
          {/* Ligne verticale */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-ocre/30 -translate-x-1/2" />
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <div key={item.year} className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-ocre border-2 border-blanc-casse z-10 mt-1.5" />
                {/* Content */}
                <div className={`ml-14 md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:pr-10" : "md:pl-10"}`}>
                  <div className="bg-blanc-casse rounded-card p-5 shadow-card">
                    <span className="inline-block bg-ocre text-blanc-casse text-xs font-semibold px-3 py-1 rounded-full mb-2 font-body">
                      {item.year}
                    </span>
                    <h3 className="text-base mb-1">{item.title}</h3>
                    <p className="font-body text-gris-chaud text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Nos valeurs */}
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-3">Nos engagements</h2>
          <p className="font-body text-gris-chaud max-w-xl mx-auto">
            Chaque choix éditorial repose sur trois piliers fondamentaux qui guident notre sélection depuis 2003.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div key={v.title} className={`rounded-card p-8 border-2 ${v.bg}`}>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                {v.icon}
              </div>
              <h3 className="mb-4">{v.title}</h3>
              <ul className="space-y-2">
                {v.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 font-body text-sm text-gris-chaud">
                    <span className="text-ocre mt-0.5">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Infos pratiques */}
    <section className="py-16 bg-kraft">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-3">Venir nous voir</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Carte */}
          <div className="rounded-card overflow-hidden shadow-card h-80">
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
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-ocre" />
              <div>
                <p className="font-body font-semibold text-brun">12 rue Saint-Amable</p>
                <p className="font-body text-gris-chaud text-sm">63200 Riom, Puy-de-Dôme</p>
              </div>
            </div>

            <div className="flex items-start gap-2 mb-6">
              <Clock size={18} className="text-ocre mt-0.5" />
              <div className="font-body text-sm space-y-1.5">
                <div className="flex justify-between gap-8 text-brun"><span>Lundi</span><span className="text-terracotta font-semibold">Fermé</span></div>
                <div className="flex justify-between gap-8 text-brun"><span>Mardi – Vendredi</span><span>9h30–12h · 14h–19h</span></div>
                <div className="flex justify-between gap-8 text-brun"><span>Samedi</span><span>9h30–12h30 · 14h30–19h</span></div>
                <div className="flex justify-between gap-8 text-brun"><span>Dimanche</span><span className="text-terracotta font-semibold">Fermé</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Phone size={18} className="text-ocre" />
              <a href="tel:0473648055" className="font-body font-semibold text-ocre hover:text-terracotta transition-colors">
                04 73 64 80 55
              </a>
            </div>

            <div className="mt-6">
              <Button variant="default" asChild className="w-full">
                <a href="/contact">
                  Nous contacter <ChevronRight size={16} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
  );
};

export default Boutique;
