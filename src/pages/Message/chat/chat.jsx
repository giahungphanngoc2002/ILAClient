import { useRef, useState } from "react"
import "./chat.css"
import EmojiPicker from 'emoji-picker-react'
import { useEffect } from "react"

const Chat = () => {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")

    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handleEmoji = e => {
        setText((prev) => prev + e.emoji)
        setOpen(false)
    }

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src="../images/avatar.png" alt="" />
                    <div className="texts">
                        <span>Thanh Trúc</span>
                        <p>Lorem ipsum dolor sit amet </p>
                    </div>
                </div>
                <div className="icons">
                    <img src="../images/phone.png" alt="" />
                    <img src="../images/video.png" alt="" />
                    <img src="../images/info.png" alt="" />
                </div>
            </div>
            <div className="center">
                <div className="message">
                    <img src="../images/avatar.png" alt="" />
                    <div className="texts">
                        <p>Tôi có thể giúp gì được cho bạn nhỉ ?</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>Tôi đang cần bạn giúp 1 việc rất quan trọng</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="../images/avatar.png" alt="" />
                    <div className="texts">
                        <p>Nêu cụ thể hơn để tôi có thể giúp cho bạn</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>Tôi đang cần 1 công việc với vị trí fullstack reacjs và expressJS</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="../images/avatar.png" alt="" />
                    <div className="texts">
                        <p>Tôi đã hiểu</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <img src="https://img.lovepik.com/free-png/20211130/lovepik-cartoon-avatar-png-image_401205251_wh1200.png" alt="" />
                        <p>Hãy giúp tôi</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src="../images/img.png" alt="" />
                    <img src="../images/camera.png" alt="" />
                    <img src="../images/mic.png" alt="" />
                </div>
                <input type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => { setText(e.target.value) }} />
                <div className="emoji">
                    <img
                        src="../images/emoji.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                    <div className="picket">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>

                </div>
                <button className="sendButton">Send</button>
            </div>
        </div>
    )
}

export default Chat
