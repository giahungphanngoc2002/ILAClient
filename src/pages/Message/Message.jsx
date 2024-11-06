import React from 'react';
import List from './list/List';
import Chat from './chat/chat';
import Detail from './detail/detail';
import './message.css';

const Message = () => {
    return (
        <div className="messages">
            <div className="messagesList">
                <div className="list">
                    <List />
                </div>
                <div className="chat">
                    <Chat />
                </div>
                <div className="detail">
                    <Detail />
                </div>
            </div>
        </div>
    );
};

export default Message;
