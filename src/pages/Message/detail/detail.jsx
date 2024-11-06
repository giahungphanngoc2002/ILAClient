import "./details.css"

const Detail = () => {
    return (
        <div className='detail'>
            <div className="user">
                <img src="../images/avatar.png" alt="" />
                <h2>Thanh trúc</h2>
                <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="../images/arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="../images/arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="../images/arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <img src="../images/arrowDown.png" alt="" />
                    </div>
                    <div className="photos">


                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://img.lovepik.com/free-png/20211130/lovepik-cartoon-avatar-png-image_401205251_wh1200.png" alt="" />

                                <span>photo_2023_2.png</span>
                            </div>
                            <img src="../images/download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://img.lovepik.com/free-png/20211130/lovepik-cartoon-avatar-png-image_401205251_wh1200.png" alt="" />

                                <span>photo_2023_2.png</span>
                            </div>
                            <img src="../images/download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://img.lovepik.com/free-png/20211130/lovepik-cartoon-avatar-png-image_401205251_wh1200.png" alt="" />

                                <span>photo_2023_2.png</span>
                            </div>
                            <img src="../images/download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://img.lovepik.com/free-png/20211130/lovepik-cartoon-avatar-png-image_401205251_wh1200.png" alt="" />

                                <span>photo_2023_2.png</span>
                            </div>
                            <img src="../images/download.png" alt="" className="icon" />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="../images/arrowUp.png" alt="" />
                    </div>
                </div>
                <button>Block User</button>
                <button className="logout">Logout </button>
            </div>
        </div>
    );
};

export default Detail;