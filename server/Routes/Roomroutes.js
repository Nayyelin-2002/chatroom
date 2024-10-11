const express = require("express");
const router = express.Router();
const messageController = require("../Controllers/message");

router.get("/chat/:roomName", messageController.getOldmessage);

module.exports = router;
