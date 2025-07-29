import { useState, useEffect, useCallback } from "react";
import apiClient from "../services/apiClient";

export interface Pokemon {
  name: string;
  url: string;
  imagen?: string | null;
  types?: string[];
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

interface UsePokemonDataResult {
  allPokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  fetchPokemons: () => Promise<void>;
}

export const usePokemonData = (): UsePokemonDataResult => {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener la lista inicial de Pokémon para conocer el 'count' total
      const initialResponse = await apiClient.get<PokemonListResponse>(
        "/pokemon?limit=1"
      );
      const totalCount = initialResponse.data.count;

      // Cargar todos los Pokémon de una vez
      const allPokemonsResponse = await apiClient.get<PokemonListResponse>(
        `/pokemon?limit=${totalCount}`
      );
      const dataList = allPokemonsResponse.data;

      const pokemonPromises = dataList.results.map(async (pokemon) => {
        const idPokemon = pokemon.url.split("/")[6];
        try {
          const pokemon_info = await apiClient.get(`/pokemon/${idPokemon}`);
          const imagen = pokemon_info.data.sprites?.front_default || null;
          const types =
            pokemon_info.data.types?.map(
              (type: { type: { name: string } }) => type.type.name
            ) || [];
          return { ...pokemon, imagen, types };
        } catch (error) {
          console.error(`Error fetching data for ${pokemon.name}:`, error);
          return { ...pokemon, imagen: null, types: [] };
        }
      });

      const pokemonsWithDetails = await Promise.all(pokemonPromises);
      setAllPokemons(pokemonsWithDetails);
    } catch (err) {
      console.error("Error al obtener todos los Pokémon:", err);
      setError("No se pudieron cargar todos los Pokémon. Inténtalo de nuevo.");
      setAllPokemons([]);
    } finally {
      setLoading(false);
    }
  }, []); // El callback no depende de ninguna variable externa aquí.

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  return { allPokemons, loading, error, fetchPokemons };
};