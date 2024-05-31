import React from "react";
import { Carousel, Button, Col, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
  const navigate = useNavigate();
  const handleNavigateSignup = () => {
    navigate("/signup");
  };

  return (
    <div>
      <div>
        <img
          className="d-block w-100"
          src="/images/homepage.jpg"
          style={{ height: "600px" }}
          alt="First slide"
        />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
          }}
        >
          <button
            onClick={handleNavigateSignup}
            type="button"
            class="btn btn-primary btn-lg "
            style={{ padding: "20px 60px" }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
