import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcomepage from "./pages/Welcomepage";
import Chatroom from "./pages/Chatroom";
import { useState } from "react";
const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  //socket
  const [socket, setSocket] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Welcomepage
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
          setSocket={setSocket}
        />
      ),
    },
    {
      path: "/chat",
      element: <Chatroom username={username} room={room} socket={socket} />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
