const express = require("express");
const requireLogin = require("../middleware/requireLogin");
const { accessChat, fetchChats } = require("../controllers/chatControllers")
const router = express.Router();

router.route("/").post(requireLogin, accessChat);
router.route("/").get(requireLogin, fetchChats);

module.exports = router;
