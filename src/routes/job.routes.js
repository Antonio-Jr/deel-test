const express = require("express");
const { getAllUnpaidJobs, payJob } = require("../controllers/jobs_controller");
const { getProfile } = require("../middleware/getProfile");
const job_routes = express.Router();

job_routes.get("/unpaid", getProfile, getAllUnpaidJobs);
job_routes.post("/:job_id/pay", getProfile, payJob)

module.exports = job_routes;