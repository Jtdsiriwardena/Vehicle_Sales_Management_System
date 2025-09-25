import React, { useState } from "react";
import type { Vehicle } from "../../api/vehicleApi";

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
}

const VehicleDetailModal: React.FC<Props> = ({ vehicle, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(vehicle.images?.[0] || "/placeholder.png");

  // Handle image URL formatting
  const getImageUrl = (img: string) => {
    if (img.startsWith("http")) return img;
    return `http://localhost:4000${img}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">{vehicle.brand} {vehicle.model}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 ml-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">

          {/* Images */}
          <div className="w-1/2 border-r border-slate-200 flex flex-col">

            {/* Main Image */}
            <div className="flex-1 p-6 flex items-center justify-center bg-slate-50">
              <div className="relative w-full h-full max-h-96 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={getImageUrl(selectedImage)}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>

            {/* Thumbnails */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="border-t border-slate-200 p-4 bg-white">
                <div className="flex gap-3 overflow-x-auto py-2">
                  {vehicle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === img
                          ? "border-blue-500 shadow-lg scale-110"
                          : "border-slate-200 hover:border-slate-400"
                        }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Information & Description */}
          <div className="w-1/2 overflow-y-auto">
            <div className="p-6 space-y-6">

              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-3">
                  Vehicle Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Type</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {vehicle.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Color</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full border border-slate-300"
                        style={{ backgroundColor: vehicle.color?.toLowerCase() }}
                      />
                      <span className="font-medium text-slate-900">{vehicle.color}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Engine Size</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {vehicle.engineSize}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Year</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {vehicle.year}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Price</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${vehicle.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-3">
                  Description
                </h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 leading-relaxed">
                    {vehicle.description || "No description available."}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;