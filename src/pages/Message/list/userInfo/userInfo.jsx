import "./userinfo.css"

const Userinfo = () => {
    return (
        <div className='userInfo'>
            <div className='user'>
                <img src="../images/avatar.png" alt="" />
                <p>Trần Chí Phúc</p>
            </div>
            <div className='icons'>
                <img src="../images/more.png" />
                <img src="../images/video.png" />
                <img src="../images/edit.png" />
            </div>
        </div>
    );
};

export default Userinfo;