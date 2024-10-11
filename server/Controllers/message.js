const Message = require("../Models/Message");
const OPEND_ROOMS = ["react", "node"];
exports.getOldmessage = (req, res, next) => {
  const { roomName } = req.params;
  if (OPEND_ROOMS.includes(roomName)) {
    Message.find({ room: roomName })
      .select("username message sent_at")
      .then((message) => {
        res.status(200).json(message);
      });
  } else {
    res.status(403).json("it is not a room");
  }
};
