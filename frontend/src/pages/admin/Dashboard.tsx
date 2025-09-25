import { useEffect, useState } from "react";
import API from "../../api/vehicleApi";
import type { Vehicle } from "../../api/vehicleApi";
import VehicleDetailModal from "../../components/admin/VehicleDetailModal";
import VehicleEditModal from "../../components/admin/VehicleEditModal";
import Swal from 'sweetalert2';

//Sort types
type SortOrder = "asc" | "desc";

const Dashboard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);


  // Sorting state
  const [sortBy, setSortBy] = useState<keyof Vehicle | "">("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle =>
    Object.values(vehicle).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const totalPages = Math.ceil(filteredVehicles.length / rowsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  //Load vehicles
  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await API.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //Handle delete
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'px-4 py-2 rounded-lg font-semibold',
        cancelButton: 'px-4 py-2 rounded-lg font-semibold'
      }
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait while we remove the vehicle.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      await API.deleteVehicle(id);

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Vehicle has been deleted successfully.',
        confirmButtonColor: '#10b981',
      });

      loadVehicles();
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Failed to delete vehicle. Please try again.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  //Handle sort
  const handleSort = (field: keyof Vehicle) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Apply sorting
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (!sortBy) return 0;
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  // Get current page data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = sortedVehicles.slice(startIndex, startIndex + rowsPerPage);

  // stats calculation
  const totalValue = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.price || 0), 0);
  const averagePrice = vehicles.length > 0 ? totalValue / vehicles.length : 0;

  useEffect(() => {
    loadVehicles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Vehicles</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{vehicles.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">${totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Avg. Price</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">${averagePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Latest Addition</p>
                <p className="text-lg font-semibold text-slate-800 mt-2 truncate">
                  {vehicles[0] ? `${vehicles[0].brand} ${vehicles[0].model}` : 'None'}
                </p>
                <p className="text-slate-500 text-sm">{vehicles[0]?.createdAt?.slice(0, 10)}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search vehicles*/}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Vehicle Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {[
                        { label: "Type", key: "type" },
                        { label: "Brand", key: "brand" },
                        { label: "Model", key: "model" },
                        { label: "Year", key: "year" },
                        { label: "Price", key: "price" },
                        { label: "Actions", key: "" },
                      ].map((col) => (
                        <th
                          key={col.label}
                          className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-150"
                          onClick={() => col.key && handleSort(col.key as keyof Vehicle)}
                        >
                          <div className="flex items-center space-x-1">
                            <span>{col.label}</span>
                            {col.key && (
                              <span className="text-slate-400">
                                {sortBy === col.key ? (
                                  sortOrder === "asc" ? "↑" : "↓"
                                ) : (
                                  "↕"
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentData.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {v.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{v.brand}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{v.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{v.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          ${v.price?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => { setSelectedVehicle(v); setViewModalOpen(true); }}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded hover:bg-blue-50"
                              title="View details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => { setSelectedVehicle(v); setEditModalOpen(true); }}
                              className="text-green-600 hover:text-green-900 transition-colors duration-200 p-1 rounded hover:bg-green-50"
                              title="Edit vehicle"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(v.id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                              title="Delete vehicle"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(startIndex + rowsPerPage, filteredVehicles.length)}</span> of{" "}
                    <span className="font-medium">{filteredVehicles.length}</span> vehicles
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrev}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-slate-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {viewModalOpen && selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setViewModalOpen(false)}
        />
      )}

      {editModalOpen && selectedVehicle && (
        <VehicleEditModal
          vehicle={selectedVehicle}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdate={loadVehicles}
        />
      )}
    </div>
  );
};

export default Dashboard;