import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Vehicle } from "../../api/vehicleApi";
import API from "../../api/vehicleApi";
import SearchSection from "../../components/customer/SearchSection";
import Header from '../../components/customer/Header';

const CustomerDashboard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filtered, setFiltered] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [sortOption, setSortOption] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const navigate = useNavigate();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Filter state
  const [filterColor, setFilterColor] = useState("");
  const [filterEngine, setFilterEngine] = useState("");

  // Dropdown options
  const colors = ["red", "blue", "black", "white", "silver", "gray"]
  const engineSizes = ["10l", "11l", "12l", "13l", "14l", "15l"];

  // Load vehicles
  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await API.getVehicles();
      setVehicles(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // Apply Search and Filter together
  const handleSearch = () => {
    let data = [...vehicles];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (v) =>
          v.brand.toLowerCase().includes(term) ||
          v.model.toLowerCase().includes(term) ||
          v.type.toLowerCase().includes(term) ||
          String(v.year).includes(term)
      );
    }

    // Search filters
    if (minPrice) data = data.filter((v) => v.price >= Number(minPrice));
    if (maxPrice) data = data.filter((v) => v.price <= Number(maxPrice));

    // Advanced filters
    if (filterColor) data = data.filter((v) => v.color === filterColor);
    if (filterEngine) data = data.filter((v) => v.engineSize === filterEngine);

    setFiltered(data);
  };

  // Apply Sort
  useEffect(() => {
    if (!sortOption) {
      setFiltered([...vehicles]);
      return;
    }

    const [key, order] = sortOption.split("-");

    setFiltered((prev) => {
      const sorted = [...prev].sort((a: Vehicle, b: Vehicle) => {
        const valA = key === "price" ? a.price : a.year;
        const valB = key === "price" ? b.price : b.year;
        return order === "asc" ? valA - valB : valB - valA;
      });
      return sorted;
    });
  }, [sortOption, vehicles]);

  // Reset Search and Filter
  const handleReset = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setFilterColor("");
    setFilterEngine("");
    setFiltered(vehicles);
    setSortOption("");
    setShowAdvancedFilters(false);
  };


  const getImageUrl = (img: string) => {
    if (!img) return "/placeholder-car.jpg";
    if (img.startsWith("http")) return img;
    return `http://localhost:4000${img}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 pb-8">
      <div className="max-w-auto mx-auto">

        {/* Header */}
        <Header />

        {/* Search & Filter section */}
        <div className="px-8 pt-8 pb-4">
          <SearchSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOption={sortOption}
            setSortOption={setSortOption}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            filterColor={filterColor}
            setFilterColor={setFilterColor}
            filterEngine={filterEngine}
            setFilterEngine={setFilterEngine}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            colors={colors}
            engineSizes={engineSizes}
            handleSearch={handleSearch}
            handleReset={handleReset}
          />
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0 px-8">
            <span className="text-slate-700 font-semibold">
              {filtered.length} {filtered.length === 1 ? 'vehicle' : 'vehicles'} found
            </span>
          </div>

          <div className="flex items-center space-x-4 px-8">
            {/* Sort By */}
            <div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-3 border border-slate-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sort by: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-asc">Year: Oldest First</option>
                <option value="year-desc">Year: Newest First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-slate-600"
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-slate-600"
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : viewMode === "list" ? (

          /* List View */
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden px-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group"
                      onClick={() => navigate(`/vehicle/${v.id}`)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                            <img
                              src={getImageUrl(v.images?.[0] || "")}
                              alt={v.brand}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-lg mb-1">{v.brand} {v.model}</div>
                            <div className="text-sm text-slate-600 font-medium">{v.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-200">
                              {v.type}
                            </span>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200">
                              {v.engineSize}
                            </span>
                          </div>
                          <div className="text-sm text-slate-700 font-medium">
                            Color: <span className="text-slate-900">{v.color}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-2xl font-bold text-blue-900">${v.price?.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 mt-1 font-medium">Total Price</div>
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/vehicle/${v.id}`);
                          }}
                          className="bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                        >
                          View
                          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (

          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-8">
            {filtered.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/vehicle/${v.id}`)}
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={getImageUrl(v.images?.[0] || "")}
                    alt={v.brand}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl text-slate-900 mb-4">{v.brand} {v.model}</h3>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-200">
                      {v.year}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-200">
                      {v.color}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-200">
                      {v.engineSize}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-bold text-blue-900">${v.price?.toLocaleString()}</span>
                      <span className="block text-xs text-slate-500 mt-1">Total price</span>
                    </div>
                    <button className="bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2">
                      View
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-slate-100">
            <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No vehicles found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
            >
              Reset Search
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerDashboard;