import React from "react";

const TrainersSection = () => {
    const trainers = [
        { name: "Jean Smith", role: "Giáo viên Toán học", img: "images/trainer-1.jpg" },
        { name: "Jeremy Lawson", role: "Giáo viên Văn học", img: "images/trainer-2.jpg" },
        { name: "Jean Smith", role: "Giáo viên Tiếng Anh", img: "images/trainer-3.jpg" },
        { name: "Jean Andrews", role: "Giáo viên Vật lí", img: "images/trainer-4.jpg" },
    ];

    return (
        <div className="py-16">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8">Giáo viên</h2>
                <p className="text-gray-600 mb-12">Đội ngũ giảng viên từ các trường Đại học trên toàn quốc.</p>
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
