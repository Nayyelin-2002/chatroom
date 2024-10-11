import React from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const Welcomepage = ({ username, setUsername, setRoom, room, setSocket }) => {
  const navigate = useNavigate();
  const joinRoom = (e) => {
    e.preventDefault();
    if (
      username.trim().length > 0 &&
      room !== "selectRoom" &&
      room.trim().length > 0
    ) {
      const socket_connect = io.connect("http://localhost:4000");
      setSocket(socket_connect);

      navigate("/chat", { replace: true });
    } else {
      window.alert("Fill user info");
    }
  };
  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 bg-gray-100 p-10 rounded-lg  ">
        <h1 className="text-4xl font-bold text-center text-blue-500 mb-6">
          Room.io
        </h1>
        <form action="" onSubmit={joinRoom}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="username"
              id="username"
              className="border-2 border-blue-500  p-3 rounded-lg w-full font-medium text-base"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <select
              name="room"
              id="room"
              className="border-2 border-blue-500  p-3 rounded-lg  font-medium text-base focus:ring-blue-500 block w-full text-center"
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="selectRoom">---Select Room---</option>
              <option value="react">React</option>
              <option value="node">Node</option>
            </select>
          </div>
          <button className="border-2 border-blue-500  p-3 rounded-lg  font-medium text-base bg-blue-500 w-full text-white">
            Join Room
          </button>
        </form>
      </div>
    </section>
  );
};

export default Welcomepage;
