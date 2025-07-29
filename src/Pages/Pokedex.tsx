import { useState, useEffect, useMemo } from "react";
import "./Pokedex.css";
import SearchBar from "../Components/SearchBar/SearchBar";
import { usePokemonData } from "../hooks/usePokemonData"; // Importa el custom hook
import pokemonTypes from "../utils/pokemonTypes";

function Pokedex() {
  // Usamos el custom hook para obtener todos los Pokémon
  const { allPokemons, loading, error } = usePokemonData();

  // Estados para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  // Estados para la paginación local
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(15); // La cantidad de Pokémon por página

  // Pokémon filtrados y/o buscados (aplicado sobre allPokemons)
  const filteredAndSearchedPokemons = useMemo(() => {
    let currentPokemons = allPokemons;

    // 1. Filtrar por tipo
    if (filterType) {
      currentPokemons = currentPokemons.filter((pokemon) =>
        pokemon.types?.includes(filterType)
      );
    }

    // 2. Buscar por nombre
    if (searchTerm.trim().length > 0) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentPokemons = currentPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return currentPokemons;
  }, [allPokemons, searchTerm, filterType]);

  // Lógica de paginación para la lista filtrada/buscada
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemonsToDisplay = filteredAndSearchedPokemons.slice(
    indexOfFirstPokemon,
    indexOfLastPokemon
  );

  const totalPages = Math.ceil(
    filteredAndSearchedPokemons.length / pokemonsPerPage
  );

  // Reiniciar la paginación cuando cambian los filtros/búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleTypeFilter = (type: string) => {
    setFilterType(type);
    // No reseteamos el searchTerm aquí, permitimos que se combine el filtro con la búsqueda
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterType("");
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Renderizado de estado de carga
  if (loading) {
    return (
      <div className="container loading-container">
        <p>Cargando todos los Pokémon...</p>
      </div>
    );
  }

  // Renderizado de error
  if (error) {
    return (
      <div className="container error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Lista de Pokémon</h1>
      <SearchBar onSearch={handleSearch} onReset={handleReset} />

      {/* Selector de tipo para filtrar */}
      <div className="type-filter">
        <label htmlFor="type-select">Filtrar por tipo:</label>
        <select
          id="type-select"
          onChange={(e) => handleTypeFilter(e.target.value)}
          value={filterType}
        >
          <option value="">Todos los tipos</option>
          {Object.keys(pokemonTypes).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="list">
        <ul>
          {currentPokemonsToDisplay.length > 0 ? (
            currentPokemonsToDisplay.map((pokemon, index) => (
              <li key={pokemon.name + index}>
                <div className="pokemon-container">
                  <img
                    className="pokemon-image"
                    src={
                      pokemon.imagen ||
                      "https://placehold.co/96x96/E0E0E0/FFFFFF?text=No+Img"
                    }
                    alt={`Imagen de ${pokemon.name}`}
                  />
                  <div className="pokemon-types">
                    {pokemon.types?.map((type, typeIndex) => {
                      const typeData = pokemonTypes[type];
                      if (typeData?.url && typeData?.color) {
                        return (
                          <span
                            key={typeIndex}
                            className="type-pill"
                            style={{
                              color: typeData.color,
                              border: `solid 1px ${typeData.color}`,
                              borderRadius: "15px",
                              padding: "2px",
                              minWidth: "70px",
                            }}
                          >
                            <img
                              src={typeData.url}
                              width="20px"
                              height="20px"
                              alt={type}
                              title={type}
                              className="type-icon"
                            />
                            <span className="type-name capitalize">
                              {type}
                            </span>
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <h2>{pokemon.name}</h2>
                </div>
              </li>
            ))
          ) : (
            <p>No se encontraron Pokémon que coincidan con los criterios.</p>
          )}
        </ul>
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <h3>
          Página {currentPage} de {totalPages}
        </h3>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Pokedex;