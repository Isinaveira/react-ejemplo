// src/utils/pokemonTypesData.ts

// Importa las imágenes de los tipos de Pokémon de forma dinámica
// Asegúrate de que la ruta sea correcta según la ubicación de tus assets
const typeImages = import.meta.glob("../assets/pokemon-types/*.webp", {
  eager: true,
});

// Define la interfaz para la estructura de cada tipo
interface TypeData {
  url: string;
  color: string;
}

// Define la interfaz para el objeto completo de tipos de Pokémon
interface PokemonTypes {
  [key: string]: TypeData;
}

/**
 * Función de ayuda para obtener la URL de una imagen importada dinámicamente.
 * Maneja de forma segura el caso en que la propiedad 'default' no exista.
 * @param path La ruta relativa del archivo de imagen.
 * @returns La URL de la imagen o una cadena vacía si no se encuentra.
 */
const getImageUrl = (path: string): string => {
  const module = typeImages[path];
  // Verificamos si el módulo existe y si tiene una propiedad 'default'
  if (module && typeof module === 'object' && 'default' in module) {
    // Si existe, casteamos el módulo para acceder a su propiedad 'default'
    return (module as { default: string }).default;
  }
  return ''; // Retornamos una cadena vacía si la imagen no se encuentra o no tiene 'default'
};

const pokemonTypes: PokemonTypes = {
  bug: {
    url: getImageUrl("../assets/pokemon-types/bug.webp"),
    color: "#A8B820",
  },
  dark: {
    url: getImageUrl("../assets/pokemon-types/dark.webp"),
    color: "#705848",
  },
  dragon: {
    url: getImageUrl("../assets/pokemon-types/dragon.webp"),
    color: "#7038F8",
  },
  electric: {
    url: getImageUrl("../assets/pokemon-types/electric.webp"),
    color: "#F8D030",
  },
  fairy: {
    url: getImageUrl("../assets/pokemon-types/fairy.webp"),
    color: "#EE99AC",
  },
  fight: { // ¡IMPORTANTE! Asegúrate que el nombre del archivo sea 'fighting.webp' si la API devuelve 'fighting'
    url: getImageUrl("../assets/pokemon-types/fighting.webp"),
    color: "#C03028",
  },
  fire: {
    url: getImageUrl("../assets/pokemon-types/fire.webp"),
    color: "#F08030",
  },
  flying: {
    url: getImageUrl("../assets/pokemon-types/flying.webp"),
    color: "#A890F0",
  },
  ghost: {
    url: getImageUrl("../assets/pokemon-types/ghost.webp"),
    color: "#705898",
  },
  grass: {
    url: getImageUrl("../assets/pokemon-types/grass.webp"),
    color: "#78C850",
  },
  ground: {
    url: getImageUrl("../assets/pokemon-types/ground.webp"),
    color: "#E0C068",
  },
  ice: {
    url: getImageUrl("../assets/pokemon-types/ice.webp"),
    color: "#98D8D8",
  },
  normal: {
    url: getImageUrl("../assets/pokemon-types/normal.webp"),
    color: "#A8A878",
  },
  poison: {
    url: getImageUrl("../assets/pokemon-types/poison.webp"),
    color: "#A040A0",
  },
  psychic: {
    url: getImageUrl("../assets/pokemon-types/psychic.webp"),
    color: "#F85888",
  },
  rock: {
    url: getImageUrl("../assets/pokemon-types/rock.webp"),
    color: "#B8A038",
  },
  steel: {
    url: getImageUrl("../assets/pokemon-types/steel.webp"),
    color: "#B8B8D0",
  },
  water: {
    url: getImageUrl("../assets/pokemon-types/water.webp"),
    color: "#6890F0",
  },
};

export default pokemonTypes;
