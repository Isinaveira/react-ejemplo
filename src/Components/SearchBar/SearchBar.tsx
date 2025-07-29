import { useEffect, useState } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onReset: () => void;  // corregido, función sin parámetros
}

function SearchBar({ onSearch, onReset }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
    if (term.trim() === "") {
      onReset();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm.trim());
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="searchBar"
        className="search-bar"
        value={searchTerm}
        placeholder="Busca el Pokémon por su nombre"
        onChange={handleChange}
      />
    </form>
  );
}

export default SearchBar;
