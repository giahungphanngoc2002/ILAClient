import { Col, Row } from "react-bootstrap";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import { LuChevronLast, LuChevronFirst } from "react-icons/lu";
const DirectionComponent = ({
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
          className=" d-flex justify-content-center pt-4 pb-4"
        >
          <ButtonComponent
            size={40}
            styleButton={{
              background: "#1766FF",
              height: "32px",
              width: "120px",
              border: "none",
              borderRadius: "4px",
              margin: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            textButton={<LuChevronFirst />}
            styleTextButton={{
              color: "#fff",
              fontSize: "20px",
              fontWeight: "700",
            }}
            onClick={handleFirstQuestion}
            disabled={currentQuestion === 0}
          />

          <ButtonComponent

            size={40}
            styleButton={{
              background: "#1766FF",
              height: "32px",
              width: "120px",
              border: "none",
              borderRadius: "4px",
              margin: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            textButton={<HiArrowNarrowLeft />}
            styleTextButton={{
              color: "#fff",
              fontSize: "20px",
              fontWeight: "700",
            }}
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          ></ButtonComponent>

          <ButtonComponent

            size={40}
            styleButton={{
              background: "#1766FF",
              height: "32px",
              width: "120px",
              border: "none",
              borderRadius: "4px",
              margin: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            textButton={<HiArrowNarrowRight />}
            styleTextButton={{
              color: "#fff",
              fontSize: "20px",
              fontWeight: "700",
            }}
            onClick={handleNextQuestion}
            disabled={currentQuestion === data.length - 1}
          ></ButtonComponent>

          <ButtonComponent

            size={40}
            styleButton={{
              background: "#1766FF",
              height: "32px",
              width: "120px",
              border: "none",
              borderRadius: "4px",
              margin: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            textButton={<LuChevronLast />}
            styleTextButton={{
              color: "#fff",
              fontSize: "20px",
              fontWeight: "700",
            }}
            onClick={handleLastQuestion}
            disabled={currentQuestion === data.length - 1}
          ></ButtonComponent>
        </Col>
      </Row>
    </div>
  );
};

export default DirectionComponent;