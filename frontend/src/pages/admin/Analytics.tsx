import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import API from "../../api/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);



interface VehiclesPerDay {
    period: string;
    count: number;
}

interface BrandData {
    brand: string;
    count: number;
}

interface TypeData {
    type: string;
    count: number;
}

interface PriceData {
    label: string;
    count: number;
}

const Analytics: React.FC = () => {
    const [vehiclesPerDay, setVehiclesPerDay] = useState<VehiclesPerDay[]>([]);
    const [brandData, setBrandData] = useState<BrandData[]>([]);
    const [typeData, setTypeData] = useState<TypeData[]>([]);
    const [priceData, setPriceData] = useState<PriceData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const [vpdRes, brandsRes, typesRes, pricesRes] = await Promise.all([
                API.get("/analytics/vehicles-added?period=month"),
                API.get("/analytics/count-by-brand"),
                API.get("/analytics/count-by-type"),
                API.get("/analytics/count-by-price-range"),

            ]);

            setVehiclesPerDay(Array.isArray(vpdRes.data) ? vpdRes.data : []);
            setBrandData(Array.isArray(brandsRes.data) ? brandsRes.data : []);
            setTypeData(Array.isArray(typesRes.data) ? typesRes.data : []);
            setPriceData(Array.isArray(pricesRes.data) ? pricesRes.data : []);
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // Chart options
    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    }
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    font: {
                        family: "'Inter', sans-serif"
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    font: {
                        family: "'Inter', sans-serif"
                    }
                }
            },
        },
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 11
                    },
                    padding: 15
                }
            },
        },
    };

    // summary stats
    const topBrand = brandData.length > 0 ? brandData.reduce((prev, current) =>
        (prev.count > current.count) ? prev : current
    ).brand : 'None';
    const popularType = typeData.length > 0 ? typeData.reduce((prev, current) =>
        (prev.count > current.count) ? prev : current
    ).type : 'None';

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Analytics Dashboard</h1>
                    <p className="text-slate-600">Insights and trends from your vehicle inventory</p>
                </div>

                {/* Summary Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Growth Rate</p>
                                <p className="text-3xl font-bold text-slate-800 mt-2">
                                    {vehiclesPerDay.length > 1
                                        ? `${(((vehiclesPerDay[vehiclesPerDay.length - 1]?.count - vehiclesPerDay[vehiclesPerDay.length - 2]?.count) / vehiclesPerDay[vehiclesPerDay.length - 2]?.count) * 100).toFixed(1)}%`
                                        : '0%'
                                    }
                                </p>
                                <p className="text-slate-500 text-sm">Month over month</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Top Brand</p>
                                <p className="text-xl font-bold text-slate-800 mt-2 truncate">{topBrand}</p>
                                <p className="text-slate-500 text-sm">Most popular</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Popular Type</p>
                                <p className="text-xl font-bold text-slate-800 mt-2 capitalize">{popularType}</p>
                                <p className="text-slate-500 text-sm">Most common</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Monthly Growth</p>
                                <p className="text-3xl font-bold text-slate-800 mt-2">
                                    {vehiclesPerDay.length > 0 ? vehiclesPerDay[vehiclesPerDay.length - 1]?.count : 0}
                                </p>
                                <p className="text-slate-500 text-sm">Latest month</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="space-y-6">


                    {/* Vehicles Added per Month */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Monthly Vehicle Additions</h2>
                            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                Last 12 months
                            </span>
                        </div>
                        <div className="h-80">
                            <Bar
                                data={{
                                    labels: vehiclesPerDay.map((v) => v.period),
                                    datasets: [
                                        {
                                            label: "Vehicles Added",
                                            data: vehiclesPerDay.map((v) => v.count),
                                            backgroundColor: "rgba(59, 130, 246, 0.8)",
                                            borderColor: "rgb(59, 130, 246)",
                                            borderWidth: 2,
                                            borderRadius: 6,
                                        },
                                    ],
                                }}
                                options={barChartOptions}
                            />
                        </div>
                    </div>

                    {/* Brand and Type Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">Vehicle Distribution by Brand</h2>
                            <div className="h-80 flex items-center justify-center">
                                <Pie
                                    data={{
                                        labels: brandData.map((b) => b.brand),
                                        datasets: [
                                            {
                                                data: brandData.map((b) => b.count),
                                                backgroundColor: [
                                                    'rgba(59, 130, 246, 0.8)',
                                                    'rgba(16, 185, 129, 0.8)',
                                                    'rgba(139, 92, 246, 0.8)',
                                                    'rgba(245, 158, 11, 0.8)',
                                                    'rgba(239, 68, 68, 0.8)',
                                                    'rgba(99, 102, 241, 0.8)',
                                                ],
                                                borderColor: 'white',
                                                borderWidth: 2,
                                            },
                                        ],
                                    }}
                                    options={pieChartOptions}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">Vehicle Distribution by Type</h2>
                            <div className="h-80 flex items-center justify-center">
                                <Pie
                                    data={{
                                        labels: typeData.map((t) => t.type),
                                        datasets: [
                                            {
                                                data: typeData.map((t) => t.count),
                                                backgroundColor: [
                                                    'rgba(16, 185, 129, 0.8)',
                                                    'rgba(59, 130, 246, 0.8)',
                                                    'rgba(245, 158, 11, 0.8)',
                                                    'rgba(139, 92, 246, 0.8)',
                                                    'rgba(239, 68, 68, 0.8)',
                                                ],
                                                borderColor: 'white',
                                                borderWidth: 2,
                                            },
                                        ],
                                    }}
                                    options={pieChartOptions}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price Range Chart */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Vehicle Distribution by Price Range</h2>
                            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                Price categories
                            </span>
                        </div>
                        <div className="h-80">
                            <Bar
                                data={{
                                    labels: priceData.map((p) => p.label),
                                    datasets: [
                                        {
                                            label: "Number of Vehicles",
                                            data: priceData.map((p) => p.count),
                                            backgroundColor: "rgba(16, 185, 129, 0.8)",
                                            borderColor: "rgb(16, 185, 129)",
                                            borderWidth: 2,
                                            borderRadius: 6,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top' as const,
                                            labels: {
                                                font: {
                                                    family: "'Inter', sans-serif",
                                                    size: 12
                                                }
                                            }
                                        },
                                    },
                                    scales: {
                                        x: {
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.05)',
                                            },
                                            ticks: {
                                                font: {
                                                    family: "'Inter', sans-serif"
                                                }
                                            }
                                        },
                                        y: {
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.05)',
                                            },
                                            ticks: {
                                                font: {
                                                    family: "'Inter', sans-serif"
                                                }
                                            }
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;