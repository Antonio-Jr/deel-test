const request = require("supertest");
const app = require("../src/app");
const contract_status = require("../src/enums/contract_status");

describe("Test Jobs", () => {
  test("Should be able to list all unpaid jobs from a client", async () => {
    const profile_id = 1;
    const response = await request(app).get("/jobs/unpaid").set({ profile_id })

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].Contract.ClientId).toBe(profile_id);
    expect(response.body[0].status).not.toEqual(contract_status.TERMINATED);
    expect(response.body[0].paid).toBe(null);
  });

  test("Should be able to list all unpaid jobs as a contractor profile", async () => {
    const profile_id = 6;
    const response = await request(app).get("/jobs/unpaid").set({ profile_id })

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].Contract.ContractorId).toBe(profile_id);
    expect(response.body[0].status).not.toEqual(contract_status.TERMINATED);
    expect(response.body[0].paid).toBe(null);
  });

  test("Should not be able to list all unpaid jobs from a client if he hasn't it", async () => {
    const profile_id = 3;
    const response = await request(app).get("/jobs/unpaid").set({ profile_id });

    expect(response.statusCode).toEqual(404);
  });

  test("Should be able to pay a job given a job id", async () => {
    const profile_id = 2;
    const job_id = 4;
    const response = await request(app).post(`/jobs/${job_id}/pay`).set({ profile_id });

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("The job was paid successfully!");
  });

  test("Should not be able to pay a job if this jobs does not exists", async () => {
    const profile_id = 1;
    const job_id = 1080;
    const response = await request(app).post(`/jobs/${job_id}/pay`).set({ profile_id });

    expect(response.statusCode).toEqual(404);
  });

  test("Should not be able to pay a job if user is a contractor", async () => {
    const profile_id = 6;
    const job_id = 3;
    const response = await request(app).post(`/jobs/${job_id}/pay`).set({ profile_id });

    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Only clients can pay for a job");
  });

  test("Should not be able to pay a job if client's balance is less than job price", async () => {
    const profile_id = 2;
    const job_id = 3;
    const response = await request(app).post(`/jobs/${job_id}/pay`).set({ profile_id });

    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Insufficient balance");
  });

  test("Should not be able to pay a job if it's already paid", async () => {
    const profile_id = 4;
    const job_id = 6;
    const response = await request(app).post(`/jobs/${job_id}/pay`).set({ profile_id });

    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Job is already paid");
  });
});