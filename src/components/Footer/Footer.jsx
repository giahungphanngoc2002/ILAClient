import React from 'react';
import { CiFacebook, CiInstagram, CiLinkedin, CiTwitter, CiYoutube } from "react-icons/ci";

const Footer = () => {
    return (
        <footer className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                    <div>
                        <h4 className="text-lg font-semibold mb-4">E-School</h4>
                        <ul className="p-0">
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Course</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Blog</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Contact</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Social Media</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Useful Links</h4>
                        <ul className="p-0">
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Help Desk</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Facilities</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Testimonials</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Student Support</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Terms &amp; Conditions</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Our Course</h4>
                        <ul className="p-0">
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Advertise</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Marketing</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Visual Assistant</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">System Analysis</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Web Development</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Legal</h4>
                        <ul className="p-0">
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">API</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Advertise</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Teams</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Find Designers</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-black no-underline">Find Developers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                        <p className="text-gray-600">15 Barnes Wallis Way, #358, Francisco, CA 94107</p>
                        <p className="text-gray-600">+1 012 345 6789</p>
                        <p className="text-gray-600">E-mail: <a href="mailto:info@yourdomain.com" className="text-black no-underline hover:underline">info@yourdomain.com</a></p>
                    </div>
                </div>
                <div className="text-center mt-8">
                    <p className="text-gray-600">&copy; Copyright 2017 Yourdomain. All rights reserved.</p>
                    <ul className="flex justify-center space-x-4 mt-4">
                        <li><a href="#" className="text-gray-600 hover:text-black no-underline text-3xl "><CiFacebook /></a></li>
                        <li><a href="#" className="text-gray-600 hover:text-black no-underline text-3xl "><CiInstagram /></a></li>
                        <li><a href="#" className="text-gray-600 hover:text-black no-underline text-3xl "><CiTwitter /></a></li>
                        <li><a href="#" className="text-gray-600 hover:text-black no-underline text-3xl "><CiYoutube /></a></li>
                        <li><a href="#" className="text-gray-600 hover:text-black no-underline text-3xl "><CiLinkedin /></a></li>
                        <li><a href="#" className="text-gray-600 hover:text-black no-underline text-3xl "><i className="fas fa-rss"></i></a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
