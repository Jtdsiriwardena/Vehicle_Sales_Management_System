import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/vehicleApi";
import type { Vehicle as VehicleType } from "../../api/vehicleApi";

const VehicleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState<VehicleType | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        API.getVehicle(Number(id))
            .then((data) => setVehicle(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const getImageUrl = (img: string) => {
        if (!img) return "/placeholder-car.jpg";
        if (img.startsWith("http")) return img;
        return `http://localhost:4000${img}`;
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading vehicle details...</p>
            </div>
        </div>
    );

    if (!vehicle) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Vehicle Not Found</h3>
                <p className="text-slate-600 mb-4">The vehicle you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                >
                    Back to Vehicles
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Back to Vehicles</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* Image Gallery */}
                    <div className="space-y-6 h-fit">

                        {/* Main Image */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                            <div className="relative aspect-[4/3] bg-slate-100">
                                {vehicle.images && vehicle.images.length > 0 ? (
                                    <>
                                        <img
                                            src={getImageUrl(vehicle.images[selectedImageIndex])}
                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                                                }`}
                                            onLoad={() => setImageLoading(false)}
                                        />
                                        {imageLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {vehicle.images && vehicle.images.length > 1 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                                <h4 className="font-semibold text-slate-700 mb-3">Gallery</h4>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {vehicle.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setSelectedImageIndex(idx);
                                                setImageLoading(true);
                                            }}
                                            className={`flex-shrink-0 w-40 h-40 rounded-lg overflow-hidden border-2 transition-all duration-200 ${idx === selectedImageIndex
                                                ? "border-blue-500 shadow-lg scale-105"
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

                    {/* Vehicle Details */}
                    <div className="space-y-6 h-fit">

                        {/* Vehicle Header */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                                {/* Vehicle Info */}
                                <div className="flex-1">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                                        {vehicle.brand} {vehicle.model}
                                    </h1>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold border border-blue-200">
                                            {vehicle.year}
                                        </span>
                                        {vehicle.color && (
                                            <span className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold border border-blue-200">
                                                {vehicle.color}
                                            </span>
                                        )}
                                        {vehicle.engineSize && (
                                            <span className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold border border-blue-200">
                                                {vehicle.engineSize}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Price Section */}
                                <div className="lg:text-right">
                                    <div className="text-3xl lg:text-4xl font-bold text-blue-800 mb-2">
                                        ${vehicle.price?.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-3">
                            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Specifications
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">Brand</span>
                                        <span className="font-bold text-slate-900 text-lg">{vehicle.brand || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">Model</span>
                                        <span className="font-bold text-slate-900 text-lg">{vehicle.model || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">Type</span>
                                        <span className="font-bold text-slate-900 text-lg">{vehicle.type || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">Color</span>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-bold text-slate-900 text-lg">{vehicle.color || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">Engine Size</span>
                                        <span className="font-bold text-slate-900 text-lg">{vehicle.engineSize || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">Year</span>
                                        <span className="font-bold text-slate-900 text-lg">{vehicle.year || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Vehicle Description
                            </h3>
                            <div className="bg-slate-50 rounded-lg p-4">
                                <p className="text-slate-700 leading-relaxed">
                                    {vehicle.description ||
                                        "This vehicle comes with a comprehensive description highlighting its features, condition, and unique selling points. Contact us for more detailed information."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl shadow-lg p-6">
                    <div className="text-center text-white mb-6">
                        <h3 className="text-2xl font-semibold mb-2">Interested in this vehicle?</h3>
                        <p className="text-blue-200 text-lg">Contact CarvanaX for a test drive or more information</p>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4 max-w-2xl mx-auto">
                        <button className="flex-1 bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl">
                            <div className="flex items-center justify-center space-x-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-lg">Call Now</span>
                            </div>
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                            <div className="flex items-center justify-center space-x-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-lg">Send Message</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetail;