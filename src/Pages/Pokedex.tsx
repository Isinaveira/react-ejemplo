import { useState, useEffect } from "react";
import "./Pokedex.css";
import SearchBar from "../Components/SearchBar/SearchBar";
import apiClient from "../services/apiClient";

// Tipo de dato PokemonList (es la lista que esperamos obetener y con la que voy a trabajar)
interface PokemonList {
  count: number;
  next: string;
  previous: null;
  results: Pokemon[];
}

export interface Pokemon {
  name: string;
  url: string;
  imagen?: string;
}

function Pokedex() {
  //states

  // Lista de pokemons ya con las imágenes
  const [myPokedexList, setMyPokedexList] = useState<Pokemon[]>([]);

  // Estado para la lista filtrada que se mostrará, inicialmente es la lista completa
  const [filteredItems, setFilteredItems] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        // 1. Obtener la lista de nombres y URLs de los Pokémon
        const response = await apiClient.get<PokemonList>("/pokemon", {
          params: {
            limit: 10000,
          },
        });

        // 2. Crear un array de promesas para obtener los detalles de cada Pokémon
        const pokemonPromises = response.data.results.map(
          async (pokemon: Pokemon) => {
            const idPokemon = pokemon.url.split("/")[6];
            try {
              // Obtener los detalles y la imagen de cada Pokémon
              const pokemon_info = await apiClient.get<any>(
                `/pokemon/${idPokemon}`
              );
              const imagen = pokemon_info.data.sprites.front_default;

              // Retornar el objeto Pokémon con su imagen
              return { ...pokemon, imagen: imagen };
            } catch (error) {
              console.error(`Error fetching data for ${pokemon.name}:`, error);
              // En caso de error, retornamos el Pokémon sin imagen para evitar fallos
              return { ...pokemon, imagen: null };
            }
          }
        );

        // 3. Esperar a que todas las promesas se resuelvan con Promise.all
        const pokemonListWithImages = await Promise.all(pokemonPromises);

        // 4. Actualizar el estado con la lista completa y corregida
        setMyPokedexList(pokemonListWithImages);
        setFilteredItems(pokemonListWithImages);
      } catch (error) {
        console.error("Error al obtener la lista principal de Pokémon:", error);
      }
    };

    fetchPokemons();
  }, []);

  //functions & handlers & hooks
  const handleFilter = (filteredItems: Pokemon[]) => {
    setFilteredItems(filteredItems);
  };


  return (
    <>
      <h1>Lista de Pokemons</h1>
      <SearchBar list={myPokedexList} onFilter={handleFilter}  />
      <div className="list">
        <ul>
          {filteredItems?.map((pokemon, index) => (
            <li key={index}>
              <div className="pokemon-container">
                <img
                  src={pokemon.imagen}
                  alt={`Aquí va la imagen del pokemon ${pokemon.name}`}
                />
                <h2>{pokemon.name}</h2>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Pokedex;
