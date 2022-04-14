const express = require("express");
const { depositAmmount } = require("../controllers/balances.controller");
const { getProfile } = require("../middleware/getProfile");
const balance_routes = express.Router();

balance_routes.post("/deposit/:userId", getProfile, depositAmmount);

module.exports = balance_routes;