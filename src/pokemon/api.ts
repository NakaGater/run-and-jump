import type { PokemonData, PokemonCache } from './types';

const CACHE_KEY = 'run-and-jump-pokemon-cache';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function getCache(): PokemonCache {
  try {
    const val = localStorage.getItem(CACHE_KEY);
    return val ? JSON.parse(val) : {};
  } catch {
    return {};
  }
}

function setCache(cache: PokemonCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore
  }
}

export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export async function fetchPokemonData(id: number): Promise<PokemonData> {
  const cache = getCache();
  const cached = cache[id];
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached;
  }

  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ]);

  const pokemon = await pokemonRes.json();
  const species = await speciesRes.json();

  const jaName = species.names?.find(
    (n: { language: { name: string }; name: string }) => n.language.name === 'ja',
  );

  const data: PokemonData = {
    id,
    nameEn: pokemon.name,
    nameJa: jaName?.name ?? pokemon.name,
    spriteUrl: getSpriteUrl(id),
    types: pokemon.types.map((t: { type: { name: string } }) => t.type.name),
    stats: {
      hp: pokemon.stats[0]?.base_stat ?? 0,
      attack: pokemon.stats[1]?.base_stat ?? 0,
      defense: pokemon.stats[2]?.base_stat ?? 0,
      speed: pokemon.stats[5]?.base_stat ?? 0,
    },
    fetchedAt: Date.now(),
  };

  cache[id] = data;
  setCache(cache);
  return data;
}

export function loadPokemonImage(id: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = getSpriteUrl(id);
  });
}
