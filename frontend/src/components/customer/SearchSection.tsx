import React from "react";


interface SearchSectionProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;

    sortOption: string;
    setSortOption: (value: string) => void;

    showAdvancedFilters: boolean;
    setShowAdvancedFilters: (value: boolean) => void;

    filterColor: string;
    setFilterColor: (value: string) => void;

    filterEngine: string;
    setFilterEngine: (value: string) => void;

    minPrice: string;
    setMinPrice: (value: string) => void;

    maxPrice: string;
    setMaxPrice: (value: string) => void;

    colors: string[];
    engineSizes: string[];

    handleSearch: () => void;
    handleReset: () => void;
}


const SearchSection: React.FC<SearchSectionProps> = ({
    searchTerm,
    setSearchTerm,
    showAdvancedFilters,
    setShowAdvancedFilters,
    filterColor,
    setFilterColor,
    filterEngine,
    setFilterEngine,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    colors,
    engineSizes,
    handleSearch,
    handleReset,
}) => {



    return (
        <div className="bg-white text-black font-semibold rounded-2xl shadow-lg border border-slate-100 p-6 mb-8 ">

            {/* Unified Search Row */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">

                {/* Search Input */}
                <div className="flex-1 relative">
                    <svg
                        className="w-5 h-5 text-black absolute left-3 top-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by brand, model, type, or year..."
                        value={searchTerm}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchTerm(value);

                            if (value === "") handleReset();
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Search Button */}
                <div className="flex-shrink-0">
                    <button
                        onClick={handleSearch}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Search
                    </button>
                </div>

            </div>



            {/* Search Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">


                {/* Advanced Filters Toggle */}
                <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 px-4 py-2 hover:bg-blue-50 rounded-lg"
                >
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 ${showAdvancedFilters ? "rotate-180" : ""
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="font-medium">
                        {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
                    </span>
                </button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="mt-6 pt-6 border-t border-slate-200">


                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* Color Filter */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Color
                            </label>
                            <select
                                value={filterColor}
                                onChange={(e) => setFilterColor(e.target.value)}
                                className="w-full px-4 py-2.5 border text-slate-500 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Colors</option>
                                {colors.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Engine Size Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Engine Size
                            </label>
                            <select
                                value={filterEngine}
                                onChange={(e) => setFilterEngine(e.target.value)}
                                className="w-full px-4 py-2.5 border text-slate-500 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Engine Sizes</option>
                                {engineSizes.map((e) => (
                                    <option key={e} value={e}>
                                        {e}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Price Range ($)
                            </label>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        placeholder="Min price"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        placeholder="Max price"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    <div className="flex items-center justify-end space-x-3 mt-4">
                        <button
                            onClick={handleSearch}
                            className="w-[120px] bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Filter
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors duration-200"
                        >
                            Reset All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchSection;
