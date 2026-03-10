import { useState, useCallback } from 'react';
import type { PokemonCollection } from '../pokemon/types';
import { getCollection, addPokemon, setSelectedPokemon } from '../pokemon/collection';

export function usePokemonCollection() {
  const [collection, setCollection] = useState<PokemonCollection>(getCollection);

  const add = useCallback((id: number) => {
    const updated = addPokemon(id);
    setCollection({ ...updated });
    return updated;
  }, []);

  const select = useCallback((id: number) => {
    const updated = setSelectedPokemon(id);
    setCollection({ ...updated });
  }, []);

  const refresh = useCallback(() => {
    setCollection({ ...getCollection() });
  }, []);

  return { collection, add, select, refresh };
}
