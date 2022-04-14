const express = require("express");
const admin_routes = require("./admin.routes");
const balance_routes = require("./balance.routes");
const contract_routes = require("./contract.routes");
const job_routes = require("./job.routes");
const routes = express.Router();

routes.use("/admin", admin_routes)
routes.use("/balances", balance_routes);
routes.use("/contracts", contract_routes)
routes.use("/jobs", job_routes);

module.exports = routes