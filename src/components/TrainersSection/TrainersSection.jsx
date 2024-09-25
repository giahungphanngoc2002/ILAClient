import React from "react";

const TrainersSection = () => {
    const trainers = [
        { name: "Jean Smith", role: "Marketing Instructor", img: "images/trainer-1.jpg" },
        { name: "Jeremy Lawson", role: "PHP Instructor", img: "images/trainer-2.jpg" },
        { name: "Jean Smith", role: "Marketing Instructor", img: "images/trainer-3.jpg" },
        { name: "Jean Andrews", role: "Instructor", img: "images/trainer-4.jpg" },
    ];

    return (
        <div className="py-16 bg-gray-100">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8">Meet Our Trainers</h2>
                <p className="text-gray-600 mb-12">Suspendisse ante mi iaculis ac eleifend id venenatis non eros.</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {trainers.map((trainer, index) => (
                        <div key={index} className="text-center">
                            <img src={trainer.img} alt={trainer.name} className="mx-auto rounded-full mb-4 w-40 h-40 object-cover" />
                            <h3 className="text-xl font-semibold">{trainer.name}</h3>
                            <p className="text-gray-600">{trainer.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainersSection;
