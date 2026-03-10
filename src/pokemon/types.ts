export interface PokemonData {
  id: number;
  nameEn: string;
  nameJa: string;
  spriteUrl: string;
  types: string[];
  stats: { hp: number; attack: number; defense: number; speed: number };
  fetchedAt: number;
}

export interface PokemonCollection {
  ownedIds: number[];
  selectedId: number;
  totalPulls: number;
}

export interface PokemonCache {
  [id: number]: PokemonData;
}
