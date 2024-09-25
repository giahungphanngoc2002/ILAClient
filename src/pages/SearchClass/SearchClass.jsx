import React, { useState } from 'react';
import * as ClassService from "../../services/ClassService";
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import JoinQuizModal from '../Modal/JoinQuizModal';

const SearchClass = () => {
    const user = useSelector((state) => state.user);
    const [joinCode, setJoinCode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [idClass, setIdClass] = useState("");
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [assignment, setAssignment] = useState(false);
    const [testID, setTestID] = useState("");
    const [password, setPassword] = useState("");
    const [iDTest, setIDTest] = useState([]);
    const [isSearching, setIsSearching] = useState(false); // State to track whether a search has been initiated
    const navigate = useNavigate();

    const getAllTopClass = async () => {
        const res = await ClassService.getAllTopClass();
        return res;
    };

    const GetDetailsClass = async (id) => {
        const res = await ClassService.getDetailClass(id);
        return res;
    };

    const { data: Sclass, isLoading, isError } = useQuery({
        queryKey: ["Sclass"],
        queryFn: getAllTopClass,
    });

    const { data: detailClass } = useQuery({
        queryKey: ["detailClass", idClass],
        queryFn: () => GetDetailsClass(idClass),
        enabled: !!idClass,
    });

    const handleJoinCodeChange = (e) => {
        setJoinCode(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSearching(true); // Start search, move form to top
    };

    const onSearch = (value) => {
        const term = value.trim();
        setSearchTerm(term);

        const filteredClass = Sclass?.data?.filter((item) => {
            const { nameClass, classID, teacherID } = item;
            const teacherName = teacherID?.name || '';

            return (
                nameClass.toLowerCase().includes(term.toLowerCase()) ||
                classID.toLowerCase().includes(term.toLowerCase()) ||
                teacherName.toLowerCase().includes(term.toLowerCase())
            );
        });

        setSearchData(filteredClass || []);
        setIsSearching(true); // Move form to top on search
    };

    const handleCloseLinkModal = () => {
        setShowLinkModal(false);
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

    return (
        <div className="bg-gradient-to-b from-blue-200 to-blue-500 flex flex-col items-center min-h-screen">
            <form
                id="proceed-game-action-wrapper"
                className={`bg-white box-border flex flex-col sm:flex-row w-full sm:w-auto sm:justify-center sm:items-center gap-2 border-ds-dark-500-20 p-2 border-2 bg-ds-light-500 rounded-xl transition-all duration-300 ${isSearching ? 'mt-10' : 'mt-60' // Move form to top when searching
                    }`}
                onSubmit={handleSubmit}
                style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)" }}
            >
                <div className="relative flex items-center w-full">
                    <input
                        className="sm:mb-0 sm:mr-2 w-full text-ds-black-400 font-semibold rounded-xl border-0 border-box landing h-12 px-4 outline-none"
                        placeholder="Enter a join code"
                        aria-label="Enter a join code to play a game"
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
                <button
                    className="bg-blue-500 text-white box-border select-none font-bold border text-center disabled:cursor-auto disabled:text-dark-tertiary disabled:bg-ds-light-200 disabled:hover:border-ds-light-200 text-ds-light-500 bg-ds-lilac-500 border-transparent hover:bg-ds-lilac-400 hover:border-ds-lilac-400 active:bg-ds-lilac-600 active:border-ds-lilac-600 px-4 py-2 text-base sm:text-xl h-12 rounded-lg cursor-pointer"
                    type="submit"
                >
                    Join
                </button>
            </form>

            <div className="mt-4 w-full h-full overflow-auto">
                {searchData.length > 0 ? (
                    <div className="w-full flex flex-col gap-4">
                        {searchData.map((item, index) => (
                            <button
                                key={index}
                                className="w-full flex items-center py-3 px-5 shadow-md rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                onClick={() => {
                                    const testIds = item.tests.map((test) => test._id);
                                    handleOpenLinkModal(testIds, item._id, true);
                                }}
                            >
                                <div className="flex-grow">
                                    <h1 className="text-lg font-semibold text-gray-900">
                                        {item.nameClass} - {item.classID}
                                    </h1>
                                    <p className="text-gray-600">Instructor: {item.teacherID?.name}</p>
                                    <p className="text-gray-500">Class Time: {item.classTime || 'Not available'}</p>
                                    <p className="text-gray-500">Room: {item.roomNumber || 'TBA'}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-white">No results found</p>
                )}
            </div>

            {showLinkModal && (
                <JoinQuizModal
                    showLinkModal={showLinkModal}
                    handleCloseLinkModal={handleCloseLinkModal}
                    handleBack={handleBack}
                    assignment={assignment}
                    handleOnchangeTestID={handleOnchangeTestID}
                    testID={testID}
                    handleOnchangePassword={handleOnchangePassword}
                    password={password}
                    handleGoToLearning={handleGoToLearning}
                    handleCheckAssignment={handleCheckAssignment}
                    goToTest={goToTest}
                />
            )}
        </div>
    );
};

export default SearchClass;
