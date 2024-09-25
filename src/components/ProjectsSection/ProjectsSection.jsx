import React from "react";

const ProjectsSection = () => {
    const projects = [
        { title: "Web Development", img: "images/project-1.jpg" },
        { title: "Virtual Assistant", img: "images/project-2.jpg" },
        { title: "Class Room", img: "images/project-3.jpg" },
        { title: "Web Programming", img: "images/project-4.jpg" },
        { title: "Art & Photography", img: "images/project-5.jpg" },
        { title: "Interior Design", img: "images/project-6.jpg" },
    ];

    return (
        <div className="py-16">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8">Our Popular Projects</h2>
                <p className="text-gray-600 mb-12">Suspendisse ante mi iaculis ac eleifend id venenatis non eros.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div key={index} className="relative overflow-hidden shadow-lg">
                            <img src={project.img} alt={project.title} className="w-full h-64 object-cover" />
                            <div className="absolute inset-0 bg-black opacity-25 transition-opacity duration-300 hover:opacity-50"></div>
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-2xl font-semibold">{project.title}</h3>
                                <span>View Course</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectsSection;
