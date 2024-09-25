import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-200 py-16">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="text-xl font-bold mb-4">E-School</h4>
                    <ul>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Course</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Blog</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Contact</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Social Media</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xl font-bold mb-4">Useful Links</h4>
                    <ul>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Held Desk</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Facilities</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Testimonials</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Student Support</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Terms &amp; Conditions</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xl font-bold mb-4">Our Course</h4>
                    <ul>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Advertise</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Marketing</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Visual Assistant</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">System Analysis</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary-600">Web Development</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xl font-bold mb-4">Contact Info</h4>
                    <p>15 Barnes Wallis Way, #358, Francisco, CA 94107</p>
                    <p>+1 012 345 6789</p>
                    <p>
                        E-mail: <a href="mailto:info@yourdomain.com" className="text-primary-600">info@yourdomain.com</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
