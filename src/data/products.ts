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
}

export const products: Product[] = [
  { id: 1, name: "Tracteur et remorque en bois", slug: "tracteur-remorque-bois", price: 32, ageMin: 2, ageMax: 5, category: "Jouets en bois & éveil", isNew: true, image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop" },
  { id: 2, name: "Œuf pour œuf (jouet d'éveil)", slug: "oeuf-pour-oeuf", price: 18, ageMin: 0, ageMax: 2, category: "Naissance & bébé", isNew: false, image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop" },
  { id: 3, name: "Microscope nomade", slug: "microscope-nomade", price: 45, ageMin: 7, ageMax: 12, category: "Jeux de société & éducatifs", isNew: true, image: "https://images.unsplash.com/photo-1582571352032-448f7928eca3?w=400&h=400&fit=crop" },
  { id: 4, name: "Canards de bain Lilliputiens", slug: "canards-bain", price: 12, ageMin: 0, ageMax: 3, category: "Naissance & bébé", isNew: false, image: "https://images.unsplash.com/photo-1563901935883-cb61f6f01178?w=400&h=400&fit=crop" },
  { id: 5, name: "Poule en bois mécanique", slug: "poule-bois-mecanique", price: 22, ageMin: 2, ageMax: 4, category: "Jouets en bois & éveil", isNew: true, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop" },
  { id: 6, name: "Homard en bois articulé", slug: "homard-bois-articule", price: 28, ageMin: 3, ageMax: 6, category: "Jouets en bois & éveil", isNew: false, image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop" },
  { id: 7, name: "Poussin sonore", slug: "poussin-sonore", price: 15, ageMin: 0, ageMax: 2, category: "Naissance & bébé", isNew: true, image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop" },
  { id: 8, name: "Puzzle ferme 36 pièces", slug: "puzzle-ferme", price: 24, ageMin: 3, ageMax: 6, category: "Loisirs créatifs & puzzles", isNew: false, image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400&h=400&fit=crop" },
  { id: 9, name: "Jeu Hansel et Gretel", slug: "hansel-gretel", price: 35, ageMin: 4, ageMax: 8, category: "Jeux de société & éducatifs", isNew: true, image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=400&fit=crop" },
  { id: 10, name: "Le loup et les sept chevreaux", slug: "loup-sept-chevreaux", price: 29, ageMin: 5, ageMax: 10, category: "Jeux de société & éducatifs", isNew: false, image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=400&fit=crop" },
  { id: 11, name: "Kit collage de pompons", slug: "kit-collage-pompons", price: 14, ageMin: 4, ageMax: 8, category: "Loisirs créatifs & puzzles", isNew: false, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop" },
  { id: 12, name: "Marionnette loup en peluche", slug: "marionnette-loup", price: 19, ageMin: 3, ageMax: 8, category: "Marionnettes & figurines", isNew: true, image: "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400&h=400&fit=crop" },
  { id: 13, name: "Dînette en bois 12 pièces", slug: "dinette-bois", price: 38, ageMin: 2, ageMax: 6, category: "Jeux d'imitation & construction", isNew: false, image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop" },
  { id: 14, name: "Jeu des 7 familles nature", slug: "7-familles-nature", price: 9, ageMin: 6, ageMax: 12, category: "Jeux de société & éducatifs", isNew: false, image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=400&fit=crop" },
  { id: 15, name: "Déguisement petit renard", slug: "deguisement-renard", price: 42, ageMin: 3, ageMax: 8, category: "Déguisements & accessoires", isNew: true, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop" },
  { id: 16, name: "Xylophone en bois coloré", slug: "xylophone-bois", price: 17, ageMin: 1, ageMax: 4, category: "Plein-air & musique", isNew: false, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop" },
  { id: 17, name: "Circuit de billes 52 pièces", slug: "circuit-billes", price: 65, ageMin: 4, ageMax: 10, category: "Jeux d'imitation & construction", isNew: true, image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop" },
  { id: 18, name: "Livre animé La forêt des petits", slug: "livre-foret-petits", price: 11, ageMin: 0, ageMax: 3, category: "Naissance & bébé", isNew: false, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop" },
  { id: 19, name: "Jeu de construction magnétique", slug: "construction-magnetique", price: 58, ageMin: 5, ageMax: 12, category: "Jeux d'imitation & construction", isNew: false, image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop" },
  { id: 20, name: "Peluche renard des bois 30cm", slug: "peluche-renard", price: 26, ageMin: 0, ageMax: 99, category: "Poupées & peluches", isNew: true, image: "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400&h=400&fit=crop" },
];
