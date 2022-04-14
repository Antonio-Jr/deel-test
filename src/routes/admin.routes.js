const express = require("express");
const { getBestProfessions, getBestClients } = require("../controllers/admins_controller");
const { getProfile } = require("../middleware/getProfile");
const admin_routes = express.Router();

admin_routes.get("/best-profession", getProfile, getBestProfessions);
admin_routes.get("/best-clients", getProfile, getBestClients);

module.exports = admin_routes;