const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const formatMsg = require("./utils/formatMsg");
const app = express();

const roomroute = require("./Routes/Roomroutes");
//mongoose
const mongoose = require("mongoose");
require("dotenv").config();
//

//install model
const Message = require("./Models/Message");
//
const {
  saveuser,
  getdisconnectUser,
  getsameRoomusers,
} = require("./utils/users");

//
app.use(cors()); //m tuu nyi dk client twy lr join tr ko kr kwl phoh, third party application***
//
//connect mongoose
//
app.use(roomroute);
//

mongoose.connect(process.env.MONGO_URL).then((_) => {
  console.log("database coneected");
});

//
const server_listen = app.listen(4000, (_) => {
  console.log("Server is ruuning at 4000 port");
});

const io = socketIO(server_listen, {
  cors: "*", //protect for every reqs
});

////
//on =listen , emit=It is used to send data or events from the server to the client (or vice versa) over an established WebSocket connection.
io.on("connection", (socket) => {
  console.log("client connected");
  const Bot = "Chat room manager";

  socket.on("joined_room", (data) => {
    const user = saveuser(socket.id, data.username, data.room);
    socket.join(user.room);

    socket.emit("message", formatMsg(Bot, "Welcome to the socket room"));

    //new user join kygg ko joined pee the user ko pya
    socket.broadcast
      .to(user.room)
      .emit("message", formatMsg(Bot, user.username + " joined"));

    //listen message from client
    socket.on("message_sent", (data) => {
      io.to(user.room).emit("message", formatMsg(user.username, data));

      //store mesg in database
      Message.create({
        username: user.username,
        message: data,
        room: user.room,
      });
    });

    //same room users
    io.to(user.room).emit("room_users", getsameRoomusers(user.room));
  });
  //get disconnect msg from user first
  socket.on("disconnect", (_) => {
    //send message to user who wants to disconnect
    const DC_user = getdisconnectUser(socket.id);
    if (DC_user) {
      //       console.log("dv", DC_user);
      io.to(DC_user.room).emit(
        "message",
        formatMsg(Bot, DC_user.username + " left the chat")
      ); //arr lone ko poh mhr m loh io ko 3
    }
    io.to(DC_user.room).emit("room_users", getsameRoomusers(DC_user.room));
  });
  //user one ka join tr
});
