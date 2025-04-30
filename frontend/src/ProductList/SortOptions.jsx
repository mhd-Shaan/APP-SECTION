const SortOptions = () => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pb-2">
      <span className="text-xs font-medium mr-1">Sort By:</span>
      {['Relevance', 'Popularity', 'Price -- Low to High', 'Price -- High to Low', 'Newest First'].map(option => (
        <button 
          key={option}
          className="px-2 py-0.5 border rounded-full text-xs hover:bg-gray-100"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default SortOptions;