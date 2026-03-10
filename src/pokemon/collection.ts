import type { PokemonCollection } from './types';
import { DEFAULT_POKEMON_ID } from '../game/constants';

const COLLECTION_KEY = 'run-and-jump-pokemon-collection';

function defaultCollection(): PokemonCollection {
  return {
    ownedIds: [DEFAULT_POKEMON_ID],
    selectedId: DEFAULT_POKEMON_ID,
    totalPulls: 0,
  };
}

export function getCollection(): PokemonCollection {
  try {
    const val = localStorage.getItem(COLLECTION_KEY);
    if (!val) return defaultCollection();
    const parsed = JSON.parse(val) as PokemonCollection;
    if (!parsed.ownedIds || parsed.ownedIds.length === 0) return defaultCollection();
    return parsed;
  } catch {
    return defaultCollection();
  }
}

export function saveCollection(collection: PokemonCollection): void {
  try {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  } catch {
    // Private browsing or quota exceeded
  }
}

export function addPokemon(id: number): PokemonCollection {
  const col = getCollection();
  if (!col.ownedIds.includes(id)) {
    col.ownedIds.push(id);
  }
  col.totalPulls += 1;
  saveCollection(col);
  return col;
}

export function setSelectedPokemon(id: number): PokemonCollection {
  const col = getCollection();
  col.selectedId = id;
  saveCollection(col);
  return col;
}
