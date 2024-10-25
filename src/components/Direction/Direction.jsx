import { Col, Row } from "react-bootstrap";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import { LuChevronLast, LuChevronFirst } from "react-icons/lu";

const Direction = ({
    handleFirstQuestion,
    handlePrevQuestion,
    handleNextQuestion,
    handleLastQuestion,
    currentQuestion,
    data
}) => {
    return (
        <div>
            <Row className="d-flex justify-content-center">
                <Col
                    xs={4}
                    className="d-flex justify-content-center pt-4 pb-4"
                >
                    <button
                        style={{
                            background: "#1766FF",
                            height: "32px",
                            width: "120px",
                            border: "none",
                            borderRadius: "4px",
                            margin: "0 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "20px",
                            fontWeight: "700",
                        }}
                        onClick={handleFirstQuestion}
                        disabled={currentQuestion === 0}
                    >
                        <LuChevronFirst />
                    </button>

                    <button
                        style={{
                            background: "#1766FF",
                            height: "32px",
                            width: "120px",
                            border: "none",
                            borderRadius: "4px",
                            margin: "0 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "20px",
                            fontWeight: "700",
                        }}
                        onClick={handlePrevQuestion}
                        disabled={currentQuestion === 0}
                    >
                        <HiArrowNarrowLeft />
                    </button>

                    <button
                        style={{
                            background: "#1766FF",
                            height: "32px",
                            width: "120px",
                            border: "none",
                            borderRadius: "4px",
                            margin: "0 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "20px",
                            fontWeight: "700",
                        }}
                        onClick={handleNextQuestion}
                        disabled={currentQuestion === data.length - 1}
                    >
                        <HiArrowNarrowRight />
                    </button>

                    <button
                        style={{
                            background: "#1766FF",
                            height: "32px",
                            width: "120px",
                            border: "none",
                            borderRadius: "4px",
                            margin: "0 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "20px",
                            fontWeight: "700",
                        }}
                        onClick={handleLastQuestion}
                        disabled={currentQuestion === data.length - 1}
                    >
                        <LuChevronLast />
                    </button>
                </Col>
            </Row>
        </div>
    );
};

export default Direction;
