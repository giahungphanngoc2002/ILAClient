import { useState } from "react";
import "./chatList.css"

const ChatList = () => {
    const [addMode, setaddMode] = useState(false)
    return (
        <div className='chatList'>
            <div className="search">
                <div className="searchBar">
                    <img src="../images/search.png" />
                    <input type="text" placeholder="Search by name " />
                </div>
                {/* thay đổi trạng thái của plus và minus khi chúng ta click vào */}
                <img src={addMode ? '../images/minus.png' : "../images/plus.png"} alt="" className="add"
                    onClick={() => setaddMode((prev) => !prev)} />

            </div>
            <div className="item">
                <img src="../images/avatar.png" alt="" />
                <div className="texts">
                    <span>Thanh Trúc</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className="item">
                <img src="../images/avatar.png" alt="" />
                <div className="texts">
                    <span>Trần Đình Triều</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className="item">
                <img src="../images/avatar.png" alt="" />
                <div className="texts">
                    <span>Trần Đình Triều</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className="item">
                <img src="../images/avatar.png" alt="" />
                <div className="texts">
                    <span>Trần Đình Triều</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className="item">
                <img src="../images/avatar.png" alt="" />
                <div className="texts">
                    <span>Trần Đình Triều</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className="item">
                <img src="../images/avatar.png" alt="" />
                <div className="texts">
                    <span>Bùi Văn Hùng</span>
                    <p>Hello</p>
                </div>
            </div>
        </div>
    );
};

export default ChatList;