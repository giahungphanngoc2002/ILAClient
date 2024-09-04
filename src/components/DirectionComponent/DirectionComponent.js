import { Container, Col, Row } from "react-bootstrap";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

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
              className="border-y-2 d-flex justify-content-center pt-4 pb-4"
            >
              <ButtonComponent
                bordered={false}
                size={40}
                styleButton={{
                  background: "#1766FF",
                  height: "32px",
                  width: "80px",
                  border: "none",
                  borderRadius: "4px",
                  margin:"0 16px"
                }}
                textButton={"First"}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
                onClick={handleFirstQuestion}
                disabled={currentQuestion === 0}
              ></ButtonComponent>
    
              <ButtonComponent
                bordered={false}
                size={40}
                styleButton={{
                  background: "#1766FF",
                  height: "32px",
                  width: "80px",
                  border: "none",
                  borderRadius: "4px",
                  margin:"0 16px"
                }}
                textButton={"Prev"}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
              ></ButtonComponent>
    
              <ButtonComponent
                bordered={false}
                size={40}
                styleButton={{
                  background: "#1766FF",
                  height: "32px",
                  width: "80px",
                  border: "none",
                  borderRadius: "4px",
                  margin:"0 16px"
                }}
                textButton={"Next"}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
                onClick={handleNextQuestion}
                disabled={currentQuestion === data.length - 1}
              ></ButtonComponent>
    
              <ButtonComponent
                bordered={false}
                size={40}
                styleButton={{
                  background: "#1766FF",
                  height: "32px",
                  width: "80px",
                  border: "none",
                  borderRadius: "4px",
                  margin:"0 16px"
                }}
                textButton={"Last"}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
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