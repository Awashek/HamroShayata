import React, { useState } from "react";
import bgImage from "../../assets/images/background.jpg";

const Hero = () => {
    
    return (
        <div
            className="h-screen bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Main Content */}
            <div className="flex flex-col items-center justify-center text-center h-full bg-black bg-opacity-60 px-4">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4">
                    Together, We Build a Better Tomorrow
                </h1>
                <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl w-full max-w-2xl mb-6 px-2">
                    "At HamroSahayata, we believe in community power. Every donation, big
                    or small, helps someone get closer to their dreams. Whether it's a
                    medical need, education, or a community project, your support makes a
                    difference. Join us in empowering local causes and creating positive
                    change."
                </p>
                <button className="bg-[#1C9FDD] text-white font-semibold px-6 py-2 rounded-md hover:hover:bg-[#1577A5] md:px-8 md:py-3">
                    Begin Your Journey!
                </button>
            </div>
        </div>

    );
}

export default Hero