const express = require("express");
const { getContractById, getAllNonTerminatedContracts } = require("../controllers/contracts_controller");
const { getProfile } = require("../middleware/getProfile");

const contract_routes = express.Router();

contract_routes.get("/:id", getProfile, getContractById)
contract_routes.get("/", getProfile, getAllNonTerminatedContracts)

module.exports = contract_routes