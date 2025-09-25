import React from 'react';
import bgImage1 from '../../assets/images/bg1.jpg';
import bgImage2 from '../../assets/images/bg2.jpg';
import bgImage3 from '../../assets/images/bg3.jpg';

const Header: React.FC = () => {
    return (
        <header className="relative h-[90vh] min-h-[700px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden pb-8">
            
            {/* Background theme*/}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #1e40af 0%, transparent 50%)`
                }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">CX</span>
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">
                            CARVANA<span className="text-blue-400">X</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#vehicles" className="text-blue-100 hover:text-white font-medium transition-colors duration-200">Vehicles</a>
                        <a href="#about" className="text-blue-100 hover:text-white font-medium transition-colors duration-200">About</a>
                        <a href="#contact" className="text-blue-100 hover:text-white font-medium transition-colors duration-200">Contact</a>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-8 px-6 lg:px-6 h-full flex items-center">
                <div className="max-w-7xl mx-auto text-center lg:text-left w-full">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                        
                        {/* Text Content */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight">
                                    FIND YOUR
                                    <span className="block text-blue-400">PERFECT RIDE</span>
                                </h1>
                                <p className="mt-6 text-xl text-blue-100 max-w-2xl leading-relaxed">
                                    Discover the perfect vehicle that matches your style and budget.
                                    Browse our extensive collection of premium cars with transparent pricing and detailed specifications.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                    Browse Vehicles
                                </button>
                                <button className="border-2 border-blue-400 text-blue-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-400 hover:text-white transition-all duration-200">
                                    Learn More
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 pt-8 max-w-md">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">500+</div>
                                    <div className="text-blue-200 text-sm font-medium">Vehicles</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">98%</div>
                                    <div className="text-blue-200 text-sm font-medium">Satisfaction</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">24/7</div>
                                    <div className="text-blue-200 text-sm font-medium">Support</div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Images */}
                        <div className="hidden lg:flex items-center justify-center relative">
                            <div className="relative w-full max-w-2xl">
                                
                                {/* Background Effects */}
                                <div className="absolute -top-8 -right-8 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

                                {/* Main Image */}
                                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl transform rotate-2">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                                        <img
                                            src={bgImage1}
                                            alt="Luxury Car"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Secondary Image in below */}
                                <div className="absolute -bottom-6 -right-6 w-[240px] bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl transform -rotate-3">
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden">
                                        <img
                                            src={bgImage2}
                                            alt="Car Interior"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Third Image in above */}
                                <div className="absolute -top-4 -left-4 w-[250px] bg-white/20 backdrop-blur-lg rounded-xl p-3 border border-white/30 shadow-lg">
                                    <div className="aspect-[4/3] rounded-lg overflow-hidden">
                                        <img
                                            src={bgImage3} 
                                            alt="Car Wheel"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </header>
    );
};

export default Header;