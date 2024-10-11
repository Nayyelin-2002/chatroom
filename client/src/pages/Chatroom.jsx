import React, { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRightEndOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
const Chatroom = ({ room, username, socket }) => {
  const navigate = useNavigate();
  const [roomuser, setRoomuser] = useState([]);
  const [receivedmeesage, setReceivedmeesage] = useState([]);
  const [sent_message, setSent_message] = useState("");
  const boxdivRef = useRef(null);

  ///
  const getOldmessages = async () => {
    try {
      console.log("Fetching messages for room:", room);
      const msgresponse = await fetch(
        `${import.meta.env.VITE_SERVER}/chat/${room}`
      );
      console.log("Response:", msgresponse);

      if (msgresponse.status === 403) {
        return navigate("/");
      }

      const OLDdata = await msgresponse.json();
      // console.log("Fetched messages:", data);
      setReceivedmeesage((prev) => [...prev, ...OLDdata]);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  //

  useEffect(() => {
    getOldmessages();
  }, []);
  ///

  useEffect(() => {
    //sent message to server
    socket.emit("joined_room", { username, room });

    //get message from server
    socket.on("message", (data) => {
      setReceivedmeesage((prev) => [...prev, data]);

      //get room user  from server
      socket.on("room_users", (data) => {
        let prevRoomuser = [...roomuser];
        //do not directly affect the original roomuser array.
        data.forEach((roomuser) => {
          const sameUserIndex = prevRoomuser.findIndex(
            (prevUser) => prevUser.id === roomuser.id
          );

          if (sameUserIndex !== -1) {
            prevRoomuser[sameUserIndex] = {
              ...prevRoomuser[sameUserIndex],
              ...data,
            };
          } else {
            prevRoomuser.push(roomuser);
          }
        });
        setRoomuser(prevRoomuser);
      });
    });
    return () => socket.disconnect();
  }, [socket]);

  const sendMessage = () => {
    if (sent_message.trim().length > 0) {
      socket.emit("message_sent", sent_message);
      setSent_message(" ");
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  useEffect(() => {
    if (boxdivRef.current) {
      boxdivRef.current.scrollTop = boxdivRef.current.scrollHeight;
    }
  }, [receivedmeesage]);
  return (
    <section className="flex gap-4 h-screen">
      {/* //left side */}
      <div className="w-1/3 bg-blue-600 text-white font-medium relative">
        <p className="text-3xl font-bold text-center mt-5">Room.io</p>
        <div className="flex mt-10 ps-2 bg-white items-center rounded-l-3xl">
          <p className="text-lg flex gap-2 items-end">
            <ChatBubbleLeftRightIcon width={30} className="text-blue-600" />
          </p>
          <p className="bg-white text-blue-500 ps-5 py-3 rounded-tl-full rounded-bl-full my-2">
            {room}
          </p>
        </div>
        <div className="mt-5 ps-2 mb-3">
          <p className="flex items-center gap-1 text-lg mb-3">
            {" "}
            <UserGroupIcon width={30} />
            Users
          </p>
          {roomuser.map((roomuser, i) => {
            return (
              <p key={i} className="flex gap-1 mb-1">
                <UserIcon width={20} />
                {roomuser.username === username ? "YOU" : roomuser.username}
              </p>
            );
          })}
        </div>
        <button
          className="absolute bottom-0 flex gap-2 flex-end w-full mx-2 my-2 p-3"
          onClick={leaveRoom}
        >
          <ArrowRightEndOnRectangleIcon width={30} />
          Leave Room
        </button>
      </div>
      {/* //right side  */}
      <div className="w-full pt-5 relative">
        <div className="h-[30rem] overflow-y-auto " ref={boxdivRef}>
          {receivedmeesage.map((msg, i) => {
            return (
              <div
                key={i}
                className="bg-blue-500 text-white px-3 py-2 w-3/4 rounded-br-3xl rounded-tl-3xl mb-3"
              >
                <p className="text-sm font-medium  font-mono">
                  from {msg.username}
                </p>
                <p className="text-lg font-mono font-medium">{msg.message}</p>
                <p className="text-sm font-mono font-medium text-right">
                  {formatDistanceToNow(msg.sent_at)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex absolute bottom-0 mb-5 items-end w-full px-2 py-3">
          <input
            type="text"
            placeholder="message"
            className="w-full border-b text-lg  me-2 outline-none  "
            value={sent_message}
            onChange={(e) => setSent_message(e.target.value)}
          />
          <button type="button" onClick={() => sendMessage()}>
            <PaperAirplaneIcon
              width={30}
              className="hover:text-blue-500 hover:-rotate-45 duration-200"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Chatroom;
