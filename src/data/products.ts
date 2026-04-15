export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  ageMin: number;
  ageMax: number;
  category: string;
  isNew: boolean;
  image: string;
  description: string;
  details: string[];
  stock: number;
}

export const products: Product[] = [
  {
    id: 1, name: "Tracteur et remorque en bois", slug: "tracteur-remorque-bois",
    price: 32, ageMin: 2, ageMax: 5, category: "Jouets en bois & éveil", isNew: true,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Un magnifique tracteur en bois avec sa remorque amovible, idéal pour stimuler l'imaginaire et la motricité des tout-petits. Fabriqué en bois certifié FSC, ce jouet robuste accompagnera les aventures agricoles de votre enfant pendant des années.",
    details: ["Bois certifié FSC", "Peintures non toxiques", "Remorque amovible", "Dimensions : 28 x 10 x 12 cm", "Fabriqué en Europe", "Conforme EN71"],
    stock: 8,
  },
  {
    id: 2, name: "Œuf pour œuf (jouet d'éveil)", slug: "oeuf-pour-oeuf",
    price: 18, ageMin: 0, ageMax: 2, category: "Naissance & bébé", isNew: false,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Ce jouet d'éveil en bois doux invite bébé à découvrir les formes, les couleurs et la logique de l'emboîtement. Parfait pour les premières explorations sensorielles dès les premiers mois de vie.",
    details: ["Bois et textiles naturels", "Couleurs douces non toxiques", "Stimule la motricité fine", "Dimensions : 12 x 8 cm", "Lavable", "Dès la naissance"],
    stock: 14,
  },
  {
    id: 3, name: "Microscope nomade", slug: "microscope-nomade",
    price: 45, ageMin: 7, ageMax: 12, category: "Jeux de société & éducatifs", isNew: true,
    image: "https://images.unsplash.com/photo-1582571352032-448f7928eca3?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Un vrai microscope compact pour les petits scientifiques en herbe ! Léger, robuste et facile à utiliser, il permet d'observer insectes, feuilles, minéraux et bien d'autres merveilles du monde microscopique.",
    details: ["Grossissement x 30 à x 100", "Éclairage LED intégré", "Livré avec 5 lames préparées", "Piles incluses", "Poids : 320g", "Manuel d'utilisation en français"],
    stock: 5,
  },
  {
    id: 4, name: "Canards de bain Lilliputiens", slug: "canards-bain",
    price: 12, ageMin: 0, ageMax: 3, category: "Naissance & bébé", isNew: false,
    image: "https://images.unsplash.com/photo-1563901935883-cb61f6f01178?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Un adorable set de canards en caoutchouc naturel pour transformer le bain en moment magique. Sans BPA, sans PVC, sans phtalates : la sécurité avant tout pour les bébés.",
    details: ["Caoutchouc naturel 100%", "Sans BPA, PVC et phtalates", "Set de 3 canards tailles différentes", "Convient au bain et à la piscine", "Lavable au lave-vaisselle", "Certifié CE"],
    stock: 20,
  },
  {
    id: 5, name: "Poule en bois mécanique", slug: "poule-bois-mecanique",
    price: 22, ageMin: 2, ageMax: 4, category: "Jouets en bois & éveil", isNew: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Tirez la ficelle et regardez la poule piquer du bec ! Ce classique en bois ravit les enfants depuis des générations grâce à son mécanisme simple et son mouvement amusant. Un jouet intemporel qui fait toujours son effet.",
    details: ["Bois de tilleul verni", "Mécanisme à ficelle", "Peintures à l'eau non toxiques", "Dimensions : 15 x 8 x 10 cm", "Artisanat traditionnel", "Conforme EN71"],
    stock: 11,
  },
  {
    id: 6, name: "Homard en bois articulé", slug: "homard-bois-articule",
    price: 28, ageMin: 3, ageMax: 6, category: "Jouets en bois & éveil", isNew: false,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Ce magnifique homard en bois articulé est un jouet autant qu'un objet décoratif. Ses articulations souples permettent de le positionner de mille façons, éveillant curiosité et créativité chez l'enfant.",
    details: ["Bois de hêtre", "Articulations souples durables", "Peint à la main", "Longueur : 35 cm", "Décoration & jeu", "Certifié FSC"],
    stock: 7,
  },
  {
    id: 7, name: "Poussin sonore", slug: "poussin-sonore",
    price: 15, ageMin: 0, ageMax: 2, category: "Naissance & bébé", isNew: true,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Appuyez sur ce petit poussin et il couine! Ce jouet d'éveil sonore en caoutchouc naturel est parfait pour stimuler l'ouïe et la curiosité de bébé. Doux au toucher, sûr à mâchouiller.",
    details: ["Caoutchouc naturel", "Couineur intégré", "Sans BPA et phtalates", "Lavable à l'eau", "Hauteur : 9 cm", "Dès la naissance"],
    stock: 18,
  },
  {
    id: 8, name: "Puzzle ferme 36 pièces", slug: "puzzle-ferme",
    price: 24, ageMin: 3, ageMax: 6, category: "Loisirs créatifs & puzzles", isNew: false,
    image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Un puzzle en bois représentant une ferme et ses animaux avec 36 pièces épaisses, parfaites pour les petites mains. Les illustrations colorées et détaillées raviront les amoureux de la nature et des animaux.",
    details: ["36 pièces épaisses en bois", "Illustration recto-verso", "Boîte de rangement incluse", "Dimensions puzzle : 50 x 35 cm", "Peintures non toxiques", "Certifié FSC"],
    stock: 9,
  },
  {
    id: 9, name: "Jeu Hansel et Gretel", slug: "hansel-gretel",
    price: 35, ageMin: 4, ageMax: 8, category: "Jeux de société & éducatifs", isNew: true,
    image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Un jeu de société coopératif inspiré du conte Hansel et Gretel. Les enfants doivent s'entraider pour retrouver le chemin de la maison avant que la nuit tombe. Développe la coopération, la mémoire et la stratégie.",
    details: ["2 à 4 joueurs", "Durée : 20-30 minutes", "Jeu 100% coopératif", "Cartes illustrées", "Règles en français", "Fabriqué en Allemagne"],
    stock: 6,
  },
  {
    id: 10, name: "Le loup et les sept chevreaux", slug: "loup-sept-chevreaux",
    price: 29, ageMin: 5, ageMax: 10, category: "Jeux de société & éducatifs", isNew: false,
    image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Un jeu de plateau captivant qui remet au goût du jour le conte des frères Grimm. Un joueur incarne le loup, les autres les chevreaux. Stratégie, bluff et mémorisation sont au rendez-vous.",
    details: ["2 à 5 joueurs", "Durée : 25-40 minutes", "Plateau en carton épais", "Figurines en bois peintes", "Règles en français", "Dès 5 ans"],
    stock: 10,
  },
  {
    id: 11, name: "Kit collage de pompons", slug: "kit-collage-pompons",
    price: 14, ageMin: 4, ageMax: 8, category: "Loisirs créatifs & puzzles", isNew: false,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Un kit créatif complet pour créer des animaux, des personnages et des décors à partir de pompons colorés. Simple, propre et tellement amusant ! Idéal pour développer la créativité et la motricité fine.",
    details: ["200 pompons multicolores", "Colle repositionnable incluse", "4 modèles à réaliser", "Yeux autocollants", "Conseils créatifs", "Activité sans ciseaux"],
    stock: 15,
  },
  {
    id: 12, name: "Marionnette loup en peluche", slug: "marionnette-loup",
    price: 19, ageMin: 3, ageMax: 8, category: "Marionnettes & figurines", isNew: true,
    image: "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Ce loup en peluche format marionnette à main offre des heures de jeu symbolique et d'improvisation théâtrale. Doux et expressif, il devient vite le compagnon préféré des histoires inventées.",
    details: ["Peluche très douce", "Convient aux mains adultes et enfants", "Lavable machine 30°", "Hauteur : 32 cm", "Yeux brodés (pas de petites pièces)", "Certifié CE"],
    stock: 12,
  },
  {
    id: 13, name: "Dînette en bois 12 pièces", slug: "dinette-bois",
    price: 38, ageMin: 2, ageMax: 6, category: "Jeux d'imitation & construction", isNew: false,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Une magnifique dînette en bois comprenant assiettes, verres, couverts et ustensiles. Parfaite pour jouer à la marchande ou à la cuisinière, elle stimule le jeu symbolique et le langage.",
    details: ["12 pièces en bois de hêtre", "Vernis alimentaire non toxique", "Boîte de rangement en bois", "Dimensions boîte : 25 x 20 x 8 cm", "Peintures à l'eau", "Certifié FSC"],
    stock: 8,
  },
  {
    id: 14, name: "Jeu des 7 familles nature", slug: "7-familles-nature",
    price: 9, ageMin: 6, ageMax: 12, category: "Jeux de société & éducatifs", isNew: false,
    image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Le classique jeu des 7 familles revisité sur le thème de la nature : oiseaux, insectes, fleurs, arbres… Tout en jouant, les enfants apprennent à identifier des espèces de notre environnement.",
    details: ["42 cartes illustrées", "7 familles de 6 membres", "Illustrations botaniques & animalières", "2 à 6 joueurs", "Durée : 15-20 minutes", "Fabriqué en France"],
    stock: 22,
  },
  {
    id: 15, name: "Déguisement petit renard", slug: "deguisement-renard",
    price: 42, ageMin: 3, ageMax: 8, category: "Déguisements & accessoires", isNew: true,
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Un adorable déguisement de renard avec queue touffue, oreilles dressées et combinaison confortable. Idéal pour les fêtes, carnavals ou simplement pour les après-midi de jeu imaginaire à la maison.",
    details: ["Combinaison velours douce", "Queue et oreilles incluses", "Tailles 3-4 ans et 5-7 ans", "Lavable machine 30°", "Matières certifiées OEKO-TEX", "Sans accessoires dangereux"],
    stock: 4,
  },
  {
    id: 16, name: "Xylophone en bois coloré", slug: "xylophone-bois",
    price: 17, ageMin: 1, ageMax: 4, category: "Plein-air & musique", isNew: false,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Ce xylophone en bois aux touches colorées permet à l'enfant de découvrir la musique de façon ludique. Chaque touche produit une note claire et agréable. Livré avec ses deux baguettes.",
    details: ["8 touches en bois de tilleul", "Sons harmonieux et précis", "2 baguettes incluses", "Longueur : 30 cm", "Peintures non toxiques", "Certifié EN71"],
    stock: 13,
  },
  {
    id: 17, name: "Circuit de billes 52 pièces", slug: "circuit-billes",
    price: 65, ageMin: 4, ageMax: 10, category: "Jeux d'imitation & construction", isNew: true,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Un circuit de billes géant à construire soi-même ! Avec 52 pièces modulables, les possibilités sont infinies. Spirales, zigzags, loopings… l'imagination est la seule limite. Un classique qui ne se démode jamais.",
    details: ["52 pièces modulables", "10 billes incluses", "Compatible avec autres circuits de la marque", "Hauteur max : 65 cm", "Bois et plastique certifiés", "Notice illustrée"],
    stock: 3,
  },
  {
    id: 18, name: "Livre animé La forêt des petits", slug: "livre-foret-petits",
    price: 11, ageMin: 0, ageMax: 3, category: "Naissance & bébé", isNew: false,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Un livre d'éveil aux textures et aux animaux de la forêt. Chaque page propose une matière différente à toucher, idéal pour éveiller les sens de bébé et créer les premiers moments de lecture partagée.",
    details: ["10 pages cartonnées épaisses", "Matières à toucher sur chaque page", "Illustrations douces aquarelle", "Dimensions : 20 x 20 cm", "Papier certifié PEFC", "Résistant à la salive"],
    stock: 17,
  },
  {
    id: 19, name: "Jeu de construction magnétique", slug: "construction-magnetique",
    price: 58, ageMin: 5, ageMax: 12, category: "Jeux d'imitation & construction", isNew: false,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Des plaques magnétiques colorées qui s'assemblent en 3D pour créer maisons, châteaux, véhicules et structures géométriques. Développe la pensée spatiale, la créativité et la logique de construction.",
    details: ["32 plaques magnétiques", "Aimants puissants et sécurisés", "Compatible avec sets additionnels", "Boîte de rangement incluse", "Plastique ABS certifié", "Conforme EN71"],
    stock: 6,
  },
  {
    id: 20, name: "Peluche renard des bois 30cm", slug: "peluche-renard",
    price: 26, ageMin: 0, ageMax: 99, category: "Poupées & peluches", isNew: true,
    image: "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=600&h=600&fit=crop&fm=webp&q=80",
    description: "Une peluche renard ultra-douce au pelage roux et blanc réaliste. Ses yeux brodés et sa queue touffue en font un compagnon irrésistible pour les enfants comme pour les collectionneurs. Un cadeau qui fait toujours son effet.",
    details: ["Peluche très douce", "Hauteur : 30 cm", "Rembourrage polyester recyclé", "Yeux brodés (pas de pièces détachables)", "Lavable machine 30°", "Certifié CE et OEKO-TEX"],
    stock: 9,
  },
];
