
const FilterBar = ({ activeFilter, onFilterClick }) => {

    const filters = ['Tous', 'Conférence', 'Team Building', 'Apéritif', 'Autres'];

    return (
        <>
            <div className="flex justify-start items-center gap-16 my-16 px-28">
                {filters.map((filter) => (
                    <span key={filter}
                          className={`text-lg font-medium cursor-pointer ${activeFilter === filter ? 'text-white bg-azure rounded-2xl py-1 px-3' : ''}`}
                          onClick={() => onFilterClick(filter)}
                    >{filter}</span>
                ))}
            </div>
        </>
    );
};

export default FilterBar;