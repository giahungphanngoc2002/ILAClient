import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import * as ClassService from "../../services/ClassService";
import { useQuery } from "@tanstack/react-query";
import { Button, InputGroup, Modal } from "react-bootstrap";
import { AutoComplete, Input } from "antd";
import { useSelector } from "react-redux";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

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

  // console.log(learning == 'learning')
  console.log(userName);

  const handleNavigateSignup = () => {
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

    if (!classDetails?.questions || classDetails.questions.length === 0) {
      toast.error("join error");
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

    const studentCheck = detailClass?.data.studentID.find(
      (student) => student._id === user.id
    );

    if (!studentCheck) {
      toast.error("Không nằm trong lớp");
      console.log("123");
      return; // Exit the function immediately
    }

    if (test) {
      navigate(`/quizTest/${test._id}`);
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

  // console.log(Sclass);

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
      {/* ***** Preloader Start ***** */}
      <div id="js-preloader" className="js-preloader">
        <div className="preloader-inner">
          <span className="dot" />
          <div className="dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
      {/* ***** Preloader End ***** */}

      <div
        className="main-banner wow fadeIn mt-5"
        id="top"
        data-wow-duration="1s"
        data-wow-delay="0.5s"
        style={{ marginBottom: "40px" }} // Add margin bottom for spacing
      >
        <div className="container ml-20">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-6 align-self-center">
                  <div
                    className="left-content show-up header-text wow fadeInLeft"
                    data-wow-duration="1s"
                    data-wow-delay="1s"
                  >
                    <div className="row">
                      <div className="col-lg-12">
                        <img
                          src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/64308417e805c4e7d9a96787_SCHOOL%20BLDG.webp"
                          loading="lazy"
                          width="86"
                          alt=""
                          className="image-129"
                          localized=""
                          dir="ltr"
                        />
                        <div
                          className="hero-tag mt-2"
                          i18next-orgval-0="DISTRICT-READY"
                          localized=""
                          dir="ltr"
                          style={{
                            marginBottom: "20px",
                            opacity: 0.73,
                            color: "rgb(37, 99, 235)",
                            letterSpacing: "2.4px",
                            textTransform: "uppercase",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "18px",
                            fontWeight: 600,
                            lineHeight: "100%",
                          }}
                        >
                          DISTRICT-READY
                        </div>
                        <strong
                          className="text-5xl font-bold leading-tight"
                          i18next-orgval-0="Get more with Quizizz for your school or district"
                          localized=""
                          dir="ltr"
                          style={{ marginBottom: "20px" }} // Add margin bottom for spacing
                        >
                          Get more with{" "}
                          <span className="text-blue-500">Quizizz </span> for
                          your school or district
                        </strong>
                        <p
                          className="hero-paragraph-20px _360px mt-4 font-normal"
                          i18next-orgval-0="All the speed teachers love for planning, plus everything you need on a singular instructional platform"
                          localized=""
                          dir="ltr"
                          style={{ marginBottom: "20px" }} // Add margin bottom for spacing
                        >
                          All the speed teachers love for planning, plus
                          everything you need on a singular instructional
                          platform
                        </p>
                      </div>
                      <div className="col-lg-10">
                        <div className="border-first-button scroll-to-section">
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
                                style={{ width: "100%" }}
                                onSearch={onSearch}
                              >
                                <Input.Search
                                  placeholder="Nhập Mã Lớp Học"
                                  enterButton="Let go class"
                                  size="large"
                                  onChange={(e) => onSearch(e.target.value)}
                                />
                              </AutoComplete>
                            </InputGroup>
                          ) : (
                            <button
                              onClick={handleNavigateSignup}
                              className="bg-blue-600 mb-5 text-white text-2xl font-bold py-4 px-8 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 hover:bg-blue-500 active:scale-95"
                            >
                              Get Started
                            </button>
                          )}
                        </div>
                      </div>

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
                            <Modal.Title>{!assignment ? "Choose Option" : "Enter ID and Password" }</Modal.Title>
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
                  </div>
                </div>

                <div className="col-lg-6">
                  <div
                    className="right-image wow fadeInRight"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                    style={{ paddingLeft: "20px" }} // Add padding left for spacing
                  >
                    <img
                      src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/633401610da119172b376051_School%20District%20Hero%20Image-p-500.png"
                      alt=""
                      style={{ marginBottom: "20px" }} // Add margin bottom for spacing
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="grid lg:grid-cols-2 gap-8 ml-20 p-8 items-center"
        style={{ marginBottom: "40px" }}
      >
        {" "}
        {/* Add margin bottom for spacing */}
        <div className="max-w-lg">
          <div
            className="uppercase text-lg tracking-widest font-bold text-gray-500"
            style={{ marginBottom: "20px" }}
          >
            FAST
          </div>
          <h2 className="text-3xl font-semibold text-blue-500 mt-2 mb-6">
            Teaching, minus the time with Quizizz AI
          </h2>
          <ul
            className="list-disc list-inside text-base text-gray-700 space-y-3 font-serif"
            style={{ marginBottom: "20px" }}
          >
            <li>
              Generate activities in seconds from your favorite educational
              websites, PDFs, and docs with the Chrome Extension
            </li>
            <li>
              Increase efficiency and digitize content you already have, images
              and all with AI worksheets to activities
            </li>
            <li>
              Create the right reading material, right now with AI-generated
              comprehension passages
            </li>
          </ul>
          <hr className="my-6" />
          <div
            className="flex flex-col items-start"
            style={{ marginBottom: "20px" }}
          >
            <div className="text-4xl font-semibold text-gray-900">93%</div>
            <div className="text-base text-gray-700 mt-2 font-medium">
              of teachers say they can easily and quickly personalize content on
              Quizizz.
            </div>
          </div>
          <hr className="my-6" />
          <a
            href=""
            className="inline-flex items-center bg-gray-200 text-blue-500 rounded-md px-4 py-2 shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ marginBottom: "20px" }} // Add margin bottom for spacing
          >
            <span className="text-base font-medium">Learn more</span>
            <img
              src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/62fa6419161d3ac288681cdc_Purple%20Arrow%20Button.svg"
              alt="Purple Right Arrow"
              className="ml-2 w-4 h-4"
            />
          </a>
        </div>
        <div
          className="bg-blue-300 rounded-l-3xl flex justify-end items-end w-[602px] h-[420px] overflow-hidden pl-10"
          style={{ marginBottom: "40px" }}
        >
          {" "}
          {/* Add margin bottom for spacing */}
          <div className="relative flex justify-center items-center w-full ml-20">
            <img
              src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/6619522188dc7bf83f3894f6_Value%20Prop%20Arrow.svg"
              alt="Arrow"
              className="absolute w-full h-full mr-[800px]"
            />
            <div className="relative flex justify-end items-end bg-blue-300 rounded-tl-[20px] rounded-bl-[20px] w-[602px] h-[420px] overflow-hidden">
              <video
                className="object-cover w-full h-full rounded-lg"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  backgroundImage:
                    "url('https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/661e729f4d680e28199f299c_Value Prop 1-poster-00001.jpg')",
                }}
              >
                <source
                  src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/661e729f4d680e28199f299c_Value Prop 1-transcode.mp4"
                  type="video/mp4"
                />
                <source
                  src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/661e729f4d680e28199f299c_Value Prop 1-transcode.webm"
                  type="video/webm"
                />
              </video>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5" dir="ltr" style={{ marginBottom: "40px" }}>
        {" "}
        {/* Add margin bottom for spacing */}
        <div className="bg-blue-200 rounded-2xl border border-purple-300 justify-between w-11/12 mb-16 mx-auto p-18 flex">
          <div className="bg-thistle bg-[radial-gradient(circle_at_center,var(--thistle),rgba(225,205,222,0.96)),url('https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/63185f6f6c10b5c5d9b8c9b4_pattern.svg')] bg-no-repeat bg-[length:auto,contain] bg-[position:0_0,50%] rounded-2xl justify-between w-11/12 max-w-6xl mb-16 mx-auto p-18 flex">
            <div className="max-w-[60%]">
              <h2 className="text-4xl font-bold mb-6 mt-5">
                Ngừng chi tiêu quá mức cho những công nghệ mà giáo viên không sử
                dụng
              </h2>
              <div
                className="flex flex-col gap-5"
                style={{ marginBottom: "20px" }}
              >
                <div className="flex items-center">
                  <img
                    src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/631931025e03ed0c6d41efb7_file-chart-column%203.svg"
                    loading="lazy"
                    alt=""
                    className="mr-2.5 max-w-[50px]"
                  />
                  <div className="text-lg leading-6">
                    Có được cái nhìn thống nhất về hoạt động học tập của học
                    sinh bằng một công cụ thay vì nhiều công cụ
                  </div>
                </div>
                <div className="flex items-center">
                  <img
                    src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/63193291b82bb239b8c4f46e_award%205.svg"
                    loading="lazy"
                    alt=""
                    className="mr-2.5 max-w-[50px]"
                  />
                  <div className="text-lg leading-6">
                    Cung cấp cho giáo viên một nền tảng giảng dạy duy nhất mà họ
                    thực sự sử dụng và cung cấp cho huấn luyện viên hoặc chuyên
                    gia chương trình giảng dạy một nền tảng duy nhất để hỗ trợ,
                  </div>
                </div>
                <div className="flex items-center">
                  <img
                    src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/631a473b5a2a847758127d37_clipboard-check%201.svg"
                    loading="lazy"
                    alt=""
                    className="mr-2.5 max-w-[50px]"
                  />
                  <div className="text-lg leading-6">
                    Tạo sự nhất quán cho học sinh sử dụng cùng một công nghệ ở
                    các lớp học, môn học và cấp lớp khác nhau
                  </div>
                </div>
              </div>
              <a
                id="snd-cta-2"
                href="https://quizizz.typeform.com/to/njUo2S6l"
                target="_blank"
                className="inline-block mt-5 px-4 py-2 bg-blue-600 rounded-lg shadow text-white font-bold hover:bg-blue-200 transition duration-300"
                style={{ marginBottom: "20px" }} // Add margin bottom for spacing
              >
                Nhận báo giá
                <img
                  src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/62fa6419161d3ac288681cdc_Purple%20Arrow%20Button.svg"
                  loading="lazy"
                  alt="Mũi tên phải màu tím"
                  className="w-6 h-6 inline-block ml-2 filter invert"
                />
              </a>
            </div>
            <div className="max-w-[45%]">
              <img
                src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/6334009c95be2c2b66e4b060_Group%2040586.png"
                loading="lazy"
                sizes="(max-width: 479px) 100vw, (max-width: 767px) 73vw, (max-width: 991px) 550px, (max-width: 1439px) 35vw, 490px"
                srcSet="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/6334009c95be2c2b66e4b060_Group%2040586-p-500.png 500w, https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/6334009c95be2c2b66e4b060_Group%2040586-p-800.png 800w, https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/6334009c95be2c2b66e4b060_Group%2040586.png 980w"
                alt=""
                className="w-full rounded-lg"
                style={{ marginBottom: "20px" }} // Add margin bottom for spacing
              />
            </div>
          </div>
        </div>
        <footer className="bg-white py-10  w-full">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 pb-8 mb-8">
              <div className="mb-8 md:mb-0">
                <a href="http://quizizz.com/?lng=en" className="block mb-4">
                  <img
                    src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/62fa6419161d3a641f681ceb_Logo.svg"
                    alt="Quizizz Logo"
                    className="h-12 w-auto"
                  />
                </a>
                <a
                  href="https://support.quizizz.com/hc/en-us/articles/360055566272-Quizizz-Accessibility-and-Inclusion-Statement"
                  target="_blank"
                  className="flex items-center space-x-2 no-underline"
                >
                  <img
                    src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/64a3c543f0df3bde4580f844_Accessibility_Icon.png"
                    alt="Accessibility Icon"
                    className="h-6 w-6"
                  />
                  <div className="text-sm font-semibold text-black">
                    Accessibility <br /> & Inclusion
                  </div>
                </a>
              </div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 no-underline">
                <div className="flex flex-col space-y-2">
                  <a
                    href="https://quizizz.com/blog?lng=en"
                    className="footer-links no-underline text-black"
                  >
                    The Quizizz Blog
                  </a>
                  <a
                    href="https://quizizz.com/resources?lng=en"
                    className="footer-links no-underline text-black"
                  >
                    Teacher Resources
                  </a>
                  <a
                    href="https://quizizz.com/home/state-test-prep?lng=en"
                    className="footer-links no-underline text-black"
                  >
                    State Test Prep
                  </a>
                  <a
                    href="https://quizizz.com/quizizzforwork?source=home_footer&lng=en"
                    className="footer-links no-underline text-black"
                  >
                    Quizizz for Work
                  </a>
                  <a
                    href="https://quizizz.zendesk.com/hc/en-us"
                    className="footer-links no-underline text-black"
                  >
                    Help Center
                  </a>
                  <a
                    href="https://quizizz.com/home/research-panel?lng=en"
                    className="footer-links no-underline text-black"
                  >
                    Teacher Panel
                  </a>
                  <a
                    href="https://quizizz.com/home/iqaps?lng=en"
                    className="footer-links no-underline text-black"
                  >
                    IQAPS
                  </a>
                </div>
                <div className="flex flex-col space-y-2">
                  <a
                    href="https://quizizz.com/en/worksheets?lng=en"
                    className="footer-links no-underline text-black"
                  >
                    Worksheets
                  </a>
                  <a
                    href="https://quizizz.com/home/reseller-program?source=footer&lng=en"
                    className="footer-links no-underline text-black"
                  >
                    Reseller program
                  </a>
                  <a
                    href="https://quizizz.com/privacy?lng=en"
                    className="footer-links no-underline text-black"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="https://quizizz.com/home/privacy-center?lng=en"
                    className="footer-links no-underline text-black"
                  >
                    Privacy Center
                  </a>
                  <a
                    href="https://quizizz.com/home/careers?lng=en"
                    className="footer-links no-underline text-black"
                  >
                    Careers
                  </a>
                  <a
                    href="https://quizizz.com/home/about?lng=en"
                    className="footer-links no-underline text-black"
                  >
                    About Us
                  </a>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="text-lg font-semibold ml-10 ">
                    Download Quizizz mobile apps
                  </div>
                  <div className="flex space-x-2 ml-10">
                    <a
                      href="https://share.quizizz.com/EBAH8OlhCM"
                      className="w-inline-block"
                    >
                      <img
                        src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/62fa641a161d3a2982681d00_Google%20Play.svg"
                        alt="Get it on Google Play Badge"
                        className="h-12 w-auto"
                      />
                    </a>
                    <a
                      href="https://share.quizizz.com/nz4P08MhCM"
                      className="w-inline-block"
                    >
                      <img
                        src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/62fa6419161d3a1ad0681cbf_App%20Store.svg"
                        alt="Download on the App Store Badge"
                        className="h-12 w-auto"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
