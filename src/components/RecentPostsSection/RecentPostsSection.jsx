import React from "react";

const RecentPostsSection = () => {
    const posts = [
        { title: "Photoshop - Web Design", date: "Jan. 26th, 2017", img: "images/course-1.jpg", comments: 53 },
        { title: "Photoshop - Web Design", date: "Jan. 26th, 2017", img: "images/course-4.jpg", comments: 53 },
        { title: "Photoshop - Web Design", date: "Jan. 26th, 2017", img: "images/course-3.jpg", comments: 53 },
    ];

    return (
        <div className="py-16">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8">Recent Posts</h2>
                <p className="text-gray-600 mb-12">Suspendisse ante mi iaculis ac eleifend id venenatis non eros.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <div key={index} className="bg-white shadow-lg p-6">
                            <img src={post.img} alt={post.title} className="w-full h-48 object-cover mb-4" />
                            <h3 className="text-xl font-semibold">{post.title}</h3>
                            <span className="block text-gray-500 mb-2">{post.date}</span>
                            <span className="block text-gray-500">
                                {post.comments} <i className="icon-heart text-red-500"></i>
                            </span>
                            <p className="text-gray-500 mt-2 mb-4">
                                Suspendisse ante mi iaculis ac eleifend id venenatis non eros.
                            </p>
                            <a href="#" className="text-primary-600 hover:underline">Read More</a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentPostsSection;
