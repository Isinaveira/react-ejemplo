import { useEffect, useState } from "react";
import type { Pokemon } from "../../Pages/Pokedex";
interface SearchBarProps {
  list: Pokemon[];
  onFilter: (filteredItems: Pokemon[]) => void;
}

function SearchBar({ list, onFilter }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (searchTerm === "") {
      onFilter(list);
      return;
    }

    const filteredItems = list.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    onFilter(filteredItems);
  }, [searchTerm, list, onFilter]);

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          name="searchBar"
          value={searchTerm}
          placeholder="Busca el pokemon por su nombre"
          onChange={handleInputChange}
        />
      </div>
    </>
  );
}

export default SearchBar;
