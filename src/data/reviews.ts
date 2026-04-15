export interface Review {
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export const reviewsBySlug: Record<string, Review[]> = {
  "tracteur-remorque-bois": [
    { author: "Sophie M.", rating: 5, date: "12 mars 2025", comment: "Mon fils de 3 ans est absolument fou de ce tracteur ! La qualité du bois est remarquable, les roues tournent bien et la remorque se détache facilement. Un jouet qui en a sous le capot !" },
    { author: "Laurent D.", rating: 5, date: "5 février 2025", comment: "Magnifique jouet, solide et bien fini. Mon fils joue avec depuis 6 mois et il est comme neuf. Le personnel de la boutique nous a très bien conseillés." },
    { author: "Amélie R.", rating: 4, date: "20 janvier 2025", comment: "Très joli jouet, bonne qualité de fabrication. Petit bémol sur la taille un peu petite pour mon fils de 4 ans, mais il adore quand même !" },
  ],
  "oeuf-pour-oeuf": [
    { author: "Clara B.", rating: 5, date: "8 avril 2025", comment: "Parfait pour mon bébé de 8 mois ! Les matières sont très douces et sécurisées. Il adore le tenir dans ses petites mains." },
    { author: "Thomas G.", rating: 5, date: "14 mars 2025", comment: "Un jouet d'éveil simple et efficace. Ma fille a adoré dès les premiers jours. Livraison rapide et emballage soigné." },
    { author: "Marine L.", rating: 4, date: "2 février 2025", comment: "Très bon jouet d'éveil, les couleurs sont jolies et les matières de qualité. Ma petite puce est ravie !" },
  ],
  "microscope-nomade": [
    { author: "Nicolas P.", rating: 5, date: "20 mars 2025", comment: "Mon fils de 9 ans est passionné depuis qu'on lui a offert ce microscope ! Il observe tout : insectes, feuilles, sa propre peau... Un cadeau parfait pour piquer la curiosité." },
    { author: "Isabelle F.", rating: 5, date: "10 janvier 2025", comment: "Excellent rapport qualité/prix. Très facile à utiliser pour un enfant. Les lames livrées avec sont déjà une belle initiation à la biologie." },
    { author: "Paul S.", rating: 4, date: "5 décembre 2024", comment: "Bon microscope pour débuter. L'éclairage LED est suffisant et les grossissements permettent déjà de belles découvertes. Je recommande." },
  ],
  "canards-bain": [
    { author: "Julie M.", rating: 5, date: "1er avril 2025", comment: "Ces petits canards sont adorables ! Mon fils de 18 mois les adore. La qualité du caoutchouc naturel est au rendez-vous, aucune mauvaise odeur." },
    { author: "Stéphanie K.", rating: 5, date: "15 mars 2025", comment: "Le bain est devenu son moment préféré de la journée grâce à ces canards. Bien finis, solides et jolis. Je recommande à 100% !" },
    { author: "François V.", rating: 4, date: "20 février 2025", comment: "Très bons jouets de bain, sans danger pour bébé. Les 3 tailles différentes permettent de jouer avec l'emboîtement. Ma fille est fan !" },
  ],
  "poule-bois-mecanique": [
    { author: "Mélanie C.", rating: 5, date: "25 mars 2025", comment: "Un grand classique qui fait toujours autant d'effet ! Mon fils de 2 ans hurle de rire quand la poule picore. La qualité est vraiment au rendez-vous." },
    { author: "David H.", rating: 5, date: "14 février 2025", comment: "Offert pour les 2 ans de ma nièce, c'est un succès total. Le mécanisme à ficelle est simple et robuste. Beau jouet en bois bien fini." },
    { author: "Aurélie B.", rating: 5, date: "3 janvier 2025", comment: "Magnifique jouet traditionnel. On dirait presque un objet artisanal tellement c'est bien fait. Mon petit garçon l'adore depuis des mois !" },
  ],
  "homard-bois-articule": [
    { author: "Pierre M.", rating: 5, date: "18 avril 2025", comment: "Un objet magnifique autant qu'un jouet ! Mon fils de 4 ans l'appelle son 'meilleur ami'. Les articulations sont très bien conçues et résistent bien." },
    { author: "Céline D.", rating: 4, date: "10 mars 2025", comment: "Très joli homard, peint à la main avec soin. Les articulations sont souples et amusantes. Parfait pour un enfant curieux du monde marin." },
    { author: "Antoine R.", rating: 5, date: "22 janvier 2025", comment: "On a craqué pour sa beauté ! C'est aussi bien un jouet qu'un objet déco pour la chambre de mon fils. Qualité artisanale incontestable." },
  ],
  "poussin-sonore": [
    { author: "Emma L.", rating: 5, date: "5 avril 2025", comment: "Mon bébé de 4 mois adore agripper ce petit poussin ! Le couineur le fait rire aux éclats. Caoutchouc doux et sécurisé, parfait." },
    { author: "Hugo B.", rating: 5, date: "20 mars 2025", comment: "Excellent jouet d'éveil. Mon fils le mâchouille, le serre, l'agite... et le son le fait rire à chaque fois. Un must-have !" },
    { author: "Léa F.", rating: 4, date: "8 février 2025", comment: "Très bon achat. Doux, sécurisé, lavable. Mon bébé l'adore. Je regrette juste qu'il soit un peu petit — mais c'est pour un tout-petit donc c'est normal !" },
  ],
  "puzzle-ferme": [
    { author: "Sandrine M.", rating: 5, date: "22 mars 2025", comment: "Un puzzle magnifique ! Les pièces sont épaisses et faciles à manipuler pour les petites mains. Mon fils de 4 ans est très fier de le réussir seul." },
    { author: "Olivier C.", rating: 5, date: "5 janvier 2025", comment: "Très bon puzzle en bois. Les illustrations sont jolies et les animaux facilement reconnaissables. Idéal pour apprendre les animaux de la ferme." },
    { author: "Claire V.", rating: 4, date: "12 décembre 2024", comment: "Beau puzzle solide. Les pièces s'emboîtent bien et ne se défont pas trop facilement. Un bon niveau de difficulté pour 3-4 ans." },
  ],
  "hansel-gretel": [
    { author: "Marie-Anne D.", rating: 5, date: "15 avril 2025", comment: "Un jeu de société coopératif vraiment bien pensé ! On joue ensemble et les enfants adorent le côté conte de fées. À partir de 5 ans sans problème." },
    { author: "Bruno L.", rating: 5, date: "2 mars 2025", comment: "Excellent jeu familial ! Mes enfants de 5 et 7 ans y jouent au moins 3 fois par semaine. Le côté coopératif est vraiment enrichissant pour eux." },
    { author: "Nathalie P.", rating: 4, date: "18 janvier 2025", comment: "Jeu de bonne qualité, les illustrations sont magnifiques. Un peu complexe pour les 4 ans mais parfait dès 5 ans. Très bonne expérience en boutique aussi !" },
  ],
  "loup-sept-chevreaux": [
    { author: "Alexandre M.", rating: 5, date: "30 mars 2025", comment: "Un jeu original où un joueur joue le loup contre les autres ! Mon fils de 6 ans s'est pris au jeu immédiatement. Bonne durabilité des pièces." },
    { author: "Virginie H.", rating: 4, date: "10 février 2025", comment: "Très bon jeu de plateau. Les figurines en bois sont jolies et les règles sont accessibles dès 5-6 ans. On y joue souvent en famille !" },
    { author: "Romain F.", rating: 5, date: "5 janvier 2025", comment: "Un jeu qui renouvelle le plaisir à chaque partie grâce au bluff. Mes enfants adorent jouer le loup ! Qualité du matériel impeccable." },
  ],
  "kit-collage-pompons": [
    { author: "Lucie B.", rating: 5, date: "8 avril 2025", comment: "Ma fille de 5 ans a passé tout un après-midi à créer ses animaux en pompons ! Simple, propre et créatif. Le kit contient tout le nécessaire." },
    { author: "Éric D.", rating: 4, date: "25 février 2025", comment: "Très bon kit créatif. Les pompons sont de belle qualité et nombreux. Les instructions sont claires. Un activité parfaite pour rainy days !" },
    { author: "Morgane T.", rating: 5, date: "14 janvier 2025", comment: "Offert pour l'anniversaire de ma nièce, c'est un carton ! Elle a créé tout un zoo en pompons. Simple, amusant et sans ciseaux — parfait." },
  ],
  "marionnette-loup": [
    { author: "Sabine M.", rating: 5, date: "2 avril 2025", comment: "Cette marionnette est magnifique ! Mon fils de 4 ans invente des histoires pendant des heures. La peluche est très douce et la gueule s'ouvre bien." },
    { author: "Julien A.", rating: 5, date: "20 mars 2025", comment: "Excellent jouet pour stimuler l'imaginaire ! Le loup est expressif et de bonne taille. On s'amuse en famille à inventer des contes." },
    { author: "Hélène V.", rating: 4, date: "5 février 2025", comment: "Belle marionnette, bien finie. Les yeux brodés sont détail rassurant (aucune petite pièce). Ma fille de 6 ans l'adore pour ses spectacles de chambre !" },
  ],
  "dinette-bois": [
    { author: "Camille D.", rating: 5, date: "18 mars 2025", comment: "Une dînette magnifique ! Mon fils de 3 ans prépare des repas pour toute la famille depuis qu'il l'a reçue. La qualité du bois est top." },
    { author: "Florent L.", rating: 5, date: "6 février 2025", comment: "Très belle finition, bois bien verni, aucune aspérité. Les pièces sont stables et bien proportionnées. Un beau cadeau qui durera longtemps." },
    { author: "Sylvie M.", rating: 4, date: "19 décembre 2024", comment: "Très joli set de dînette. La boîte de rangement est pratique. Seul bémol : les assiettes glissent un peu sur les surfaces lisses. Sinon parfait !" },
  ],
  "7-familles-nature": [
    { author: "Pascal B.", rating: 5, date: "25 avril 2025", comment: "Un jeu des 7 familles qui sort du lot grâce au thème nature. Mes enfants ont appris plein de noms d'espèces en jouant. Les illustrations sont superbes." },
    { author: "Anaïs F.", rating: 5, date: "10 mars 2025", comment: "Parfait pour jouer en famille ! Les enfants apprennent sans s'en rendre compte. Cartes solides et illustrations magnifiques. Je recommande vivement." },
    { author: "Gilles T.", rating: 4, date: "28 janvier 2025", comment: "Très bon jeu de cartes, belle qualité d'impression. Les familles sont bien choisies. Idéal pour un goûter d'anniversaire ou en voyage." },
  ],
  "deguisement-renard": [
    { author: "Charlotte P.", rating: 5, date: "1er avril 2025", comment: "Mon fils est fou de ce déguisement ! Il est doux, confortable et vraiment joli. On l'a utilisé pour carnaval et tout le monde l'admirait." },
    { author: "Bertrand L.", rating: 4, date: "15 mars 2025", comment: "Très beau déguisement, tissu de qualité. La queue et les oreilles sont bien fixées. Mon fils refuse de l'enlever même après les fêtes !" },
    { author: "Valérie H.", rating: 5, date: "5 février 2025", comment: "Parfait pour le carnaval de l'école ! La taille 5-7 ans va bien à mon fils de 6 ans. Velours très doux et facile à enfiler. Merci Caribou Nature !" },
  ],
  "xylophone-bois": [
    { author: "Arnaud M.", rating: 5, date: "20 mars 2025", comment: "Mon fils de 18 mois est fan ! Les sons sont clairs et harmonieux, rien à voir avec les xylophones plastiques des grandes surfaces. Belle qualité." },
    { author: "Delphine R.", rating: 5, date: "10 février 2025", comment: "Un jouet musical de qualité. Les baguettes sont bien faites et les touches produisent de vrais sons musicaux. Mon enfant joue tous les jours !" },
    { author: "Michel T.", rating: 4, date: "2 janvier 2025", comment: "Très joli xylophone en bois. Les couleurs sont vives et les notes accordées. Un peu petit pour un enfant de 3 ans, mais parfait pour 1-2 ans." },
  ],
  "circuit-billes": [
    { author: "Clément B.", rating: 5, date: "28 mars 2025", comment: "Un circuit de billes extraordinaire ! Mon fils de 6 ans y passe des après-midis entiers. Les possibilités d'assemblage sont infinies. Un vrai bonheur !" },
    { author: "Estelle M.", rating: 5, date: "15 février 2025", comment: "Le jouet que mon fils attendait ! Les 52 pièces permettent vraiment de créer des circuits impressionnants. Excellent pour la motricité et la logique." },
    { author: "Didier L.", rating: 4, date: "5 janvier 2025", comment: "Très bon circuit de billes, bien conçu. Quelques pièces nécessitent un peu de dextérité pour les assembler, mais c'est aussi ce qui le rend intéressant !" },
  ],
  "livre-foret-petits": [
    { author: "Noémie F.", rating: 5, date: "10 avril 2025", comment: "Un livre d'éveil magnifique ! Les textures sont variées et douces. Mon bébé de 6 mois adore passer ses mains sur chaque page. Les illustrations sont adorables." },
    { author: "Rémi D.", rating: 5, date: "28 mars 2025", comment: "Parfait pour les tout-petits. Les pages sont solides, les images lumineuses. On lit ce livre tous les soirs, c'est devenu un rituel pour notre bébé !" },
    { author: "Aurélie C.", rating: 4, date: "14 janvier 2025", comment: "Très joli livre d'éveil. Les textures sont bien intégrées. J'aurais aimé plus de pages, mais pour l'âge visé c'est parfait. Mon fils adore !" },
  ],
  "construction-magnetique": [
    { author: "Sébastien R.", rating: 5, date: "5 avril 2025", comment: "Un jeu de construction révolutionnaire ! Mon fils de 7 ans crée des structures en 3D impressionnantes. Les aimants sont puissants et les pièces solides." },
    { author: "Patricia L.", rating: 5, date: "20 mars 2025", comment: "Excellent jouet de construction ! Ma fille de 6 ans et moi passons des moments formidables à construire ensemble. Facile à prendre en main, infini en créativité." },
    { author: "Jean-Marc T.", rating: 4, date: "8 février 2025", comment: "Très bon jeu magnétique. Les plaques s'assemblent facilement et tiennent bien. Seul bémol : il faut un peu d'espace pour construire. Mais le résultat est impressionnant !" },
  ],
  "peluche-renard": [
    { author: "Laure B.", rating: 5, date: "15 avril 2025", comment: "Cette peluche est un vrai coup de cœur ! Le pelage roux est incroyablement doux. Ma fille de 4 ans en est inséparable depuis qu'elle l'a reçue." },
    { author: "Thibaut M.", rating: 5, date: "2 mars 2025", comment: "Une peluche de grande qualité. Le rembourrage est ferme sans être dur. Les détails (museau, yeux brodés, queue) sont très bien réalisés. On craque !" },
    { author: "Margot H.", rating: 4, date: "20 janvier 2025", comment: "Très jolie peluche, douce et réaliste. Ma fille adore son 'renard'. Elle a déjà passé la machine et est ressortie comme neuve. Un achat sans regret !" },
  ],
};

// Génère des avis génériques pour les slugs sans avis spécifiques
const genericReviews: Review[] = [
  { author: "Marie L.", rating: 5, date: "10 mars 2025", comment: "Excellent produit, conforme à la description. Mon enfant adore ! La qualité est au rendez-vous et la boutique Caribou Nature est vraiment au top." },
  { author: "Julien B.", rating: 4, date: "25 février 2025", comment: "Très bon achat, livraison soignée. Bonne qualité de fabrication. Je recommande sans hésitation cette boutique spécialisée." },
  { author: "Sophie D.", rating: 5, date: "5 janvier 2025", comment: "Parfait pour l'anniversaire de ma fille. Le personnel nous a très bien conseillés. On reviendra sans hésiter !" },
];

export function getReviews(slug: string): Review[] {
  return reviewsBySlug[slug] ?? genericReviews;
}

export function getAverageRating(slug: string): number {
  const reviews = getReviews(slug);
  return Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
}
