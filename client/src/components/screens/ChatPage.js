import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";
import SideDrawer from "./SideDrawer";

const ChatPage = () => {
    // const { user } = ChatState();

    return(
        <div>
            <h1>
                Hello
            </h1>
            <SideDrawer />
            <MyChats />
            <ChatBox />
        </div>
    )
};

export default ChatPage;