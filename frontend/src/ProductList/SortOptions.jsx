import { useState } from "react";

const SortOptions = ({ onMobileFilterClick }) => {
  const [sortOption, setSortOption] = useState("Relevance");
  const [showDropdown, setShowDropdown] = useState(false);

  const options = [
    "Relevance",
    "Popularity",
    "Price -- Low to High",
    "Price -- High to Low",
    "Newest First"
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mt-10">
      {/* Mobile filter button - only visible on mobile */}
      <button
        onClick={onMobileFilterClick}
        className="md:hidden flex items-center gap-1 px-3 py-1 border rounded text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        Filters
      </button>

      {/* Sort options - now visible on both mobile and desktop */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium mr-1 hidden md:inline">Sort By:</span>
        
        {/* Dropdown - now visible on both mobile and desktop */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 px-2 py-0.5 border rounded text-xs md:text-sm"
          >
            {sortOption}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showDropdown && (
            <div className="absolute z-50 right-0 mt-1 w-48 bg-white border rounded shadow-lg">
              {options.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setSortOption(option);
                    setShowDropdown(false);
                  }}
                  className={`block w-full text-left px-3 py-1 text-xs hover:bg-gray-100 ${
                    sortOption === option ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortOptions;