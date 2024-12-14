import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#1C9FDD] text-white py-8">
            <div className="container mx-auto px-6 flex flex-col items-center">
                {/* Brand Section */}
                <div className="mb-6 text-center">
                    <h3 className="text-3xl font-semibold text-white">HamroSahayata</h3>
                    <p className="text-lg mt-2 ">Supporting communities, empowering change.</p>
                </div>

                {/* Navigation Links */}
                <div className="flex space-x-8 mb-6">
                    <a
                        href="#"
                        className="text-white hover:text-[#FFD700] transition duration-300"
                    >
                        About Us
                    </a>
                    <a
                        href="#"
                        className="text-white hover:text-[#FFD700] transition duration-300"
                    >
                        Contact
                    </a>
                    <a
                        href="#"
                        className="text-white hover:text-[#FFD700] transition duration-300"
                    >
                        Terms & Conditions
                    </a>
                    <a
                        href="#"
                        className="text-white hover:text-[#FFD700] transition duration-300"
                    >
                        Privacy Policy
                    </a>
                </div>

                {/* Social Media Section */}
                <div className="mt-4 flex space-x-6 justify-center">
                    {/* Facebook */}
                    <a
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#FFD700] transition duration-300 text-xl"
                    >
                        <i className="fa-brands fa-facebook text-2xl"></i>
                    </a>

                    {/* Twitter */}
                    <a
                        href="https://www.twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#13182f]  transition duration-300 text-xl"
                    >
                        <i class="fa-brands fa-x-twitter text-2xl"></i>
                    </a>

                    
                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#944276] transition duration-300 text-xl"
                    >
                        <i class="fa-brands fa-instagram text-2xl"></i>
                    </a>

                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/1234567890" // Replace with your WhatsApp number
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#25D366] transition duration-300 text-xl"
                    >
                        
                        <i class="fa-brands fa-whatsapp text-2xl"></i>
                    </a>
                </div>

                {/* Copyright Section */}
                <div className="text-sm text-blue-100 text-center mt-6">
                    <p>© 2024 HamroSahayata. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
