import { useEffect, useState } from "react";
import "./chatList.css";
import Loading from "../../Loading";
import toast from "react-hot-toast";
import * as ConversationService from "../../../../services/ConversationService";
import socket from "../../../../socket";

const ChatList = () => {
    const [addMode, setAddMode] = useState(false);
    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const handleSearchUser = async () => {
        setLoading(true);
        try {
            const response = await ConversationService.searchUser(search);
            console.log("API Response:", response.data);
            setSearchUser(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message || "An error occurred");
        }
    };

    useEffect(() => {
        if (search) {
            handleSearchUser();
        } else {
            setSearchUser([]);
        }
    }, [search]);

    useEffect(() => {
        // Lắng nghe sự kiện "new-user" từ server
        socket.on("new-user", (newUser) => {
            setSearchUser((prevUsers) => [...prevUsers, newUser]);
            console.log("New user added:", newUser);
        });

        // Cleanup khi component bị unmount
        return () => {
            socket.off("new-user");
        };
    }, []);

    const handleUserClick = (userId) => {
        if (userId) {
            window.history.pushState(null, "", `/student/message/${userId}`);
        } else {
            console.error("User ID is undefined");
        }
    };

    return (
        <div className='chatList'>
            <div className="search">
                <div className="searchBar">
                    <img src="../images/search.png" alt="search icon" />
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <img
                    src={addMode ? '../images/minus.png' : "../images/plus.png"}
                    alt=""
                    className="add"
                    onClick={() => setAddMode((prev) => !prev)}
                />
            </div>

            <div className="userList">
                {loading ? (
                    <Loading />
                ) : (
                    searchUser.length > 0 ? (
                        searchUser.map((user) => (
                            <div
                                key={user._id}
                                className="item"
                                onClick={() => handleUserClick(user._id)}
                            >
                                <img src={user.avatar || "../images/default-avatar.png"} alt="avatar" />
                                <div className="texts">
                                    <span>{user.name}</span>
                                    <p>{user.message}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        search && <p className="text-center text-slate-500">No user found!</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ChatList;
