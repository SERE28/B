export const CATEGORY_MAP: Record<string, string> = {
  fantasy: "Fantasía",
  "science fiction": "Ciencia ficción",
  romance: "Romance",
  thriller: "Thriller",
  mystery: "Misterio",
  horror: "Terror",
  adventure: "Aventura",
  young: "Juvenil",
  classics: "Clásicos",
  history: "Historia",
  philosophy: "Filosofía",
  nonfiction: "No ficción",
  "self help": "Autoayuda",
  manga: "Manga",
};

// 🔄 Inverso ES → EN
export const CATEGORY_MAP_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([en, es]) => [es, en]),
);
