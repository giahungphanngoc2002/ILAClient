import React from 'react';
import { Button, InputGroup, Modal } from "react-bootstrap";
import { AutoComplete, Input } from "antd";
import './style.css'

const HeroSection = ({ user, options, onSearch, handleNavigateSignup }) => {
    return (
        <section className="bg-cover bg-center h-screen flex items-center justify-center" style={{ backgroundImage: 'url(images/hero-bg-blue.png)' }}>
            <div className="container mx-auto flex flex-col md:flex-row items-center mb-4">
                <div className="md:w-1/2 text-white">
                    <h1 className="text-4xl md:text-6xl font-bold">Best way to fund your study abroad</h1>
                    <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <div style={{ marginBottom: "40px" }}>
                        {user?.access_token ? (
                            <InputGroup
                                className="mb-3"
                                style={{
                                    maxWidth: "600px",
                                    marginBottom: "20px",
                                }}
                            >
                                <AutoComplete
                                    options={options}
                                    style={{ width: "80%" }}
                                    onSearch={onSearch}
                                >
                                    <Input
                                        placeholder="Nhập mã lớp học của bạn để bắt đầu"
                                        size="large"
                                        onChange={(e) => onSearch(e.target.value)}
                                        className="custom-input"
                                    />
                                </AutoComplete>
                            </InputGroup>
                        ) : (
                            <button
                                onClick={handleNavigateSignup}
                                className={"mt-8 inline-block text-black px-12 py-3"}
                                style={{ backgroundColor: "white", borderRadius: "12px" }}
                            >
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0">
                    <img src="/images/hero.png" alt="Hero" className="w-full" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

