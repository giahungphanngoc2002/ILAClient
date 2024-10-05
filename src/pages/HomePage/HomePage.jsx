import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import * as ClassService from "../../services/ClassService";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Banner from "../../components/Banner/Banner";
import Counters from "../../components/Counter/Counter";
import CourseCarousel from "../../components/CourseCarousel/CourseCarousel";
import FeaturesSection from "../../components/FeaturesSection/FeaturesSection";
import TrainersSection from "../../components/TrainersSection/TrainersSection";
import Footer from "../../components/Footer/Footer";
import Contact from "../../components/Contact/Contact";


export default function HomePage() {
  const user = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [idClass, setIdClass] = useState("");
  const [assignment, setAssignment] = useState(false);
  const [testID, setTestID] = useState("");
  const [password, setPassword] = useState("");
  const [iDTest, setIDTest] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(user?.id);
  }, [user?.id]);

  const handleNavigateSignup = () => {
    // console.log("123")
    navigate("/signin");
  };

  const getAllTopClass = async () => {
    const res = await ClassService.getAllTopClass();
    return res;
  };


  const GetDetailsClass = async (id) => {
    const res = await ClassService.getDetailClass(id);
    return res;
  };



  const {
    data: Sclass,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["Sclass"],
    queryFn: getAllTopClass,
  });

  const { data: detailClass } = useQuery({
    queryKey: ["detailClass", idClass],
    queryFn: () => GetDetailsClass(idClass),
    enabled: !!idClass, // quan trong ne ko dung thi dong lai

  });

  const onSearch = (value) => {
    const term = value.trim();
    setSearchTerm(term);

    const filteredClass = Sclass.data?.filter((item) => {
      const { nameClass, classID, teacherID } = item;
      const teacherName = teacherID?.name || "";

      return (
        nameClass.toLowerCase().includes(term.toLowerCase()) ||
        classID.toLowerCase().includes(term.toLowerCase()) ||
        teacherName.toLowerCase().includes(term.toLowerCase())
      );
    });

    setSearchData(filteredClass || []);
  };

  const handleOpenLinkModal = (testIds, idQuiz) => {
    setIdClass(idQuiz);
    setIDTest(testIds);
    setShowLinkModal(true);
  };

  const handleOnchangeTestID = (e) => {
    setTestID(e.target.value);
  };

  const handleOnchangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleGoToLearning = () => {
    const classDetails = detailClass?.data;
    const checkStatus = !!classDetails?.status;
    const studentCheck = classDetails?.studentID.find(
      (student) => student._id === user.id
    );

    if (!classDetails?.questions || classDetails.questions.length === 0) {
      toast.error("Join error");
    } else if (!checkStatus && !studentCheck) {
      toast.error("Class is not active and you're not a member");
    } else {
      navigate(`/quiz/${idClass}`);
    }
  };


  const handleCheckAssignment = () => {
    setAssignment(true);
  };

  const goToTest = () => {
    const test = detailClass?.data?.tests?.find(
      (testt) => testt.iDTest === testID && testt.passwordTest === password
    );

    // const studentCheck = detailClass?.data.studentID.find(
    //   (student) => student._id === user.id
    // );

    if (test) {
      navigate(`/quizTest/${idClass}/${test._id}`);
      toast.success("Join Test Successfully!");
    } else {
      toast.error("Wrong ID or Password!");
    }
  };

  const handleBack = () => {
    setAssignment(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading classes.</div>;
  }

  const options =
    searchData?.map((item) => ({
      value: item.nameClass,
      label: (
        <button
          className="w-full flex items-center py-3 px-5 shadow-md rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          onClick={() => {
            const testIds = item.tests.map((test) => test._id);
            handleOpenLinkModal(testIds, item._id, true);
          }}
        >
          <div className="flex-grow">
            <h1 className="text-lg font-semibold text-gray-900">
              {item.nameClass} - {item.classID} -{" "}
              <span className="text-gray-600">{item.teacherID?.name}</span>
            </h1>
          </div>
        </button>
      ),
    })) || [];

  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
  };

  return (
    <div>
      <Banner />
      <FeaturesSection />
      <CourseCarousel />
      <Counters />
      <TrainersSection />
      <Contact />
      <Footer />
      {showLinkModal && (
        <Modal
          show={showLinkModal}
          onHide={handleCloseLinkModal}
        >
          <Modal.Header closeButton>
            <button
              className="flex items-center text-white px-4 py-2 rounded-md"
              onClick={handleBack}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-gray-500 mr-2"
              />
            </button>
            <Modal.Title>{!assignment ? "Choose Option" : "Enter ID and Password"}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-6 py-4 bg-white">
            {assignment ? (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Code:
                  </label>
                  <input
                    type="text"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter your code"
                    onChange={handleOnchangeTestID}
                    value={testID}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Password ID:
                  </label>
                  <input
                    type="password"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter your password"
                    onChange={handleOnchangePassword}
                    value={password}
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center space-x-6">
                <button
                  className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                  onClick={handleGoToLearning}
                >
                  Learning
                </button>
                <button
                  className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition duration-300"
                  onClick={handleCheckAssignment}
                >
                  Assignment
                </button>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseLinkModal}
            >
              Close
            </Button>
            {assignment && (
              <Button onClick={goToTest} variant="primary">
                Go To Assignment
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </div>

  );
}
