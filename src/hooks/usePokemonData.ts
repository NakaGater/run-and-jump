import { useState, useEffect } from 'react';
import type { PokemonData } from '../pokemon/types';
import { fetchPokemonData } from '../pokemon/api';

export function usePokemonData(id: number | null) {
  const [data, setData] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id === null) {
      setData(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchPokemonData(id).then((d) => {
      if (!cancelled) {
        setData(d);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  return { data, loading };
}
